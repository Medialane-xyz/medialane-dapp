"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { RpcProvider, shortString, hash } from "starknet";
import { processIPFSHashToUrl } from "@/utils/ipfs";
import { isAssetReported } from "@/lib/reported-content";
import { normalizeStarknetAddress } from "@/lib/utils";
import {
    REGISTRY_START_BLOCK,
    MARKETPLACE_START_BLOCK,
    MEDIALANE_CONTRACT_ADDRESS,
} from "@/lib/constants";
import { formatPrice, lookupToken } from "@/lib/activity-ui";

const COLLECTION_ADDRESS = process.env.NEXT_PUBLIC_COLLECTION_CONTRACT_ADDRESS;

// Registry event selectors (hardcoded — stable hashes from existing code)
const TOKEN_MINTED_SELECTOR = "0x3e517dedbc7bae62d4ace7e3dfd33255c4a7fe7c1c6f53c725d52b45f9c5a00";
const COLLECTION_CREATED_SELECTOR = "0xfca650bfd622aeae91aa1471499a054e4c7d3f0d75fbcb98bdb3bbb0358b0c";
const TOKEN_TRANSFERRED_SELECTOR = "0x3ddaa3f2d17cc7984d82075aa171282e6fff4db61944bf218f60678f95e2567";
const TRANSFER_SELECTOR = "0x99cd8bde557814842a3121e8ddfd433a539b8c9f14bf31ebf108d12e6196e9";

// Marketplace event selectors computed at runtime
const ORDER_CREATED_SELECTOR = hash.getSelectorFromName("OrderCreated");
const ORDER_FULFILLED_SELECTOR = hash.getSelectorFromName("OrderFulfilled");
const ORDER_CANCELLED_SELECTOR = hash.getSelectorFromName("OrderCancelled");

const BLOCK_WINDOW_SIZE = 50000;

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

// Helper to parse Cairo ByteArray from event data iterator
function parseByteArray(dataIter: IterableIterator<string>): string {
    const lenResult = dataIter.next();
    if (lenResult.done) return "";
    const dataLen = parseInt(lenResult.value, 16);

    let result = "";
    for (let i = 0; i < dataLen; i++) {
        const chunk = dataIter.next().value;
        if (chunk) {
            try {
                result += shortString.decodeShortString(chunk);
            } catch {
                // skip invalid chunks
            }
        }
    }

    const pendingWord = dataIter.next().value;
    dataIter.next(); // pendingLen

    if (pendingWord && pendingWord !== "0x0" && pendingWord !== "0x00") {
        try {
            result += shortString.decodeShortString(pendingWord);
        } catch {
            // skip
        }
    }

    return result;
}

interface ParsedEvent {
    id: string;
    type: "mint" | "transfer" | "collection" | "listing" | "offer" | "sale" | "cancel";
    source: "registry" | "marketplace";
    collectionId: string;
    collectionAddress?: string;
    tokenId?: string;
    owner: string;
    recipient?: string;
    metadataUri?: string;
    descriptor?: string;
    baseUri?: string;
    txHash: string;
    blockNumber: number;
    rawTimestamp?: number;
    // Marketplace-specific
    orderHash?: string;
    offerer?: string;
    fulfiller?: string;
}

interface ResolvedOrder {
    orderType: "listing" | "offer";
    collectionAddress: string;
    tokenId: string;
    price: string;
    currency: string;
    priceDisplay: string;
}

