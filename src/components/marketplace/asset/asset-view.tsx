"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldCheck, ArrowLeft } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

// Hooks & Types
import { useAsset } from "@/hooks/use-asset"
import { Asset as LegacyAsset, IPType } from "@/types/asset"

// Components
import { AssetViewer } from "@/components/assets/AssetViewer"
import { AssetOverview } from "@/components/assets/AssetOverview"
import { AssetActionPanel } from "@/components/marketplace/asset/asset-action-panel"
import { AssetTransactionHistory } from "@/components/assets/AssetTransactionHistory"
import { AssetAttributes } from "@/components/marketplace/asset/asset-attributes"

export function AssetView({ slug }: { slug: string }) {
    // Parse slug
    const parts = slug.split('-')
    const tokenIdStr = parts.pop() || '0'
    const collectionAddress = parts.join('-') as `0x${string}`
    const tokenId = parseInt(tokenIdStr)

    const { displayAsset, loading, error, notFound, reload } = useAsset(collectionAddress, tokenId)

    if (loading) {
        return <AssetSkeleton />
    }

    if (error || notFound || !displayAsset) {
        return (
            <div className="min-h-screen pt-24 pb-12 container mx-auto px-4 flex flex-col items-center justify-center text-center">
                <ShieldCheck className="h-16 w-16 text-muted-foreground mb-4 opacity-20" />
                <h1 className="text-2xl font-bold mb-2">
                    {notFound ? "Asset Not Found" : "Error Loading Asset"}
                </h1>
                <p className="text-muted-foreground mb-6 max-w-md">
                    {error || "We couldn't locate this asset on the network."}
                </p>
                <div className="flex gap-4">
                    <Link href="/marketplace">
                        <Button variant="outline">Back to Marketplace</Button>
                    </Link>
                    <Button onClick={() => reload()}>Try Again</Button>
                </div>
            </div>
        )
    }

    // Map DisplayAsset to LegacyAsset for compatibility with old components
    const legacyAsset: LegacyAsset = {
        id: displayAsset.id,
        name: displayAsset.name,
        creator: displayAsset.creator.name, // Legacy expects string
        owner: displayAsset.owner.address,
        verified: displayAsset.creator.verified,
        image: displayAsset.image,
        collection: displayAsset.collection,
        licenseType: (displayAsset.licenseType as any) || "all-rights-reserved",
        description: displayAsset.description,
        registrationDate: displayAsset.createdAt,
        type: (displayAsset.type as IPType) || "Art",
        // Map other fields as best effort
        metadata: {},
        value: "0.45", // Mock value if not present
        attributes: displayAsset.attributes // This might need transformation if types don't match exactly
    } as any; // Cast as any to bypass strict legacy type checks for now

    return (
        <div className="min-h-screen bg-background pt-20 pb-20">
            <main className="container mx-auto px-4 py-8 max-w-7xl space-y-8">

                {/* Back Navigation */}
                <div className="flex items-center gap-2">
                    <Link href="/marketplace">
                        <Button variant="ghost" size="sm" className="pl-0 hover:pl-2 transition-all">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Marketplace
                        </Button>
                    </Link>
                </div>

                {/* Main Grid: Viewer + Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* Left Column: Asset Media (7 cols) */}
                    <div className="lg:col-span-12 xl:col-span-7 space-y-8">
                        {/* Immersive Viewer */}
                        <div className="rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-background/50 backdrop-blur-sm">
                            <AssetViewer asset={legacyAsset} />
                        </div>

                        {/* Overview Stats & Attributes */}
                        <div className="hidden xl:block">
                            <AssetOverview asset={legacyAsset} />
                        </div>
                    </div>

                    {/* Right Column: Details & Actions (5 cols) */}
                    <div className="lg:col-span-12 xl:col-span-5 space-y-6">

                        {/* Asset Header Info */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Link href="#" className="hover:text-primary transition-colors">{displayAsset.collection}</Link>
                                <span>•</span>
                                <span>{displayAsset.type}</span>
                            </div>

                            <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                {displayAsset.name}
                            </h1>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500" />
                                    <div className="flex flex-col text-xs">
                                        <span className="text-muted-foreground">Creator</span>
                                        <span className="font-medium">{displayAsset.creator.name}</span>
                                    </div>
                                </div>
                                <div className="w-px h-8 bg-white/10" />
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500" />
                                    <div className="flex flex-col text-xs">
                                        <span className="text-muted-foreground">Owner</span>
                                        <span className="font-medium truncate max-w-[100px]">{displayAsset.owner.name}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* NEW: Seaport Action Panel */}
                        <AssetActionPanel assetId={displayAsset.id} />

                        {/* Mobile Overview (visible only on small screens) */}
                        <div className="xl:hidden">
                            <AssetOverview asset={legacyAsset} />
                        </div>

                        {/* Additional Attributes Grid */}
                        {displayAsset.attributes && displayAsset.attributes.length > 0 && (
                            <div className="pt-4">
                                <h3 className="text-lg font-semibold mb-4">Traits</h3>
                                <AssetAttributes attributes={displayAsset.attributes.map(a => ({ trait: a.trait_type, value: a.value }))} />
                            </div>
                        )}

                        {/* Description */}
                        <div className="prose prose-invert prose-sm max-w-none bg-white/5 p-6 rounded-xl border border-white/10">
                            <h3 className="text-lg font-semibold mb-2 mt-0">Description</h3>
                            <p>{displayAsset.description || "No description provided."}</p>
                        </div>

                    </div>
                </div>

                {/* Bottom Section: Transaction History & Related */}
                <div className="space-y-8 pt-12 border-t border-white/10">
                    <h2 className="text-2xl font-bold">Activity</h2>
                    <div className="bg-background/40 rounded-xl border border-white/10 p-6">
                        <AssetTransactionHistory assetId={displayAsset.id} />
                    </div>
                </div>

            </main>
        </div>
    )
}

function AssetSkeleton() {
    return (
        <div className="min-h-screen pt-24 pb-12 container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-7">
                    <Skeleton className="aspect-square w-full rounded-2xl bg-white/5" />
                </div>
                <div className="lg:col-span-5 space-y-6">
                    <Skeleton className="h-12 w-3/4 bg-white/5" />
                    <Skeleton className="h-24 w-full bg-white/5 rounded-xl" />
                    <Skeleton className="h-64 w-full bg-white/5 rounded-xl" />
                </div>
            </div>
        </div>
    )
}
