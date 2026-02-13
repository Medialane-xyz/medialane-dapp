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
import {
    OrderParameters,
    Fulfillment,
    Cancelation,
    ItemType,
    OrderType
} from "@/types/marketplace";

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
        address: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as `0x${string}`,
        abi: IPMarketplaceABI as Abi,
    });

    const resetState = useCallback(() => {
        setIsProcessing(false);
        setTxHash(null);
        setError(null);
    }, []);

    // --- CREATE LISTING (register_order) ---
    const createListing = useCallback(async (params: any) => {
        if (!account || !contract || !chain) {
            setError("Wallet or contract not ready");
            return;
        }

        setIsProcessing(true);
        setError(null);
        setTxHash(null);

        try {
            const chainId = chain.id.toString();
            console.log("Creating listing with params:", params);

            // 1. Prepare Typed Data for SNIP-12
            const typedData = prepareOrderForSigning(params, chainId);

            // 2. Sign
            console.log("Requesting signature...");
            const signature = await account.signMessage(typedData);
            const signatureArray = Array.isArray(signature) ? signature : [signature];

            // 3. Execute Transaction
            // Struct expected by Cairo: Order { parameters: OrderParameters, signature: felt252[] }
            const orderStruct = {
                parameters: params,
                signature: signatureArray
            };

            console.log("Submitting transaction register_order...");
            const { transaction_hash } = await account.execute([
                contract.populate("register_order", [orderStruct])
            ]);

            setTxHash(transaction_hash);
            toast({
                title: "Listing Created",
                description: "Your asset is now listed on the marketplace.",
            });

            return transaction_hash;

        } catch (err: any) {
            console.error("Create Listing Failed:", err);
            setError(err.message || "Failed to create listing");
            toast({
                title: "Error",
                description: err.message || "Failed to create listing",
                variant: "destructive"
            });
        } finally {
            setIsProcessing(false);
        }
    }, [account, contract, chain, toast]);

    // --- BUY ITEM (fulfill_order) ---
    const buyItem = useCallback(async (order: any, fulfillment: any) => {
        if (!account || !contract || !chain) {
            setError("Wallet or contract not ready");
            return;
        }

        setIsProcessing(true);
        setError(null);
        setTxHash(null);

        try {
            const chainId = chain.id.toString();

            // 1. Prepare Fulfillment Typed Data
            // We sign the Fulfillment struct which contains order_hash and fulfiller
            // Fulfillment = { fulfiller, order_hash, nonce }

            // Note: The fulfiller is the Buyer (current account)
            const fulfillmentData = {
                ...fulfillment,
                fulfiller: address // Ensure we sign as ourselves
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

            // If paying with ERC20, we might need an approve() call first!
            // Seaport usually requires:
            // 1. Approve Currency -> Marketplace
            // 2. Fulfill Order
            // We should check if approval is needed.
            // For now, assuming approval is handled separately or user has approved.
            // Best practice: Multi-call (Approve + Fulfill)

            // Check consideration item to find currency
            const consideration = order.parameters?.consideration?.[0]; // Assuming simple listing
            // If ItemType is ERC20 (1) or Native (0)

            const calls = [];

            // Add approval if needed (simplified logic)
            if (consideration && consideration.item_type === ItemType.ERC20) {
                calls.push({
                    contractAddress: consideration.token,
                    entrypoint: "approve",
                    calldata: [contract.address, consideration.start_amount, "0"] // u256
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
    }, [account, contract, chain, address, toast]);

    // --- CANCEL LISTING (cancel_order) ---
    const cancelListing = useCallback(async (cancelParams: any) => {
        if (!account || !contract || !chain) {
            setError("Wallet or contract not ready");
            return;
        }

        setIsProcessing(true);
        setError(null);
        setTxHash(null);

        try {
            const chainId = chain.id.toString();

            const typedData = prepareCancelationForSigning(cancelParams, chainId);
            const signature = await account.signMessage(typedData);
            const signatureArray = Array.isArray(signature) ? signature : [signature];

            const cancelRequest = {
                cancelation: cancelParams,
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
    }, [account, contract, chain, toast]);

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
