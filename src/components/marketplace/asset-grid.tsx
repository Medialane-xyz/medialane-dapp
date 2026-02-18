"use client"

import { useMarketplaceListings } from "@/hooks/use-marketplace-events"
import { AssetCard } from "./asset-card"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useMemo } from "react"

export interface AssetGridProps {
    sortOrder?: "recent" | "oldest"
}

export function AssetGrid({ sortOrder = "recent" }: AssetGridProps) {
    const { listings, isLoading, error, refetch } = useMarketplaceListings()

    const activeListings = useMemo(() => {
        if (!listings) return [];

        // Filter for active sell listings (NFT in offer)
        return listings.filter(l =>
            l.status === "active" &&
            (l.offerType === "ERC721" || l.offerType === "ERC1155")
        ).sort((a, b) => {
            const timeA = a.startTime || 0
            const timeB = b.startTime || 0
            if (sortOrder === "oldest") {
                return timeA - timeB
            }
            return timeB - timeA
        });
    }, [listings, sortOrder]);

    if (isLoading && activeListings.length === 0) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="space-y-3">
                        <Skeleton className="h-[300px] w-full rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground bg-muted/10 rounded-xl border border-dashed">
                <AlertCircle className="h-10 w-10 mb-4 text-red-500" />
                <p>Failed to load assets from the marketplace.</p>
                <p className="text-sm mt-2">{error}</p>
                <Button variant="outline" onClick={() => refetch()} className="mt-4 border-white/10">
                    <RefreshCw className="mr-2 h-4 w-4" /> Try Again
                </Button>
            </div>
        )
    }

    if (activeListings.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground bg-muted/5 rounded-xl border border-dashed border-white/10 backdrop-blur-sm">
                <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mb-6">
                    <AlertCircle className="h-8 w-8 opacity-50" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Marketplace is Quiet</h3>
                <p className="max-w-xs mx-auto">There are currently no active intellectual property assets listed for trading.</p>
                <Button variant="outline" onClick={() => refetch()} className="mt-6 border-white/10 hover:bg-white/5">
                    <RefreshCw className="mr-2 h-4 w-4" /> Refresh Marketplace
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6 pb-20">
            {/* Grid Header / Active Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-border/10">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-foreground/80 tracking-tight">
                        {activeListings.length} Assets Found
                    </span>
                    <div className="h-1 w-1 rounded-full bg-border/50" />
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest opacity-60">
                        Live Market
                    </span>
                </div>

                {/* Active Filter Pills */}
                <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-muted/10 border-border/30 text-[10px] font-medium py-1 px-3 flex gap-2 items-center hover:bg-muted/20 transition-colors tracking-wide">
                        <span className="w-1.5 h-1.5 rounded-full bg-outrun-cyan" />
                        Sort: {sortOrder === 'recent' ? 'Recent' : 'Oldest'}
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {activeListings.map((listing) => (
                    <AssetCard
                        key={listing.orderHash}
                        listing={listing}
                    />
                ))}
            </div>
        </div>
    )
}