async function resolveOrderDetails(
    provider: RpcProvider,
    orderHash: string
): Promise<ResolvedOrder | null> {
    try {
        const result = await provider.callContract({
            contractAddress: MEDIALANE_CONTRACT_ADDRESS,
            entrypoint: "get_order_details",
            calldata: [orderHash],
        });

        // result is a flat felt array
        // [0] offerer
        // [1] offer.item_type (shortString: "ERC721" or "ERC20")
        // [2] offer.token
        // [3] offer.identifier_or_criteria
        // [4] offer.start_amount
        // [5] offer.end_amount
        // [6] consideration.item_type
        // [7] consideration.token
        // [8] consideration.identifier_or_criteria
        // [9] consideration.start_amount
        // [10] consideration.end_amount
        // [11] consideration.recipient
        // [12] start_time
        // [13] end_time
        // [14] order_status
        // [15] fulfiller Option variant
        // [16] fulfiller address (if [15] == "0x1")

        if (!result || result.length < 12) return null;

        let offerItemType: string;
        try {
            offerItemType = shortString.decodeShortString(result[1]);
        } catch {
            offerItemType = "";
        }

        if (offerItemType === "ERC721") {
            // Listing: seller offers NFT, consideration is ERC20 (price)
            const collectionAddress = result[2];
            const tokenId = BigInt(result[3]).toString();
            const priceRaw = result[9]; // consideration.start_amount
            const currencyAddress = result[7]; // consideration.token
            const token = lookupToken(currencyAddress);
            const currency = token?.symbol ?? "ETH";
            const decimals = token?.decimals ?? 18;
            const price = formatPrice(priceRaw, decimals);
            return {
                orderType: "listing",
                collectionAddress,
                tokenId,
                price,
                currency,
                priceDisplay: `${price} ${currency}`,
            };
        } else if (offerItemType === "ERC20") {
            // Buy offer: buyer offers ERC20, consideration is NFT
            const collectionAddress = result[7]; // consideration.token
            const tokenId = BigInt(result[8]).toString(); // consideration.identifier
            const priceRaw = result[4]; // offer.start_amount
            const currencyAddress = result[2]; // offer.token
            const token = lookupToken(currencyAddress);
            const currency = token?.symbol ?? "ETH";
            const decimals = token?.decimals ?? 18;
            const price = formatPrice(priceRaw, decimals);
            return {
                orderType: "offer",
                collectionAddress,
                tokenId,
                price,
                currency,
                priceDisplay: `${price} ${currency}`,
            };
        }

        return null;
    } catch {
        return null;
    }
}

