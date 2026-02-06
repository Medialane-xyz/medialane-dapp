"use client"

import { useRecentAssets } from "@/hooks/use-recent-assets"
import { AssetCard } from "./asset-card"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface AssetGridProps {
    sortOrder?: "recent" | "oldest"
}

export function AssetGrid({ sortOrder = "recent" }: AssetGridProps) {
    const { assets, loading, error, hasMore, loadMore, loadingMore } = useRecentAssets(50)

    const sortedAssets = [...assets].sort((a, b) => {
        const blockA = a.blockNumber || 0
        const blockB = b.blockNumber || 0
        if (sortOrder === "oldest") {
            return blockA - blockB
        }
        return blockB - blockA
    })

    if (loading && assets.length === 0) {
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
            </div>
        )
    }

    if (assets.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground bg-muted/10 rounded-xl border border-dashed">
                <Loader2 className="h-10 w-10 mb-4 animate-spin text-primary" />
                <p>No assets found on the marketplace yet.</p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {sortedAssets.map((asset) => (
                    <AssetCard
                        key={asset.id}
                        asset={{
                            id: asset.id, // This is collectionAddress-tokenId
                            title: asset.name,
                            creator: asset.owner, // We might want to shorten this
                            image: asset.image,
                            price: "0.45", // Placeholder until listing data is real
                            currency: "ETH",
                            type: asset.ipType || "Asset",
                            verified: true
                        }}
                    />
                ))}
            </div>

            {hasMore && (
                <div className="flex justify-center pt-4">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => loadMore()}
                        disabled={loadingMore}
                        className="min-w-[200px] border-white/10 hover:bg-white/5"
                    >
                        {loadingMore ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            "Load More"
                        )}
                    </Button>
                </div>
            )}
        </div>
    )
}
