import { useState, useCallback } from "react";
import { useAccount, useContract, useNetwork, useProvider } from "@starknet-react/core";
import { Abi, shortString, constants } from "starknet";
import { IPMarketplaceABI } from "@/abis/ip_market";
import { useToast } from "@/components/ui/use-toast";
import { getOrderParametersTypedData, getOrderCancellationTypedData, stringifyBigInts } from "@/utils/marketplace-utils";

interface UseMarketplaceReturn {
    createListing: (
        assetContractAddress: string,
        tokenId: string,
        price: string,
        currencySymbol: string,
        durationSeconds: number
    ) => Promise<string | undefined>;
    makeOffer: (
        assetContractAddress: string,
        tokenId: string,
        price: string,
        currencySymbol: string,
        durationSeconds: number
    ) => Promise<string | undefined>;
    buyItem: (orderParams: any, fulfillmentParams: any) => Promise<string | undefined>;
    checkoutCart: (items: any[]) => Promise<string | undefined>;
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

    const createListing = useCallback(async (
        assetContractAddress: string,
        tokenId: string,
        price: string,
        currencySymbol: string,
        durationSeconds: number
    ) => {
        if (!account || !medialaneContract || !chain) {
            const msg = "Account, contract, or network not available";
            setError(msg);
            toast({ title: "Error", description: msg, variant: "destructive" });
            return undefined;
        }

        setIsProcessing(true);
        setError(null);

        try {
            // 1. Calculate Order Parameters
            const now = Math.floor(Date.now() / 1000)
            const startTime = now + 300 // 5 minutes in future buffer for tx inclusion
            const endTime = now + durationSeconds
            const salt = Math.floor(Math.random() * 1000000).toString()

            const decimals = currencySymbol === "USDC" || currencySymbol === "USDT" ? 6 : 18
            const priceWei = BigInt(Math.floor(parseFloat(price) * Math.pow(10, decimals))).toString()

            // Safe import of SUPPORTED_TOKENS might require adjusting if it causes circular deps, 
            // but assuming it's available from @/lib/constants
            const { SUPPORTED_TOKENS } = await import("@/lib/constants");
            const currencyAddress = SUPPORTED_TOKENS.find((t: any) => t.symbol === currencySymbol)?.address

            if (!currencyAddress) throw new Error("Unsupported currency selected");

            // 2. Fetch current nonce
            console.log("Fetching nonce for:", account.address);
            const currentNonce = await medialaneContract.nonces(account.address);
            console.log("Current nonce:", currentNonce.toString());

            // 3. Prepare full order parameters for signing
            const orderParams = {
                offerer: account.address,
                offer: {
                    item_type: "ERC721",
                    token: assetContractAddress,
                    identifier_or_criteria: tokenId,
                    start_amount: "1",
                    end_amount: "1"
                },
                consideration: {
                    item_type: "ERC20",
                    token: currencyAddress,
                    identifier_or_criteria: "0",
                    start_amount: priceWei,
                    end_amount: priceWei,
                    recipient: account.address
                },
                start_time: startTime.toString(),
                end_time: endTime.toString(),
                salt: salt,
                nonce: currentNonce.toString(),
            };

            // 4. Generate typed data and sign
            const chainId = chain.id as any as constants.StarknetChainId;
            const typedData = stringifyBigInts(getOrderParametersTypedData(orderParams, chainId));

            console.log("Signing typed data:", typedData);
            const signature = await account.signMessage(typedData);

            const signatureArray = Array.isArray(signature)
                ? signature
                : [signature.r.toString(), signature.s.toString()];

            console.log("Signature generated:", signatureArray);

            // 5. Register the order (with shortString encoding for item_type)
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

    const makeOffer = useCallback(async (
        assetContractAddress: string,
        tokenId: string,
        price: string,
        currencySymbol: string,
        durationSeconds: number
    ) => {
        if (!account || !medialaneContract || !chain) {
            const msg = "Account, contract, or network not available";
            setError(msg);
            toast({ title: "Error", description: msg, variant: "destructive" });
            return undefined;
        }

        setIsProcessing(true);
        setError(null);

        try {
            // 1. Calculate Order Parameters
            const now = Math.floor(Date.now() / 1000)
            const startTime = now + 300 // 5 minutes in future buffer for tx inclusion
            const endTime = now + durationSeconds
            const salt = Math.floor(Math.random() * 1000000).toString()

            const decimals = currencySymbol === "USDC" || currencySymbol === "USDT" ? 6 : 18
            const priceWei = BigInt(Math.floor(parseFloat(price) * Math.pow(10, decimals))).toString()

            const { SUPPORTED_TOKENS } = await import("@/lib/constants");
            const currencyAddress = SUPPORTED_TOKENS.find((t: any) => t.symbol === currencySymbol)?.address

            if (!currencyAddress) throw new Error("Unsupported currency selected");

            // 2. Fetch current nonce
            console.log("Fetching nonce for:", account.address);
            const currentNonce = await medialaneContract.nonces(account.address);
            console.log("Current nonce:", currentNonce.toString());

            // 3. Prepare full order parameters for signing
            // INVERTED FOR OFFERS: We offer ERC20, we ask for ERC721
            const orderParams = {
                offerer: account.address,
                offer: {
                    item_type: "ERC20",
                    token: currencyAddress,
                    identifier_or_criteria: "0",
                    start_amount: priceWei,
                    end_amount: priceWei
                },
                consideration: {
                    item_type: "ERC721",
                    token: assetContractAddress,
                    identifier_or_criteria: tokenId,
                    start_amount: "1",
                    end_amount: "1",
                    recipient: account.address
                },
                start_time: startTime.toString(),
                end_time: endTime.toString(),
                salt: salt,
                nonce: currentNonce.toString(),
            };

            // 4. Generate typed data and sign
            const chainId = chain.id as any as constants.StarknetChainId;
            const typedData = stringifyBigInts(getOrderParametersTypedData(orderParams, chainId));

            console.log("Signing offer typed data:", typedData);
            const signature = await account.signMessage(typedData);

            const signatureArray = Array.isArray(signature)
                ? signature
                : [signature.r.toString(), signature.s.toString()];

            console.log("Offer signature generated:", signatureArray);

            // 5. Register the order
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

            console.log("Registering offer with payload:", registerPayload);

            // Verify Hash locally
            try {
                const localHash = await account.hashMessage(typedData);
                const contractHash = await medialaneContract.get_order_hash(registerPayload.parameters, account.address);
                const contractHashHex = "0x" + BigInt(contractHash).toString(16);

                if (localHash !== contractHashHex) {
                    console.warn("HASH MISMATCH: Local hash does not match contract hash.");
                } else {
                    console.log("HASH MATCH: Local and contract hashes are consistent.");
                }
            } catch (hashErr) {
                console.warn("Could not verify hash mismatch:", hashErr);
            }

            const call = medialaneContract.populate("register_order", [registerPayload]);

            const { cairo } = await import("starknet");
            const amountUint256 = cairo.uint256(priceWei);

            const approveCall = {
                contractAddress: currencyAddress,
                entrypoint: "approve",
                calldata: [medialaneContract.address, amountUint256.low.toString(), amountUint256.high.toString()],
            };

            // Execute BOTH approve and register_order in one atomic multicall!
            const tx = await account.execute([approveCall, call]);
            console.log("Offer MultiCall sent:", tx.transaction_hash);

            console.log("Waiting for transaction confirmation:", tx.transaction_hash);
            await provider.waitForTransaction(tx.transaction_hash);

            setTxHash(tx.transaction_hash);
            toast({
                title: "Offer Placed",
                description: "Your offer has been submitted and is now live.",
            });

            return tx.transaction_hash;
        } catch (err: any) {
            console.error("Error in makeOffer:", err);
            const msg = err.message || "Failed to make offer";
            setError(msg);
            toast({ title: "Error", description: msg, variant: "destructive" });
            return undefined;
        } finally {
            setIsProcessing(false);
        }
    }, [account, medialaneContract, chain, toast, provider]);

    const buyItem = useCallback(async (order: any, fulfillment: any) => {
        if (!account || !medialaneContract || !chain) {
            const msg = "Account, contract, or network not available";
            setError(msg);
            toast({ title: "Error", description: msg, variant: "destructive" });
            return undefined;
        }

        setIsProcessing(true);
        setError(null);

        try {
            // 1. We must execute an Approve for the ERC20 token, and then the Fulfill call.
            // When buying, the buyer is the "fulfiller". The seller is the "offerer".
            // The item the buyer gives up is in the `consideration` array.

            // Validate that we have a proper consideration
            if (!order || !order.consideration) {
                throw new Error("Invalid order data for fulfillment");
            }

            // Extract what the buyer has to pay
            const currencyAddress = order.consideration.token;
            const priceWei = order.consideration.start_amount; // e.g. "1000000"

            if (!currencyAddress || !priceWei) {
                throw new Error("Missing currency or price in order parameters");
            }

            // 2. Fetch current nonce for the buyer
            console.log("Fetching nonce for buyer:", account.address);
            const currentNonce = await medialaneContract.nonces(account.address);
            console.log("Current nonce:", currentNonce.toString());

            // 3. Prepare Fulfillment Request Typed Data
            // We need to sign an OrderFulfillment struct
            const { getOrderFulfillmentTypedData } = await import("@/utils/marketplace-utils");

            const fulfillmentParams = {
                order_hash: fulfillment.order_hash,
                fulfiller: account.address,
                nonce: currentNonce.toString(),
            };

            const chainId = chain.id as any as constants.StarknetChainId;
            const typedData = stringifyBigInts(getOrderFulfillmentTypedData(fulfillmentParams, chainId));

            console.log("Signing fulfillment typed data:", typedData);
            const signature = await account.signMessage(typedData);

            const signatureArray = Array.isArray(signature)
                ? signature
                : [signature.r.toString(), signature.s.toString()];

            console.log("Fulfillment signature generated:", signatureArray);

            // 4. Construct payload for fulfill_order
            const fulfillPayload = {
                fulfillment: fulfillmentParams,
                signature: signatureArray,
            };

            console.log("Fulfilling order with payload:", fulfillPayload);

            const fulfillCall = medialaneContract.populate("fulfill_order", [fulfillPayload]);

            // 5. Construct Appprove call for the ERC20
            const { cairo } = await import("starknet");
            const amountUint256 = cairo.uint256(priceWei);

            const approveCall = {
                contractAddress: currencyAddress,
                entrypoint: "approve",
                calldata: [medialaneContract.address, amountUint256.low.toString(), amountUint256.high.toString()],
            };

            // 6. Execute atomic MultiCall!
            const tx = await account.execute([approveCall, fulfillCall]);
            console.log("Purchase MultiCall sent:", tx.transaction_hash);

            console.log("Waiting for transaction confirmation:", tx.transaction_hash);
            await provider.waitForTransaction(tx.transaction_hash);

            setTxHash(tx.transaction_hash);
            toast({
                title: "Purchase Successful",
                description: "The item has been successfully purchased and transferred to your wallet.",
            });

            return tx.transaction_hash;
        } catch (err: any) {
            console.error("Error in buyItem:", err);
            const msg = err.message || "Failed to complete purchase";
            setError(msg);
            toast({ title: "Error", description: msg, variant: "destructive" });
            return undefined;
        } finally {
            setIsProcessing(false);
        }
    }, [account, medialaneContract, chain, toast, provider]);

    const checkoutCart = useCallback(async (items: any[]) => {
        if (!account || !medialaneContract || !chain || items.length === 0) {
            const msg = "Account, contract, network not available, or cart empty";
            setError(msg);
            toast({ title: "Error", description: msg, variant: "destructive" });
            return undefined;
        }

        setIsProcessing(true);
        setError(null);

        try {
            // 1. Group Required Approvals by Currency
            const tokenTotals = new Map<string, bigint>();
            items.forEach((item) => {
                const token = item.considerationToken;
                const amount = BigInt(item.considerationAmount);
                tokenTotals.set(token, (tokenTotals.get(token) || 0n) + amount);
            });

            const { cairo } = await import("starknet");
            const approveCalls = Array.from(tokenTotals.entries()).map(([token, totalWei]) => {
                const amountUint256 = cairo.uint256(totalWei.toString());
                return {
                    contractAddress: token,
                    entrypoint: "approve",
                    calldata: [medialaneContract.address, amountUint256.low.toString(), amountUint256.high.toString()],
                };
            });

            // 2. Fetch Base Nonce
            const currentNonce = await medialaneContract.nonces(account.address);
            const baseNonce = BigInt(currentNonce);

            // 3. Generate Signatures & Fulfillment Calls Sequentially
            const { getOrderFulfillmentTypedData } = await import("@/utils/marketplace-utils");
            const chainId = chain.id as any as constants.StarknetChainId;
            const fulfillCalls = [];

            // We must prompt signatures one by one due to SNIP-12 specifications,
            // but the transaction execution will be entirely atomic.
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const executionNonce = baseNonce + BigInt(i);

                const fulfillmentParams = {
                    order_hash: item.orderHash,
                    fulfiller: account.address,
                    nonce: executionNonce.toString(),
                };

                const typedData = stringifyBigInts(getOrderFulfillmentTypedData(fulfillmentParams, chainId));

                toast({
                    title: `Signature Required (${i + 1}/${items.length})`,
                    description: `Please clear the signature request for ${item.offerIdentifier}`,
                });

                const signature = await account.signMessage(typedData);
                const signatureArray = Array.isArray(signature)
                    ? signature
                    : [signature.r.toString(), signature.s.toString()];

                const fulfillPayload = {
                    fulfillment: fulfillmentParams,
                    signature: signatureArray,
                };

                fulfillCalls.push(medialaneContract.populate("fulfill_order", [fulfillPayload]));
            }

            // 4. Execute atomic MultiCall
            toast({
                title: "Executing Purchase",
                description: "Approve the final transaction to sweep the cart.",
            });

            const tx = await account.execute([...approveCalls, ...fulfillCalls]);
            console.log("Cart Checkout MultiCall sent:", tx.transaction_hash);

            console.log("Waiting for transaction confirmation:", tx.transaction_hash);
            await provider.waitForTransaction(tx.transaction_hash);

            setTxHash(tx.transaction_hash);
            toast({
                title: "Purchase Successful",
                description: `Successfully procured ${items.length} items.`,
            });

            return tx.transaction_hash;
        } catch (err: any) {
            console.error("Error in checkoutCart:", err);
            const msg = err.message || "Failed to complete checkout";
            setError(msg);
            toast({ title: "Error", description: msg, variant: "destructive" });
            return undefined;
        } finally {
            setIsProcessing(false);
        }
    }, [account, medialaneContract, chain, toast, provider]);

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
        makeOffer,
        buyItem,
        checkoutCart,
        cancelOrder,
        cancelListing: cancelOrder,
        isProcessing,
        isLoading: isProcessing,
        txHash,
        error,
        resetState
    };
}