// Fetch registry events for a block range
async function fetchRegistryEventsInRange(
    provider: RpcProvider,
    fromBlock: number,
    toBlock: number,
    walletAddress: string | null
): Promise<ParsedEvent[]> {
    if (!COLLECTION_ADDRESS) return [];

    const rangeEvents: ParsedEvent[] = [];
    let continuationToken: string | undefined = undefined;
    let pageCount = 0;
    const maxPagesPerWindow = 50;

    try {
        do {
            const response = await provider.getEvents({
                address: COLLECTION_ADDRESS,
                keys: [[
                    TOKEN_MINTED_SELECTOR,
                    COLLECTION_CREATED_SELECTOR,
                    TOKEN_TRANSFERRED_SELECTOR,
                    TRANSFER_SELECTOR,
                ]],
                from_block: { block_number: fromBlock },
                to_block: { block_number: toBlock },
                chunk_size: 100,
                continuation_token: continuationToken,
            });

            for (const event of response.events) {
                try {
                    const eventKey = event.keys[0];
                    const data = event.data;
                    const dataIter = data[Symbol.iterator]();

                    if (eventKey === TOKEN_MINTED_SELECTOR) {
                        const cIdLow = dataIter.next().value;
                        const cIdHigh = dataIter.next().value;
                        if (!cIdLow || !cIdHigh) continue;
                        const collectionId = (BigInt(cIdLow) + (BigInt(cIdHigh) << 128n)).toString();
                        const collectionAddress = "0x" + (BigInt(cIdLow) + (BigInt(cIdHigh) << 128n)).toString(16);

                        const tIdLow = dataIter.next().value;
                        const tIdHigh = dataIter.next().value;
                        if (!tIdLow || !tIdHigh) continue;
                        const tokenId = (BigInt(tIdLow) + (BigInt(tIdHigh) << 128n)).toString();

                        const assetId = `${collectionAddress}-${tokenId}`;
                        if (isAssetReported(assetId)) continue;

                        const owner = dataIter.next().value;
                        if (!owner) continue;

                        if (walletAddress) {
                            const normalizedOwner = normalizeStarknetAddress(owner.toLowerCase());
                            if (normalizedOwner !== walletAddress) continue;
                        }

                        const metadataUri = parseByteArray(dataIter);

                        rangeEvents.push({
                            id: `${event.transaction_hash}-${tokenId}`,
                            type: "mint",
                            source: "registry",
                            collectionId,
                            collectionAddress,
                            tokenId,
                            owner,
                            metadataUri,
                            txHash: event.transaction_hash || "",
                            blockNumber: event.block_number || 0,
                        });

                    } else if (eventKey === COLLECTION_CREATED_SELECTOR) {
                        const cIdLow = dataIter.next().value;
                        const cIdHigh = dataIter.next().value;
                        if (!cIdLow || !cIdHigh) continue;
                        const collectionId = (BigInt(cIdLow) + (BigInt(cIdHigh) << 128n)).toString();

                        const owner = dataIter.next().value;
                        const collectionName = parseByteArray(dataIter);
                        parseByteArray(dataIter); // symbol
                        const baseUri = parseByteArray(dataIter);

                        if (!owner) continue;

                        if (walletAddress) {
                            const normalizedOwner = normalizeStarknetAddress(owner.toLowerCase());
                            if (normalizedOwner !== walletAddress) continue;
                        }

                        rangeEvents.push({
                            id: `${event.transaction_hash}-${collectionId}`,
                            type: "collection",
                            source: "registry",
                            collectionId,
                            owner,
                            descriptor: collectionName,
                            baseUri,
                            txHash: event.transaction_hash || "",
                            blockNumber: event.block_number || 0,
                        });

                    } else if (eventKey === TOKEN_TRANSFERRED_SELECTOR) {
                        const cIdLow = dataIter.next().value;
                        const cIdHigh = dataIter.next().value;
                        if (!cIdLow || !cIdHigh) continue;
                        const collectionId = (BigInt(cIdLow) + (BigInt(cIdHigh) << 128n)).toString();
                        const collectionAddress = "0x" + (BigInt(cIdLow) + (BigInt(cIdHigh) << 128n)).toString(16);

                        const tIdLow = dataIter.next().value;
                        const tIdHigh = dataIter.next().value;
                        if (!tIdLow || !tIdHigh) continue;
                        const tokenId = (BigInt(tIdLow) + (BigInt(tIdHigh) << 128n)).toString();

                        const operator = dataIter.next().value;
                        const tsHex = dataIter.next().value;
                        if (!operator || !tsHex) continue;

                        if (walletAddress) {
                            const normalizedOperator = normalizeStarknetAddress(operator.toLowerCase());
                            if (normalizedOperator !== walletAddress) continue;
                        }

                        const timestamp = parseInt(tsHex, 16);

                        rangeEvents.push({
                            id: `${event.transaction_hash}-${tokenId}-tr`,
                            type: "transfer",
                            source: "registry",
                            collectionId,
                            collectionAddress,
                            tokenId,
                            owner: operator,
                            txHash: event.transaction_hash || "",
                            blockNumber: event.block_number || 0,
                            rawTimestamp: timestamp,
                        });

                    } else if (eventKey === TRANSFER_SELECTOR) {
                        const fromAddress = event.keys[1] as string;
                        const toAddress = event.keys[2] as string;

                        const tIdLow = dataIter.next().value;
                        const tIdHigh = dataIter.next().value;

                        if (fromAddress && toAddress && tIdLow && tIdHigh) {
                            const tokenId = (BigInt(tIdLow) + (BigInt(tIdHigh) << 128n)).toString();
                            if (BigInt(fromAddress) === 0n) continue; // ignore mints

                            if (walletAddress) {
                                const normalizedFrom = normalizeStarknetAddress(fromAddress.toLowerCase());
                                const normalizedTo = normalizeStarknetAddress(toAddress.toLowerCase());
                                if (normalizedFrom !== walletAddress && normalizedTo !== walletAddress) continue;
                            }

                            rangeEvents.push({
                                id: `${event.transaction_hash}-${tokenId}-transfer`,
                                type: "transfer",
                                source: "registry",
                                collectionId: "0",
                                collectionAddress: COLLECTION_ADDRESS || "",
                                tokenId,
                                owner: fromAddress,
                                recipient: toAddress,
                                txHash: event.transaction_hash || "",
                                blockNumber: event.block_number || 0,
                            });
                        }
                    }
                } catch {
                    // skip malformed event
                }
            }

            continuationToken = response.continuation_token;
            pageCount++;
        } while (continuationToken && pageCount < maxPagesPerWindow);
    } catch (err) {
        console.error(`Registry events fetch error ${fromBlock}-${toBlock}:`, err);
    }

    return rangeEvents;
}

