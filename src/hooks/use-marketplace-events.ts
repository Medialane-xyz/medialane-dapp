"use client"

import { useState, useEffect, useCallback, useMemo } from "react";
import { RpcProvider, hash, num } from "starknet";
import { MEDIALANE_CONTRACT_ADDRESS, START_BLOCK } from "@/lib/constants";
import { normalizeStarknetAddress } from "@/lib/utils";

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL;

// Compute selectors for marketplace events
const ORDER_REGISTERED_SELECTOR = hash.getSelectorFromName("OrderRegistered");
const ORDER_FULFILLED_SELECTOR = hash.getSelectorFromName("OrderFulfilled");
const ORDER_CANCELLED_SELECTOR = hash.getSelectorFromName("OrderCancelled");

export interface MarketplaceOrder {
    orderHash: string;
    offerer: string;
    offerToken: string;
    offerIdentifier: string;
    considerationToken: string;
    considerationAmount: string;
    startTime: number;
    endTime: number;
    blockNumber?: number;
    transactionHash?: string;
    status: "active" | "fulfilled" | "cancelled";
}

/**
 * Hook to scan marketplace contract events and derive active listings.
 * Fetches OrderRegistered, OrderFulfilled, and OrderCancelled events,
 * then computes the set of currently active orders.
 */
export function useMarketplaceListings() {
    const [listings, setListings] = useState<MarketplaceOrder[]>([]);
    const [allOrders, setAllOrders] = useState<MarketplaceOrder[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchEvents = useCallback(async () => {
        if (!RPC_URL || !MEDIALANE_CONTRACT_ADDRESS) {
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const provider = new RpcProvider({ nodeUrl: RPC_URL });
            const contractAddress = normalizeStarknetAddress(MEDIALANE_CONTRACT_ADDRESS);

            // Fetch all marketplace events in one call (registered + fulfilled + cancelled)
            const allEvents: any[] = [];
            let continuationToken: string | undefined = undefined;
            let page = 0;
            const MAX_PAGES = 50;

            do {
                const response = await provider.getEvents({
                    address: contractAddress,
                    from_block: { block_number: START_BLOCK },
                    to_block: "latest",
                    keys: [[
                        ORDER_REGISTERED_SELECTOR,
                        ORDER_FULFILLED_SELECTOR,
                        ORDER_CANCELLED_SELECTOR,
                    ]],
                    chunk_size: 1000,
                    continuation_token: continuationToken,
                });

                if (response.events) {
                    allEvents.push(...response.events);
                }

                continuationToken = response.continuation_token;
                page++;
            } while (continuationToken && page < MAX_PAGES);

            // Process events: build order map
            const orderMap = new Map<string, MarketplaceOrder>();
            const fulfilledSet = new Set<string>();
            const cancelledSet = new Set<string>();

            for (const event of allEvents) {
                const keys = (event.keys || []).map((k: string) => num.toHex(k));
                const data = (event.data || []).map((d: string) => num.toHex(d));
                const selector = keys[0];

                if (selector === ORDER_REGISTERED_SELECTOR) {
                    // keys: [selector, order_hash, offerer]
                    // data: [offer_token, offer_identifier_low, offer_identifier_high,
                    //        consideration_token, consideration_amount_low, consideration_amount_high,
                    //        start_time, end_time]
                    const orderHash = keys[1];
                    const offerer = keys[2];

                    const offerToken = data[0] || "0x0";
                    const offerIdentifierLow = BigInt(data[1] || "0");
                    const offerIdentifierHigh = BigInt(data[2] || "0");
                    const offerIdentifier = (offerIdentifierLow + (offerIdentifierHigh << 128n)).toString();

                    const considerationToken = data[3] || "0x0";
                    const considerationAmountLow = BigInt(data[4] || "0");
                    const considerationAmountHigh = BigInt(data[5] || "0");
                    const considerationAmount = (considerationAmountLow + (considerationAmountHigh << 128n)).toString();

                    const startTime = Number(BigInt(data[6] || "0"));
                    const endTime = Number(BigInt(data[7] || "0"));

                    orderMap.set(orderHash, {
                        orderHash,
                        offerer,
                        offerToken,
                        offerIdentifier,
                        considerationToken,
                        considerationAmount,
                        startTime,
                        endTime,
                        blockNumber: event.block_number,
                        transactionHash: event.transaction_hash,
                        status: "active",
                    });
                } else if (selector === ORDER_FULFILLED_SELECTOR) {
                    // keys: [selector, order_hash, offerer, fulfiller]
                    const orderHash = keys[1];
                    fulfilledSet.add(orderHash);
                } else if (selector === ORDER_CANCELLED_SELECTOR) {
                    // keys: [selector, order_hash, offerer]
                    const orderHash = keys[1];
                    cancelledSet.add(orderHash);
                }
            }

            // Mark fulfilled and cancelled orders
            for (const hash of fulfilledSet) {
                const order = orderMap.get(hash);
                if (order) order.status = "fulfilled";
            }
            for (const hash of cancelledSet) {
                const order = orderMap.get(hash);
                if (order) order.status = "cancelled";
            }

            const now = Math.floor(Date.now() / 1000);
            const orders = Array.from(orderMap.values());

            // All orders (for stats)
            setAllOrders(orders);

            // Active listings: status === active AND not expired
            const activeListings = orders.filter(
                (o) => o.status === "active" && o.endTime > now
            );

            setListings(activeListings);
        } catch (err: any) {
            console.error("[Marketplace Events] Fetch error:", err);
            setError(err.message || "Failed to fetch marketplace events");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    return {
        listings,
        allOrders,
        isLoading,
        error,
        refetch: fetchEvents,
        activeCount: listings.length,
        totalVolume: allOrders.filter((o) => o.status === "fulfilled").length,
    };
}

/**
 * Find a listing for a specific NFT token.
 * Returns the most recent active listing matching the given contract + tokenId.
 */
export function findListingForToken(
    listings: MarketplaceOrder[],
    nftContract: string,
    tokenId: string
): MarketplaceOrder | null {
    const normalizedContract = normalizeStarknetAddress(nftContract).toLowerCase();
    const targetTokenId = BigInt(tokenId);

    // Find listings where offer is an ERC721 matching our token
    const matching = listings.filter((listing) => {
        try {
            const listingOfferToken = normalizeStarknetAddress(listing.offerToken).toLowerCase();
            const listingIdentifier = BigInt(listing.offerIdentifier);
            return listingOfferToken === normalizedContract && listingIdentifier === targetTokenId;
        } catch {
            return false;
        }
    });

    if (matching.length === 0) return null;

    // Return the most recent one (highest block number)
    return matching.sort((a, b) => (b.blockNumber || 0) - (a.blockNumber || 0))[0];
}
