"use client";

import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePortfolio } from "@/hooks/use-portfolio";
import { useAccount } from "@starknet-react/core";
import { Alert } from "@/components/ui/alert";
import { CollectionValidator } from "@/lib/types";
import { CollectionStats } from "@/components/collections/collections-stats";
import Link from "next/link";
import { ArrowRight, Grid3X3, Layers, Activity, Loader2 } from "lucide-react";

import { PageHeader } from "@/components/page-header";

export default function PortfolioClientPage() {
    const { address } = useAccount();
    const { collections, stats, loading, error, tokens } = usePortfolio();

    // Validate collections
    const validCollections = collections.filter(collection => {
        return CollectionValidator.isValid(collection);
    });

    return (
        <div className="min-h-screen py-10">
            <div className="container mx-auto px-4">
                <PageHeader
                    title="IP Portfolio"
                    description={address
                        ? "Showcase and manage your digital assets and collections"
                        : "Connect your wallet to open your onchain portfolio."
                    }
                />

                {/* Show message when no wallet is connected */}
                {!address && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Please connect your wallet to view your portfolio</p>
                    </div>
                )}

                {/* Show content when wallet is connected */}
                {address && (
                    <Suspense fallback={<PortfolioSkeleton />}>
                        <div className="space-y-12 container mx-auto">
                            {loading ? (
                                <div className="space-y-8">
                                    <div className="flex flex-col items-center justify-center space-y-4 py-8 animate-in fade-in duration-500">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-gradient-to-r from-outrun-magenta/30 via-outrun-cyan/30 to-outrun-orange/30 blur-xl rounded-full animate-pulse" />
                                            <Loader2 className="h-8 w-8 animate-spin text-outrun-cyan relative z-10" />
                                        </div>
                                        <div className="text-center space-y-1">
                                            <p className="text-lg font-medium text-foreground">Loading Portfolio</p>
                                            <p className="text-sm text-muted-foreground max-w-md mx-auto">
                                                This dapp is permissionless and is directly reading your onchain data from Starknet.
                                            </p>
                                        </div>
                                    </div>
                                    <StatsSkeleton />
                                </div>
                            ) : (
                                <CollectionStats
                                    totalCollections={validCollections.length}
                                    totalAssets={stats.totalNFTs}
                                    totalValue={stats.totalValue}
                                    topCollection={stats.topCollection}
                                    collections={validCollections}
                                    tokens={tokens}
                                />
                            )}

                            {error && <Alert variant="destructive">{error}</Alert>}

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {/* Collections Card */}
                                <Link href="/portfolio/collections" className="group">
                                    <div className="glass-card h-full rounded-2xl p-8 transition-all duration-300 hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.3)] relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                                            <Grid3X3 size={120} />
                                        </div>

                                        <div className="relative z-10 flex flex-col h-full justify-between space-y-6">
                                            <div className="space-y-4">
                                                <div className="h-12 w-12 rounded-xl bg-outrun-cyan/10 flex items-center justify-center text-outrun-cyan group-hover:bg-gradient-to-br group-hover:from-outrun-magenta group-hover:to-outrun-cyan group-hover:text-white group-hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all duration-300">
                                                    <Grid3X3 size={24} />
                                                </div>
                                                <div>
                                                    <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">My Collections</h2>
                                                    <p className="text-muted-foreground">
                                                        Manage your IP collections.
                                                        {validCollections.length > 0 && <span className="block mt-2 font-medium text-foreground">{validCollections.length} Collections found</span>}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center text-sm font-medium text-primary group-hover:translate-x-2 transition-transform duration-300">
                                                Open Collections <ArrowRight className="ml-2 h-4 w-4" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>

                                {/* Assets Card */}
                                <Link href="/portfolio/assets" className="group">
                                    <div className="glass-card h-full rounded-2xl p-8 transition-all duration-300 hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.3)] relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                                            <Layers size={120} />
                                        </div>

                                        <div className="relative z-10 flex flex-col h-full justify-between space-y-6">
                                            <div className="space-y-4">
                                                <div className="h-12 w-12 rounded-xl bg-outrun-magenta/10 flex items-center justify-center text-outrun-magenta group-hover:bg-gradient-to-br group-hover:from-outrun-cyan group-hover:to-outrun-magenta group-hover:text-white group-hover:shadow-[0_0_20px_rgba(255,0,255,0.3)] transition-all duration-300">
                                                    <Layers size={24} />
                                                </div>
                                                <div>
                                                    <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">My Assets</h2>
                                                    <p className="text-muted-foreground">
                                                        View your onchain portfolio of assets.
                                                        {stats.totalNFTs > 0 && <span className="block mt-2 font-medium text-foreground">{stats.totalNFTs} Assets found</span>}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center text-sm font-medium text-primary group-hover:translate-x-2 transition-transform duration-300">
                                                Open Assets <ArrowRight className="ml-2 h-4 w-4" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>

                                {/* Activities Card */}
                                <Link href="/portfolio/activities" className="group">
                                    <div className="glass-card h-full rounded-2xl p-8 transition-all duration-300 hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.3)] relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                                            <Activity size={120} />
                                        </div>

                                        <div className="relative z-10 flex flex-col h-full justify-between space-y-6">
                                            <div className="space-y-4">
                                                <div className="h-12 w-12 rounded-xl bg-outrun-orange/10 flex items-center justify-center text-outrun-orange group-hover:bg-gradient-to-br group-hover:from-outrun-orange group-hover:to-outrun-magenta group-hover:text-white group-hover:shadow-[0_0_20px_rgba(255,153,0,0.3)] transition-all duration-300">
                                                    <Activity size={24} />
                                                </div>
                                                <div>
                                                    <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">Activities</h2>
                                                    <p className="text-muted-foreground">
                                                        Track your onchain history.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center text-sm font-medium text-primary group-hover:translate-x-2 transition-transform duration-300">
                                                View Activities <ArrowRight className="ml-2 h-4 w-4" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>

                        </div>
                    </Suspense>
                )}
            </div>
        </div>
    );
}

function StatsSkeleton() {
    return (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {Array(4)
                .fill(null)
                .map((_, i) => (
                    <div key={i} className="rounded-xl border glass text-card-foreground shadow space-y-2 p-6">
                        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-4" />
                        </div>
                        <div className="space-y-1">
                            <Skeleton className="h-8 w-16" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                    </div>
                ))}
        </div>
    );
}

function PortfolioSkeleton() {
    return (
        <div className="space-y-8 container mx-auto">
            <StatsSkeleton />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Skeleton className="h-64 w-full rounded-2xl" />
                <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
        </div>
    );
}