// Fetch marketplace events for a block range
async function fetchMarketplaceEventsInRange(
    provider: RpcProvider,
    fromBlock: number,
    toBlock: number,
    walletAddress: string | null
): Promise<ParsedEvent[]> {
    if (!MEDIALANE_CONTRACT_ADDRESS) return [];

    const rangeEvents: ParsedEvent[] = [];
    let continuationToken: string | undefined = undefined;
    let pageCount = 0;
    const maxPagesPerWindow = 50;

    try {
        do {
            const response = await provider.getEvents({
                address: MEDIALANE_CONTRACT_ADDRESS,
                keys: [[
                    ORDER_CREATED_SELECTOR,
                    ORDER_FULFILLED_SELECTOR,
                    ORDER_CANCELLED_SELECTOR,
                ]],
                from_block: { block_number: fromBlock },
                to_block: { block_number: toBlock },
                chunk_size: 100,
                continuation_token: continuationToken,
            });

            for (const event of response.events) {
                try {
                    const eventKey = event.keys[0];
                    // All fields are keys: [selector, order_hash, offerer, (fulfiller for Fulfilled)]
                    const orderHash = event.keys[1] as string;
                    const offerer = event.keys[2] as string;
                    const fulfiller = event.keys[3] as string | undefined;

                    if (!orderHash || !offerer) continue;

                    if (walletAddress) {
                        const normalizedOfferer = normalizeStarknetAddress(offerer.toLowerCase());
                        const normalizedFulfiller = fulfiller
                            ? normalizeStarknetAddress(fulfiller.toLowerCase())
                            : null;

                        if (eventKey === ORDER_CREATED_SELECTOR || eventKey === ORDER_CANCELLED_SELECTOR) {
                            if (normalizedOfferer !== walletAddress) continue;
                        } else if (eventKey === ORDER_FULFILLED_SELECTOR) {
                            if (normalizedOfferer !== walletAddress && normalizedFulfiller !== walletAddress) continue;
                        }
                    }

                    let type: ParsedEvent["type"];
                    if (eventKey === ORDER_CREATED_SELECTOR) {
                        type = "listing"; // provisional — resolved to listing or offer in processMetadata
                    } else if (eventKey === ORDER_FULFILLED_SELECTOR) {
                        type = "sale";
                    } else {
                        type = "cancel";
                    }

                    rangeEvents.push({
                        id: `${event.transaction_hash}-${orderHash}`,
                        type,
                        source: "marketplace",
                        collectionId: "",
                        owner: offerer,
                        txHash: event.transaction_hash || "",
                        blockNumber: event.block_number || 0,
                        orderHash,
                        offerer,
                        fulfiller,
                    });
                } catch {
                    // skip malformed event
                }
            }

            continuationToken = response.continuation_token;
            pageCount++;
        } while (continuationToken && pageCount < maxPagesPerWindow);
    } catch (err) {
        console.error(`Marketplace events fetch error ${fromBlock}-${toBlock}:`, err);
    }

    return rangeEvents;
}

