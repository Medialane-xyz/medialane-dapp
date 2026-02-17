"use client"

import { useState, useCallback } from "react";
import { useAccount, useContract, useNetwork } from "@starknet-react/core";
import { Abi } from "starknet";
import { IPMarketplaceABI } from "@/abis/ip_market";
import { useToast } from "@/components/ui/use-toast";
import {
    prepareOrderForSigning,
    prepareFulfillmentForSigning,
    prepareCancelationForSigning
} from "@/lib/hash";

// On-chain contract uses simple felt252 for all fields - no enums, no u256
// offer/consideration are single structs, not arrays

interface UseMarketplaceReturn {
    createListing: (listingParams: any) => Promise<string | undefined>;
    buyItem: (orderParams: any, fulfillmentParams: any) => Promise<string | undefined>;
    cancelListing: (cancelParams: any) => Promise<string | undefined>;

    isProcessing: boolean;
    txHash: string | null;
    error: string | null;
    resetState: () => void;
}

export function useMarketplace(): UseMarketplaceReturn {
    const { account, address } = useAccount();
    const { chain } = useNetwork();
    const { toast } = useToast();

    const [isProcessing, setIsProcessing] = useState(false);
    const [txHash, setTxHash] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { contract } = useContract({
        address: process.env.NEXT_PUBLIC_MEDIALANE_CONTRACT_ADDRESS as `0x${string}`,
        abi: IPMarketplaceABI as Abi,
    });

    const resetState = useCallback(() => {
        setIsProcessing(false);
        setTxHash(null);
        setError(null);
    }, []);

    // --- HELPERS ---

    const getNonce = useCallback(async (owner: string) => {
        if (!contract) return "0";
        try {
            const nonce = await contract.call("nonces", [owner]);
            return nonce.toString();
        } catch (err) {
            console.error("Failed to fetch nonce:", err);
            return "0";
        }
    }, [contract]);

    // --- CREATE LISTING (register_order) ---
    const createListing = useCallback(async (params: any) => {
        if (!account || !contract || !chain || !address) {
            setError("Wallet or contract not ready");
            return;
        }

        setIsProcessing(true);
        setError(null);
        setTxHash(null);

        try {
            const chainId = chain.id.toString();

            // Fetch current nonce from contract
            const currentNonce = await getNonce(address);
            const paramsWithNonce = {
                ...params,
                nonce: currentNonce
            };

            console.log("Creating listing/offer with params (and fetched nonce):", paramsWithNonce);

            // 1. Prepare Typed Data for SNIP-12 Signing
            const typedData = prepareOrderForSigning(paramsWithNonce, chainId);
            console.log("Typed Data for signing:", JSON.stringify(typedData, null, 2));

            // 2. Sign the Message (Typed Data)
            console.log("Requesting SNIP-12 signature...");
            let signature;
            try {
                signature = await account.signMessage(typedData);
            } catch (err: any) {
                console.error("Signing failed:", err);
                throw new Error(`Signing failed: ${err.message}`);
            }

            // Convert to Array<felt252> for contract
            const signatureArray = Array.isArray(signature) ? signature : [signature];
            console.log("Signature received:", signatureArray);

            // 3. Build Multicall: Approve + Register
            const orderStruct = {
                parameters: paramsWithNonce,
                signature: signatureArray
            };

            const marketplaceAddress = contract.address;

            // Logic to determine what needs approval
            // For a Listing: offer is NFT, consideration is Payment
            // For an Offer: offer is Payment, consideration is NFT
            const itemToApprove = params.offer;
            const assetAddress = itemToApprove.token;
            const itemType = Number(itemToApprove.item_type);

            console.log("Submitting multicall: approve + register_order");

            const calls = [];

            // Add approval call based on item type (ERC20: 1, ERC721: 2, ERC1155: 3)
            if (itemType === 1) {
                // ERC20: Approve amount (end_amount is ceiling)
                // contract expects u256 for amount: [low, high]
                const amount = itemToApprove.end_amount;
                calls.push({
                    contractAddress: assetAddress,
                    entrypoint: "approve",
                    calldata: [marketplaceAddress, amount, 0] // u256 [low, high]
                });
            } else if (itemType === 2 || itemType === 3) {
                // NFT: Approve token ID
                const tokenId = itemToApprove.identifier_or_criteria;
                calls.push({
                    contractAddress: assetAddress,
                    entrypoint: "approve",
                    calldata: [marketplaceAddress, tokenId, 0] // u256 [low, high]
                });
            }

            // Call 2: Register Order
            calls.push(contract.populate("register_order", [orderStruct]));

            const { transaction_hash } = await account.execute(calls);

            setTxHash(transaction_hash);
            const isOffer = itemType === 1;
            toast({
                title: isOffer ? "Offer Created" : "Listing Created",
                description: isOffer ? "Your offer has been submitted." : "Your asset is now listed on the marketplace.",
            });

            return transaction_hash;

        } catch (err: any) {
            console.error("Action Failed:", err);
            setError(err.message || "Operation failed");
            toast({
                title: "Error",
                description: err.message || "Operation failed",
                variant: "destructive"
            });
        } finally {
            setIsProcessing(false);
        }
    }, [account, contract, chain, address, getNonce, toast]);


    // --- BUY ITEM (fulfill_order) ---
    const buyItem = useCallback(async (order: any, fulfillment: any) => {
        if (!account || !contract || !chain || !address) {
            setError("Wallet or contract not ready");
            return;
        }

        setIsProcessing(true);
        setError(null);
        setTxHash(null);

        try {
            const chainId = chain.id.toString();

            // Fetch current nonce
            const currentNonce = await getNonce(address);

            const fulfillmentData = {
                ...fulfillment,
                fulfiller: address,
                nonce: currentNonce
            };

            const typedData = prepareFulfillmentForSigning(fulfillmentData, chainId);

            // 2. Sign
            console.log("Requesting fulfillment signature...");
            const signature = await account.signMessage(typedData);
            const signatureArray = Array.isArray(signature) ? signature : [signature];

            // 3. Execute
            const fulfillmentRequest = {
                fulfillment: fulfillmentData,
                signature: signatureArray
            };

            const calls = [];

            // Add approval if the consideration is ERC20 (item_type = 1)
            const consideration = order.parameters?.consideration;
            if (consideration && Number(consideration.item_type) === 1) {
                calls.push({
                    contractAddress: consideration.token,
                    entrypoint: "approve",
                    calldata: [contract.address, consideration.start_amount]
                });
            }

            calls.push(contract.populate("fulfill_order", [fulfillmentRequest]));

            console.log("Submitting buy transaction...", calls);
            const { transaction_hash } = await account.execute(calls);

            setTxHash(transaction_hash);
            toast({
                title: "Purchase Successful",
                description: "You successfully bought the item!",
            });

            return transaction_hash;

        } catch (err: any) {
            console.error("Buy Item Failed:", err);
            setError(err.message);
            toast({
                title: "Error",
                description: err.message,
                variant: "destructive"
            });
        } finally {
            setIsProcessing(false);
        }
    }, [account, contract, chain, address, getNonce, toast]);

    // --- CANCEL LISTING (cancel_order) ---
    const cancelListing = useCallback(async (cancelParams: any) => {
        if (!account || !contract || !chain || !address) {
            setError("Wallet or contract not ready");
            return;
        }

        setIsProcessing(true);
        setError(null);
        setTxHash(null);

        try {
            const chainId = chain.id.toString();

            // Fetch current nonce
            const currentNonce = await getNonce(address);
            const cancelWithNonce = {
                ...cancelParams,
                nonce: currentNonce
            };

            const typedData = prepareCancelationForSigning(cancelWithNonce, chainId);
            const signature = await account.signMessage(typedData);
            const signatureArray = Array.isArray(signature) ? signature : [signature];

            const cancelRequest = {
                cancelation: cancelWithNonce,
                signature: signatureArray
            };

            const { transaction_hash } = await account.execute([
                contract.populate("cancel_order", [cancelRequest])
            ]);

            setTxHash(transaction_hash);
            toast({
                title: "Listing Cancelled",
                description: "Your listing has been cancelled.",
            });

            return transaction_hash;
        } catch (err: any) {
            console.error("Cancel Failed:", err);
            setError(err.message);
        } finally {
            setIsProcessing(false);
        }
    }, [account, contract, chain, address, getNonce, toast]);

    return {
        createListing,
        buyItem,
        cancelListing,
        isProcessing,
        txHash,
        error,
        resetState
    };
}
