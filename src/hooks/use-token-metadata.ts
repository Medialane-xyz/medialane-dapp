"use client";

import { useState, useEffect } from "react";
import { useProvider, useContract } from "@starknet-react/core";
import { Abi, shortString } from "starknet";
import { ipCollectionAbi } from "@/abis/ip_collection";
import { COLLECTION_CONTRACT_ADDRESS } from "@/lib/constants";
import { fetchIPFSMetadata, processIPFSHashToUrl } from "@/utils/ipfs";

export interface TokenMetadata {
    name: string;
    image: string;
    description: string;
    loading: boolean;
}

/**
 * Helper to decode Cairo 1 ByteArray from raw felt array
 */
function decodeByteArray(data: string[]): string {
    if (!data || data.length < 1) return "";
    try {
        const numWords = parseInt(data[0]);
        let str = "";
        for (let i = 0; i < numWords; i++) {
            const word = data[i + 1];
            if (word) str += shortString.decodeShortString(word);
        }
        if (data.length >= numWords + 3) {
            const pendingWord = data[numWords + 1];
            const pendingLen = parseInt(data[numWords + 2]);
            if (pendingLen > 0 && pendingWord) {
                const decoded = shortString.decodeShortString(pendingWord);
                str += decoded.substring(0, pendingLen);
            }
        }
        return str.replace(/\0/g, "").trim();
    } catch (e) {
        return "";
    }
}

function extractCid(uri: string): string | null {
    if (!uri) return null;
    const cleanUri = uri.replace(/\0/g, "").trim();
    if (cleanUri.match(/^[a-zA-Z0-9]{46,}$/) || (cleanUri.startsWith('ba') && cleanUri.length >= 50)) return cleanUri;
    if (cleanUri.startsWith('ipfs:')) return cleanUri.replace(/^ipfs:(?:\/\/)?/, "");
    const match = cleanUri.match(/\/ipfs\/([a-zA-Z0-9]+)/);
    if (match) return match[1];
    return null;
}

export function useTokenMetadata(tokenId: string, nftAddress?: string) {
    const [metadata, setMetadata] = useState<TokenMetadata>({
        name: `Asset #${tokenId}`,
        image: "/placeholder.svg",
        description: "",
        loading: true
    });

    const { provider } = useProvider();
    const { contract: managerContract } = useContract({
        abi: ipCollectionAbi as Abi,
        address: COLLECTION_CONTRACT_ADDRESS as `0x${string}`
    });

    useEffect(() => {
        let isMounted = true;
        const loadMetadata = async () => {
            if (!tokenId || !provider) return;

            setMetadata(prev => ({ ...prev, loading: true }));

            try {
                let metadataUri = "";

                // 1. Try Manager
                if (managerContract) {
                    try {
                        const token: any = await managerContract.call("get_token", [tokenId]);
                        if (token?.metadata_uri) metadataUri = token.metadata_uri;
                    } catch (e) { }
                }

                // 2. Try NFT contract uri
                if (!metadataUri && nftAddress) {
                    try {
                        const uriData = await provider.callContract({
                            contractAddress: nftAddress,
                            entrypoint: "token_uri",
                            calldata: [tokenId, "0"]
                        });
                        if (uriData?.length > 0) metadataUri = decodeByteArray(uriData);
                    } catch (e) {
                        try {
                            const uriData = await provider.callContract({
                                contractAddress: nftAddress,
                                entrypoint: "tokenURI",
                                calldata: [tokenId, "0"]
                            });
                            if (uriData?.length > 0) metadataUri = decodeByteArray(uriData);
                        } catch (e2) { }
                    }
                }

                if (!metadataUri) {
                    if (isMounted) setMetadata(prev => ({ ...prev, loading: false }));
                    return;
                }

                const cid = extractCid(metadataUri);
                if (cid) {
                    const data = await fetchIPFSMetadata(cid);
                    if (data && isMounted) {
                        setMetadata({
                            name: data.name || `Asset #${tokenId}`,
                            image: processIPFSHashToUrl(data.image as string, "/placeholder.svg"),
                            description: data.description || "",
                            loading: false
                        });
                    }
                } else if (metadataUri.startsWith('http')) {
                    const res = await fetch(metadataUri);
                    const data = await res.json();
                    if (data && isMounted) {
                        setMetadata({
                            name: data.name || `Asset #${tokenId}`,
                            image: data.image ? (data.image.startsWith('ipfs') ? processIPFSHashToUrl(data.image, "/placeholder.svg") : data.image) : "/placeholder.svg",
                            description: data.description || "",
                            loading: false
                        });
                    }
                }
            } catch (err) {
                console.warn("Failed to load token metadata:", err);
            } finally {
                if (isMounted) setMetadata(prev => ({ ...prev, loading: false }));
            }
        };

        loadMetadata();
        return () => { isMounted = false; };
    }, [tokenId, nftAddress, provider, managerContract]);

    return metadata;
}