export function useActivities(walletAddress?: string, pageSize: number = 20): UseActivitiesReturn {
    const [allParsedEvents, setAllParsedEvents] = useState<ParsedEvent[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [displayCount, setDisplayCount] = useState(pageSize);
    const [blockTimestamps, setBlockTimestamps] = useState<Record<number, string>>({});
    const [lastScannedBlock, setLastScannedBlock] = useState<number | null>(null);
    const [hasMoreBlocks, setHasMoreBlocks] = useState(true);

    // Ref-based scanning flag prevents race conditions and is stable across renders
    const isScanningRef = useRef(false);
    // Ref to latest activities avoids stale closure in processMetadata effect
    const activitiesRef = useRef<Activity[]>([]);
    activitiesRef.current = activities;
    // Cache resolved marketplace orders to avoid re-fetching on every processMetadata run
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
        if (allParsedEvents.length === 0) setLoading(true);

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

            const newEvents: ParsedEvent[] = [];
            let attempts = 0;
            const maxAttempts = 10;

            while (
                newEvents.length < targetCount &&
                attempts < maxAttempts &&
                currentToBlock > effectiveStartBlock
            ) {
                const currentFromBlock = Math.max(effectiveStartBlock, currentToBlock - BLOCK_WINDOW_SIZE);

                const [registryEvents, marketplaceEvents] = await Promise.all([
                    fetchRegistryEventsInRange(provider, currentFromBlock, currentToBlock, normalizedWallet),
                    fetchMarketplaceEventsInRange(provider, currentFromBlock, currentToBlock, normalizedWallet),
                ]);

                const windowEvents = [...registryEvents, ...marketplaceEvents];
                newEvents.push(...windowEvents);

                currentToBlock = currentFromBlock - 1;
                attempts++;

                if (currentToBlock < effectiveStartBlock) {
                    setHasMoreBlocks(false);
                    break;
                }
            }

            setLastScannedBlock(currentToBlock);

            if (newEvents.length > 0) {
                setAllParsedEvents(prev => {
                    const combined = [...prev, ...newEvents];
                    const uniqueMap = new Map<string, ParsedEvent>();
                    for (const e of combined) {
                        if (!uniqueMap.has(e.id)) uniqueMap.set(e.id, e);
                    }
                    return Array.from(uniqueMap.values()).sort((a, b) => b.blockNumber - a.blockNumber);
                });
            } else if (currentToBlock <= effectiveStartBlock) {
                setHasMoreBlocks(false);
            }
        } catch (err: unknown) {
            console.error("Error fetching activities:", err);
            setError(err instanceof Error ? err.message : "Failed to load activities");
        } finally {
            setLoading(false);
            isScanningRef.current = false;
        }
    }, [hasMoreBlocks, lastScannedBlock, normalizedWallet, allParsedEvents.length, pageSize, effectiveStartBlock, walletAddress]);

    useEffect(() => {
        if (lastScannedBlock === null && !loadingMore) {
            // For wallet mode, only start if we have a wallet
            if (walletAddress !== undefined && !normalizedWallet) return;
            fetchMoreActivityEvents(pageSize);
        }
    }, [lastScannedBlock, fetchMoreActivityEvents, pageSize, loadingMore, normalizedWallet, walletAddress]);

    const hasMore = hasMoreBlocks || allParsedEvents.length > displayCount;

    useEffect(() => {
        let cancelled = false;

        const processMetadata = async () => {
            if (walletAddress !== undefined && !normalizedWallet) {
                setActivities([]);
                return;
            }

            const eventsToProcess = allParsedEvents.slice(0, displayCount);

            // Fetch missing block timestamps
            const uniqueBlocks = [...new Set(eventsToProcess.map(e => e.blockNumber))];
            const missingBlocks = uniqueBlocks.filter(bn => !blockTimestamps[bn]);
            const newTimestamps: Record<number, string> = {};

            if (missingBlocks.length > 0) {
                try {
                    const provider = providerRef.current!;
                    const batchSize = 5;
                    for (let i = 0; i < missingBlocks.length; i += batchSize) {
                        const batch = missingBlocks.slice(i, i + batchSize);
                        await Promise.all(batch.map(async (bn) => {
                            try {
                                const block = await provider.getBlock(bn);
                                newTimestamps[bn] = new Date(block.timestamp * 1000).toISOString();
                            } catch {
                                newTimestamps[bn] = new Date().toISOString();
                            }
                        }));
                    }
                    if (cancelled) return;
                    setBlockTimestamps(prev => ({ ...prev, ...newTimestamps }));
                } catch {
                    // ignore timestamp errors
                }
            }

            const currentTimestamps = { ...blockTimestamps, ...newTimestamps };

            const processedActivities: (Activity | undefined)[] = new Array(eventsToProcess.length);
            const existingMap = new Map(activitiesRef.current.map(a => [a.id, a]));
            const itemsToFetch: { event: ParsedEvent; index: number }[] = [];

            for (let i = 0; i < eventsToProcess.length; i++) {
                const evt = eventsToProcess[i];
                const existing = existingMap.get(evt.id);
                if (existing) {
                    const ts = evt.rawTimestamp
                        ? new Date(evt.rawTimestamp * 1000).toISOString()
                        : currentTimestamps[evt.blockNumber];
                    if (ts && existing.timestamp !== ts) {
                        itemsToFetch.push({ event: evt, index: i });
                    } else {
                        processedActivities[i] = existing;
                    }
                } else {
                    itemsToFetch.push({ event: evt, index: i });
                }
            }

            if (itemsToFetch.length === 0 && processedActivities.filter(Boolean).length === eventsToProcess.length) {
                const filtered = processedActivities.filter(Boolean) as Activity[];
                if (cancelled) return;
                if (filtered.length !== activitiesRef.current.length) setActivities(filtered);
                return;
            }

            // Resolve marketplace order details in batches of 10
            const marketplaceItems = itemsToFetch.filter(item => item.event.source === "marketplace");
            const resolvedOrders = new Map<string, ResolvedOrder | null>();

            if (marketplaceItems.length > 0) {
                const provider = providerRef.current!;
                const batchSize = 10;

                for (let i = 0; i < marketplaceItems.length; i += batchSize) {
                    const batch = marketplaceItems.slice(i, i + batchSize);
                    await Promise.all(batch.map(async ({ event }) => {
                        if (event.orderHash) {
                            if (resolvedOrdersCacheRef.current.has(event.id)) {
                                resolvedOrders.set(event.id, resolvedOrdersCacheRef.current.get(event.id)!);
                            } else {
                                const resolved = await resolveOrderDetails(provider, event.orderHash);
                                resolvedOrdersCacheRef.current.set(event.id, resolved);
                                resolvedOrders.set(event.id, resolved);
                            }
                        }
                    }));
                }
            }

            // Process all items
            const batchSize = 10;
            for (let i = 0; i < itemsToFetch.length; i += batchSize) {
                const batch = itemsToFetch.slice(i, i + batchSize);

                await Promise.all(batch.map(async ({ event: parsed, index }) => {
                    const timestamp = parsed.rawTimestamp
                        ? new Date(parsed.rawTimestamp * 1000).toISOString()
                        : (currentTimestamps[parsed.blockNumber] || new Date().toISOString());

                    if (parsed.source === "marketplace") {
                        const resolved = resolvedOrders.get(parsed.id) ?? null;

                        // Determine final type
                        let finalType: Activity["type"] = parsed.type as Activity["type"];
                        if (parsed.type === "listing" && resolved?.orderType === "offer") {
                            finalType = "offer";
                        }

                        // Determine details
                        let details = "Marketplace order";
                        if (resolved) {
                            if (finalType === "listing") {
                                details = `Listed for ${resolved.priceDisplay}`;
                            } else if (finalType === "offer") {
                                details = `Offered ${resolved.priceDisplay}`;
                            } else if (finalType === "sale") {
                                if (normalizedWallet && parsed.fulfiller) {
                                    const normalizedFulfiller = normalizeStarknetAddress(parsed.fulfiller.toLowerCase());
                                    if (normalizedFulfiller === normalizedWallet) {
                                        details = `Purchased for ${resolved.priceDisplay}`;
                                    } else {
                                        details = `Sold for ${resolved.priceDisplay}`;
                                    }
                                } else {
                                    details = `Purchased for ${resolved.priceDisplay}`;
                                }
                            } else if (finalType === "cancel") {
                                details = `Cancelled ${resolved.orderType === "listing" ? "listing" : "offer"}`;
                            }
                        }

                        // Try to fetch asset image if we have collection+tokenId
                        const assetName = resolved?.collectionAddress && resolved?.tokenId
                            ? `Asset #${resolved.tokenId}`
                            : "Marketplace order";

                        const assetKey = resolved?.collectionAddress && resolved?.tokenId
                            ? `${resolved.collectionAddress}-${resolved.tokenId}`
                            : parsed.orderHash || parsed.id;

                        processedActivities[index] = {
                            id: parsed.id,
                            type: finalType,
                            assetId: assetKey,
                            assetName,
                            assetImage: "/placeholder.svg",
                            user: parsed.offerer || parsed.owner,
                            counterparty: parsed.fulfiller,
                            timestamp,
                            details,
                            txHash: parsed.txHash,
                            price: resolved?.priceDisplay,
                            currency: resolved?.currency,
                            blockNumber: parsed.blockNumber,
                            tokenId: resolved?.tokenId,
                            collectionAddress: resolved?.collectionAddress,
                        };
                        return;
                    }

                    // Registry events
                    let activityType: Activity["type"] = parsed.type as Activity["type"];
                    let assetName = parsed.descriptor || (parsed.tokenId ? `Asset #${parsed.tokenId}` : "Unknown");
                    let assetImage = "/placeholder.svg";
                    let details = "";

                    if (activityType === "collection") {
                        details = "Created a new collection";
                        assetName = parsed.descriptor || `Collection #${parsed.collectionId}`;

                        if (parsed.baseUri) {
                            try {
                                const ipfsUrl = processIPFSHashToUrl(parsed.baseUri, "/placeholder.svg");
                                if (ipfsUrl !== "/placeholder.svg") {
                                    const res = await fetch(ipfsUrl).catch(() => null);
                                    if (res && res.ok) {
                                        const metadata = await res.json();
                                        const img = metadata.image || metadata.cover_image || metadata.coverImage;
                                        if (img) assetImage = processIPFSHashToUrl(img, "/placeholder.svg");
                                    }
                                }
                            } catch {
                                // ignore
                            }
                        }
                    } else if (activityType === "transfer") {
                        details = parsed.recipient
                            ? `Transferred to ${parsed.recipient.slice(0, 6)}...${parsed.recipient.slice(-4)}`
                            : "Transferred asset";
                    } else {
                        details = "Programmable IP minted";
                    }

                    if (parsed.type === "mint" && parsed.metadataUri) {
                        try {
                            const ipfsUrl = processIPFSHashToUrl(parsed.metadataUri, "/placeholder.svg");
                            if (ipfsUrl !== "/placeholder.svg") {
                                const res = await fetch(ipfsUrl, { signal: AbortSignal.timeout(5000) });
                                if (res.ok) {
                                    const metadata = await res.json();
                                    assetName = metadata.name || assetName;
                                    assetImage = processIPFSHashToUrl(metadata.image || "/placeholder.svg", "/placeholder.svg");

                                    const isRemix =
                                        metadata.templateType === "Remix Art" ||
                                        metadata.template_type === "Remix Art" ||
                                        (metadata.attributes && Array.isArray(metadata.attributes) &&
                                            metadata.attributes.some((attr: { trait_type: string; value: string }) =>
                                                attr.trait_type === "Type" && attr.value === "Remix"
                                            ));

                                    if (isRemix) {
                                        activityType = "remix";
                                        details = "Remixed an asset";
                                    }
                                }
                            }
                        } catch {
                            // ignore
                        }
                    }

                    const assetKey = parsed.type === "collection"
                        ? parsed.collectionId
                        : (parsed.collectionAddress && parsed.tokenId
                            ? `${parsed.collectionAddress}-${parsed.tokenId}`
                            : (parsed.tokenId || parsed.collectionId));

                    processedActivities[index] = {
                        id: parsed.id,
                        type: activityType,
                        assetId: assetKey,
                        assetName,
                        assetImage,
                        user: parsed.owner,
                        recipient: parsed.recipient,
                        timestamp,
                        details,
                        txHash: parsed.txHash,
                        blockNumber: parsed.blockNumber,
                        tokenId: parsed.tokenId,
                        collectionAddress: parsed.collectionAddress,
                    };
                }));
            }

            if (cancelled) return;
            setActivities(processedActivities.filter(Boolean) as Activity[]);
        };

        processMetadata();
        return () => { cancelled = true; };
    }, [allParsedEvents, displayCount, blockTimestamps, normalizedWallet, walletAddress]);

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
        resolvedOrdersCacheRef.current.clear();
        setDisplayCount(pageSize);
        setAllParsedEvents([]);
        setActivities([]);
        setLastScannedBlock(null);
        setHasMoreBlocks(true);
        setError(null);
    };

    return { activities, loading, loadingMore, error, hasMore, loadMore, refresh };
}
