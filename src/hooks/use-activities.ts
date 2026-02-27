"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { RpcProvider } from "starknet";
import { normalizeStarknetAddress } from "@/lib/utils";
import { REGISTRY_START_BLOCK, MARKETPLACE_START_BLOCK } from "@/lib/constants";
import { scanBlockRange, ParsedEvent, ResolvedOrder } from "@/lib/activity-events";
import { buildActivities } from "@/lib/activity-metadata";

export interface Activity {
    id: string;
    type: "mint" | "transfer" | "remix" | "collection" | "listing" | "offer" | "sale" | "cancel";
    assetId: string;
    assetName: string;
    assetImage: string;
    user: string;
    recipient?: string;
    counterparty?: string;
    timestamp: string;
    details: string;
    txHash: string;
    price?: string;
    currency?: string;
    blockNumber: number;
    tokenId?: string;
    collectionAddress?: string;
}

export interface UseActivitiesReturn {
    activities: Activity[];
    loading: boolean;
    loadingMore: boolean;
    error: string | null;
    hasMore: boolean;
    loadMore: () => Promise<void>;
    refresh: () => void;
}

export function useActivities(walletAddress?: string, pageSize: number = 20): UseActivitiesReturn {
    const [allParsedEvents, setAllParsedEvents] = useState<ParsedEvent[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [displayCount, setDisplayCount] = useState(pageSize);
    const [timestampVersion, setTimestampVersion] = useState(0);
    const [lastScannedBlock, setLastScannedBlock] = useState<number | null>(null);
    const [hasMoreBlocks, setHasMoreBlocks] = useState(true);

    // Ref-based scanning flag prevents race conditions and is stable across renders
    const isScanningRef = useRef(false);
    // Tracks whether any events have been received — avoids setLoading(true) after first data arrives
    const hasEventsRef = useRef(false);
    // Ref to latest activities avoids stale closure in buildActivities call
    const activitiesRef = useRef<Activity[]>([]);
    activitiesRef.current = activities;
    // Cache resolved marketplace orders across renders; cleared only on refresh
    const resolvedOrdersCacheRef = useRef<Map<string, ResolvedOrder | null>>(new Map());
    // Stable provider instance — avoids re-instantiation on every effect run
    const providerRef = useRef<RpcProvider | null>(null);
    if (!providerRef.current) {
        providerRef.current = new RpcProvider({ nodeUrl: process.env.NEXT_PUBLIC_RPC_URL || "" });
    }

    const normalizedWallet = walletAddress
        ? normalizeStarknetAddress(walletAddress.toLowerCase())
        : null;

    // The start block to use is the min of both contracts
    const effectiveStartBlock = Math.min(REGISTRY_START_BLOCK, MARKETPLACE_START_BLOCK);

    const fetchMoreActivityEvents = useCallback(async (targetCount: number = pageSize) => {
        if (isScanningRef.current || !hasMoreBlocks) return;
        if (walletAddress !== undefined && !normalizedWallet) return;

        isScanningRef.current = true;
        // Only show full-page loading spinner before the first events arrive
        if (!hasEventsRef.current) setLoading(true);

        try {
            const provider = providerRef.current!;

            let currentToBlock = lastScannedBlock;
            if (currentToBlock === null) {
                try {
                    const block = await provider.getBlock("latest");
                    currentToBlock = block.block_number;
                } catch {
                    setHasMoreBlocks(false);
                    return;
                }
            }

            const { events: newEvents, nextToBlock, reachedStart } = await scanBlockRange(
                provider,
                effectiveStartBlock,
                currentToBlock,
                targetCount,
                normalizedWallet,
            );

            setLastScannedBlock(nextToBlock);

            if (newEvents.length > 0) {
                hasEventsRef.current = true;
                setAllParsedEvents(prev => {
                    const combined = [...prev, ...newEvents];
                    const uniqueMap = new Map<string, ParsedEvent>();
                    for (const e of combined) {
                        if (!uniqueMap.has(e.id)) uniqueMap.set(e.id, e);
                    }
                    return Array.from(uniqueMap.values()).sort((a, b) => b.blockNumber - a.blockNumber);
                });
            }

            if (reachedStart) {
                setHasMoreBlocks(false);
            }
        } catch (err: unknown) {
            console.error("Error fetching activities:", err);
            setError(err instanceof Error ? err.message : "Failed to load activities");
        } finally {
            setLoading(false);
            isScanningRef.current = false;
        }
    // allParsedEvents.length intentionally excluded: would re-create callback on every event accumulation
    }, [hasMoreBlocks, lastScannedBlock, normalizedWallet, pageSize, effectiveStartBlock, walletAddress]);

    useEffect(() => {
        if (lastScannedBlock === null && !loadingMore) {
            if (walletAddress !== undefined && !normalizedWallet) return;
            fetchMoreActivityEvents(pageSize);
        }
    }, [lastScannedBlock, fetchMoreActivityEvents, pageSize, loadingMore, normalizedWallet, walletAddress]);

    const hasMore = hasMoreBlocks || allParsedEvents.length > displayCount;

    // Re-runs when new events arrive, display count changes, or timestamps are newly cached
    useEffect(() => {
        const controller = new AbortController();
        if (walletAddress !== undefined && !normalizedWallet) { setActivities([]); return; }

        buildActivities(
            allParsedEvents.slice(0, displayCount),
            activitiesRef.current,
            providerRef.current!,
            resolvedOrdersCacheRef.current,
            normalizedWallet,
            controller.signal,
        ).then(({ activities, timestampsAdded }) => {
            if (controller.signal.aborted) return;
            setActivities(activities);
            // Increment version to trigger a re-run now that timestamps are in cache
            if (timestampsAdded) setTimestampVersion(v => v + 1);
        }).catch(() => {});

        return () => controller.abort();
    // timestampVersion triggers a re-run after new timestamps are written to blockTimestampCache
    }, [allParsedEvents, displayCount, timestampVersion, normalizedWallet, walletAddress]);

    const loadMore = async () => {
        if (loadingMore) return;
        setLoadingMore(true);
        try {
            const newDisplayCount = displayCount + pageSize;
            if (allParsedEvents.length < newDisplayCount && hasMoreBlocks) {
                await fetchMoreActivityEvents(pageSize);
            }
            setDisplayCount(newDisplayCount);
        } finally {
            setLoadingMore(false);
        }
    };

    const refresh = () => {
        isScanningRef.current = false;
        hasEventsRef.current = false;
        resolvedOrdersCacheRef.current.clear();
        // blockTimestampCache is NOT cleared — timestamps are immutable on-chain data
        setDisplayCount(pageSize);
        setAllParsedEvents([]);
        setActivities([]);
        setLastScannedBlock(null);
        setHasMoreBlocks(true);
        setError(null);
    };

    return { activities, loading, loadingMore, error, hasMore, loadMore, refresh };
}
