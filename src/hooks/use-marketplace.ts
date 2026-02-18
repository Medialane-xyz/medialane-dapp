import { useState, useCallback } from "react";
import { useAccount, useContract, useNetwork, useProvider } from "@starknet-react/core";
import { Abi, shortString, constants } from "starknet";
import { IPMarketplaceABI } from "@/abis/ip_market";
import { useToast } from "@/components/ui/use-toast";
import { getOrderParametersTypedData, getOrderCancellationTypedData, stringifyBigInts } from "@/utils/marketplace-utils";

interface UseMarketplaceReturn {
    createListing: (params: any) => Promise<string | undefined>;
    buyItem: (orderParams: any, fulfillmentParams: any) => Promise<string | undefined>;
    cancelOrder: (orderHash: string) => Promise<string | undefined>;
    cancelListing: (orderHash: string) => Promise<string | undefined>;

    isProcessing: boolean;
    isLoading: boolean; // For compatibility
    txHash: string | null;
    error: string | null;
    resetState: () => void;
}

export function useMarketplace(): UseMarketplaceReturn {
    const { account, address } = useAccount();
    const { chain } = useNetwork();
    const { toast } = useToast();
    const { provider } = useProvider();

    const [isProcessing, setIsProcessing] = useState(false);
    const [txHash, setTxHash] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { contract: medialaneContract } = useContract({
        address: process.env.NEXT_PUBLIC_MEDIALANE_CONTRACT_ADDRESS as `0x${string}`,
        abi: IPMarketplaceABI as any[],
    });

    const resetState = useCallback(() => {
        setTxHash(null);
        setError(null);
        setIsProcessing(false);
    }, []);

    const createListing = useCallback(async (params: any) => {
        if (!account || !medialaneContract || !chain) {
            const msg = "Account, contract, or network not available";
            setError(msg);
            toast({ title: "Error", description: msg, variant: "destructive" });
            return undefined;
        }

        setIsProcessing(true);
        setError(null);

        try {
            // 1. Fetch current nonce
            console.log("Fetching nonce for:", account.address);
            const currentNonce = await medialaneContract.nonces(account.address);
            console.log("Current nonce:", currentNonce.toString());

            // 2. Prepare order parameters for signing
            const orderParams = {
                ...params,
                nonce: currentNonce.toString(),
            };

            // 3. Generate typed data and sign
            const chainId = chain.id as any as constants.StarknetChainId;
            const typedData = stringifyBigInts(getOrderParametersTypedData(orderParams, chainId));

            console.log("Signing typed data:", typedData);
            const signature = await account.signMessage(typedData);

            const signatureArray = Array.isArray(signature)
                ? signature
                : [signature.r.toString(), signature.s.toString()];

            console.log("Signature generated:", signatureArray);

            // 4. Register the order (with shortString encoding for item_type)
            const registerPayload = stringifyBigInts({
                parameters: {
                    ...orderParams,
                    offer: {
                        ...orderParams.offer,
                        item_type: shortString.encodeShortString(orderParams.offer.item_type)
                    },
                    consideration: {
                        ...orderParams.consideration,
                        item_type: shortString.encodeShortString(orderParams.consideration.item_type)
                    },
                },
                signature: signatureArray,
            });

            console.log("Registering order with payload:", registerPayload);

            // Hash verification (Troubleshooting)
            try {
                const localHash = await account.hashMessage(typedData);
                const contractHash = await medialaneContract.get_order_hash(registerPayload.parameters, account.address);
                const contractHashHex = "0x" + BigInt(contractHash).toString(16);

                console.log("Verification - Local Hash:", localHash);
                console.log("Verification - Contract Hash:", contractHashHex);

                if (localHash !== contractHashHex) {
                    console.warn("HASH MISMATCH: Local hash does not match contract hash. Signature will likely be rejected.");
                } else {
                    console.log("HASH MATCH: Local and contract hashes are consistent.");
                }
            } catch (hashErr) {
                console.warn("Could not verify hash mismatch:", hashErr);
            }

            // Execute transaction via account for better control/compatibility
            const call = medialaneContract.populate("register_order", [registerPayload]);
            const tx = await account.execute(call);
            console.log("Transaction sent:", tx.transaction_hash);

            // Wait for transaction confirmation
            console.log("Waiting for transaction confirmation:", tx.transaction_hash);
            await provider.waitForTransaction(tx.transaction_hash);

            setTxHash(tx.transaction_hash);
            toast({
                title: "Listing Created",
                description: "Your asset has been listed successfully.",
            });

            return tx.transaction_hash;
        } catch (err: any) {
            console.error("Error in createListing:", err);
            const msg = err.message || "Failed to create listing";
            setError(msg);
            toast({ title: "Error", description: msg, variant: "destructive" });
            return undefined;
        } finally {
            setIsProcessing(false);
        }
    }, [account, medialaneContract, chain, toast, provider]);

    const buyItem = useCallback(async (order: any, fulfillment: any) => {
        console.warn("buyItem: Not implemented yet (Stubbed)");
        setError("Functionality temporarily disabled (Under maintenance)");
        return undefined;
    }, []);

    const cancelOrder = useCallback(async (orderHash: string) => {
        if (!account || !medialaneContract || !chain) {
            const msg = "Account, contract, or network not available";
            setError(msg);
            toast({ title: "Error", description: msg, variant: "destructive" });
            return undefined;
        }

        setIsProcessing(true);
        setError(null);

        try {
            // 1. Fetch current nonce for cancellation
            const currentNonce = await medialaneContract.nonces(account.address);

            // 2. Prepare cancellation parameters
            // OrderCancellation: { order_hash, offerer, nonce }
            const cancelParams = {
                order_hash: orderHash,
                offerer: account.address,
                nonce: currentNonce.toString(),
            };

            // 3. Generate typed data and sign
            const chainId = chain.id as any as constants.StarknetChainId;
            const typedData = stringifyBigInts(getOrderCancellationTypedData(cancelParams, chainId));

            console.log("Signing cancellation typed data:", typedData);
            const signature = await account.signMessage(typedData);

            const signatureArray = Array.isArray(signature)
                ? signature
                : [signature.r.toString(), signature.s.toString()];

            console.log("Cancellation signature generated:", signatureArray);

            const cancelRequest = stringifyBigInts({
                cancelation: cancelParams,
                signature: signatureArray,
            });

            const call = medialaneContract.populate("cancel_order", [cancelRequest]);
            const tx = await account.execute(call);

            // Wait for transaction confirmation
            console.log("Waiting for transaction confirmation:", tx.transaction_hash);
            await provider.waitForTransaction(tx.transaction_hash);

            setTxHash(tx.transaction_hash);
            toast({
                title: "Listing Cancelled",
                description: "The listing has been successfully cancelled on-chain.",
            });

            return tx.transaction_hash;
        } catch (err: any) {
            console.error("Error in cancelOrder:", err);
            const msg = err.message || "Failed to cancel listing";
            setError(msg);
            toast({ title: "Error", description: msg, variant: "destructive" });
            return undefined;
        } finally {
            setIsProcessing(false);
        }
    }, [account, medialaneContract, chain, toast, provider]);

    return {
        createListing,
        buyItem,
        cancelOrder,
        cancelListing: cancelOrder,
        isProcessing,
        isLoading: isProcessing,
        txHash,
        error,
        resetState
    };
}
