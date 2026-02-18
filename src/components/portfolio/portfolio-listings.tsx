"use client";

import { useMemo } from "react";
import { useAccount } from "@starknet-react/core";
import { useMarketplaceListings } from "@/hooks/use-marketplace-events";
import { ListingCard } from "./listing-card";
import { useMarketplace } from "@/hooks/use-marketplace";
import { normalizeStarknetAddress } from "@/lib/utils";
import { Tag, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

interface PortfolioListingsProps {
    searchQuery?: string;
    mode?: "listings" | "offers";
}

import { PortfolioListingsTabs } from "./portfolio-listings-tabs";
import { usePortfolio } from "@/hooks/use-portfolio";
import { useState } from "react";

export function PortfolioListings({ searchQuery = "", mode = "listings" }: PortfolioListingsProps) {
    const { address } = useAccount();
    const { listings, isLoading, refetch } = useMarketplaceListings();
    const { cancelOrder } = useMarketplace();
    const { tokens } = usePortfolio();
    const [subTab, setSubTab] = useState<"made" | "received">("made");

    // Flatten user tokens for easy lookup
    const ownedTokenSet = useMemo(() => {
        const set = new Set<string>();
        Object.keys(tokens).forEach(collectionId => {
            tokens[collectionId].forEach(token => {
                const normalizedAddr = normalizeStarknetAddress(collectionId).toLowerCase();
                set.add(`${normalizedAddr}-${token.token_id}`);
            });
        });
        return set;
    }, [tokens]);

    // Filter listings for the connected user based on mode
    const filteredListings = useMemo(() => {
        if (!address || !listings) return [];

        const normalizedUser = normalizeStarknetAddress(address).toLowerCase();

        return listings.filter(listing => {
            const normalizedOfferer = normalizeStarknetAddress(listing.offerer).toLowerCase();
            const isUserOfferer = normalizedOfferer === normalizedUser;

            const isNFTListing = listing.offerType === "ERC721" || listing.offerType === "ERC1155";
            const isCurrencyOffer = listing.offerType === "ERC20" || listing.offerType === "Native";

            const isNFTOfferReceived = (listing.considerationType === "ERC721" || listing.considerationType === "ERC1155") &&
                ownedTokenSet.has(`${normalizeStarknetAddress(listing.considerationToken).toLowerCase()}-${listing.considerationIdentifier}`);

            if (mode === "listings") {
                if (!isUserOfferer || !isNFTListing) return false;
            } else { // mode === "offers"
                if (subTab === "made") {
                    if (!isUserOfferer || !isCurrencyOffer) return false;
                } else { // received
                    if (!isNFTOfferReceived || isUserOfferer) return false;
                }
            }

            if (!searchQuery) return true;

            const query = searchQuery.toLowerCase();
            const matchesSearch =
                listing.offerToken.toLowerCase().includes(query) ||
                listing.offerIdentifier.includes(query) ||
                listing.orderHash.toLowerCase().includes(query);

            return matchesSearch;
        });
    }, [listings, address, searchQuery, mode, subTab, ownedTokenSet]);

    const handleCancel = async (orderHash: string) => {
        try {
            await cancelOrder(orderHash);
            toast.success(`${mode === "listings" ? "Listing" : "Offer"} cancellation initiated`);
            // Refetch events after a short delay to allow chain to update
            setTimeout(() => refetch(), 5000);
        } catch (err) {
            console.error(`Failed to cancel ${mode}:`, err);
            toast.error(`Failed to cancel ${mode}. Please try again.`);
        }
    };

    if (isLoading && filteredListings.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground animate-pulse">
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <p>Loading your {mode}...</p>
            </div>
        );
    }

    if (filteredListings.length === 0) {
        return (
            <div className="space-y-6">
                {mode === "offers" && (
                    <PortfolioListingsTabs activeTab={subTab} onTabChange={setSubTab} />
                )}
                <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border/50 rounded-3xl bg-muted/20">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
                        <Tag className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No {mode} found</h3>
                    <p className="text-muted-foreground max-w-sm mb-8 px-4">
                        {searchQuery
                            ? `No {mode} match your search "${searchQuery}".`
                            : mode === "listings"
                                ? "You don't have any active marketplace listings yet. List an asset to see it here."
                                : subTab === "made"
                                    ? "You haven't made any buy offers yet. Browse the marketplace to make an offer."
                                    : "You haven't received any offers on your assets yet."}
                    </p>
                    {!searchQuery && mode === "listings" && (
                        <Button asChild className="rounded-full px-8 shadow-lg shadow-primary/20">
                            <Link href="/portfolio/assets">
                                Go to My Assets
                            </Link>
                        </Button>
                    )}
                    {!searchQuery && mode === "offers" && subTab === "made" && (
                        <Button asChild className="rounded-full px-8 shadow-lg shadow-primary/20">
                            <Link href="/marketplace">
                                Explore Marketplace
                            </Link>
                        </Button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {mode === "offers" && (
                <PortfolioListingsTabs activeTab={subTab} onTabChange={setSubTab} />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredListings.map((listing) => (
                    <ListingCard
                        key={listing.orderHash}
                        listing={listing}
                        onCancel={handleCancel}
                    />
                ))}
            </div>

            <div className="pt-8 border-t border-border/50 flex justify-between items-center text-xs text-muted-foreground">
                <p>Showing {filteredListings.length} {mode === "offers" ? (subTab === "made" ? "offers made" : "offers received") : "active listings"}</p>
                <button
                    onClick={() => refetch()}
                    className="hover:text-primary transition-colors flex items-center gap-1.5"
                >
                    <Loader2 className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
            </div>
        </div>
    );
}
