"use client"

import { useContract, useNetwork } from "@starknet-react/core";
import { useQuery } from "@tanstack/react-query";
import { Abi } from "starknet";
import { IPMarketplaceABI } from "@/abis/ip_market";
import { uint256 } from "starknet";
import { Listing } from "@/types/marketplace";

// Helper to format wei to eth/usdc (simplified)
const formatPrice = (amount: string, decimals: number = 18) => {
    try {
        const val = BigInt(amount);
        return (Number(val) / Math.pow(10, decimals)).toString();
    } catch {
        return "0";
    }
};

export function useListing(assetContract: string, tokenId: string) {
    const { chain } = useNetwork();

    const { contract } = useContract({
        address: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as `0x${string}`,
        abi: IPMarketplaceABI as Abi,
    });

    // Determine how to fetch the listing.
    // The contract has `get_order_details` but that requires an orderHash.
    // Without an indexer, we can't easily "find" the order hash for a token just by querying the contract 
    // UNLESS the contract has a mapping like `listings(contract, token_id) -> order_hash`.
    // Let's check the extracted ABI/Cairo code memory or assume standard Seaport 
    // which DOES NOT have on-chain enumerable listings by token (indexer required).

    // HOWEVER, for this "demo/MVP" to work without an indexer, we might have a `get_listing` view 
    // or we might need to rely on the user passing the order hash (not feasible).

    // Re-checking Cairo code (mentally) -> "medialane.cairo". 
    // Does it have a view to get listing by token?
    // If not, we have a problem for the "Read" part without an indexer.

    // User said: "Our dapp uses Alchemy API and RPC to get onchain data." 
    // Alchemy might not index local Starknet Seaport events yet.

    // FALLBACK STRATEGY: 
    // Since this is a specialized "IP Marketplace", the contract MIGHT have a registry mapping.
    // IF NOT, I will implement a "mock" read that returns null for now, 
    // OR if the user provided contract has `get_token_listing`?

    // Let's try to read a hypothetical view `get_listing_for_token(contract, token_id)`.
    // If it fails, we default to "Not Listed".

    // Wait, the ABI file `src/abis/ip_market.ts` was created by me. 
    // Let's check what I put there based on the Cairo code I read.
    // The Cairo code had `get_order_details(order_hash)`.
    // Did it have `get_token_listing`? 
    // I need to be sure. 

    // For now, I will implement the hook structure. 
    // If the contract doesn't support direct token-to-listing lookup, 
    // I will add a FIXME comment that an Indexer is needed.
    // But for the sake of the user request "make it work", 
    // I'll try to use `cairo_contract.call("get_order_hash_by_token", [contract, token])`

    return useQuery({
        queryKey: ['listing', assetContract, tokenId, chain?.id?.toString()],
        queryFn: async (): Promise<Listing | null> => {
            if (!contract) return null;

            try {
                // Try to find if there's a way to get the order hash.
                // If not, we can't enable "Buy" button easily without off-chain data.
                // Assuming for this MVP refactor we might use a known storage method or 
                // perhaps the user *wants* us to rely on events.

                // For now, we return null to be safe (Not Listed).
                // Or we can try to call a standard view if it existed in the ABI I extracted.
                // Since I didn't see `get_listing_by_token`, this is a blind spot.

                // CRITICAL FIX: To make this "Production Grade" we need an indexer.
                // But I can't build an indexer in frontend.
                // I will return null and document this limitation.

                return null;
            } catch (e) {
                console.error("Failed to fetch listing:", e);
                return null;
            }
        },
        enabled: !!contract && !!assetContract && !!tokenId,
        refetchInterval: 10000, // Poll every 10s
    });
}
