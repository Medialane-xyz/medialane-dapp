"use client";

import { Suspense, useState, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Search, X, Tag } from "lucide-react";
import { useAccount } from "@starknet-react/core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import dynamic from "next/dynamic";
import { WalletConnectCTA } from "@/components/portfolio/wallet-connect-cta";

const PortfolioListings = dynamic<any>(() =>
    import("@/components/portfolio/portfolio-listings").then(mod => mod.PortfolioListings), {
    loading: () => <ListingsSkeleton />
});

export default function ListingsClientPage() {
    const { address } = useAccount();
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="container max-w-7xl mx-auto px-4 py-8 md:py-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div className="space-y-4">
                    <Link
                        href="/portfolio/assets"
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Portfolio
                    </Link>
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                <Tag className="w-6 h-6" />
                            </div>
                            <h1 className="text-4xl font-black tracking-tight text-foreground">
                                My Listings
                            </h1>
                        </div>
                        <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                            Manage your active marketplace listings for assets you own.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    {!address ? null : (
                        <div className="relative group flex-1 sm:min-w-[300px]">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Search your listings..."
                                className="pl-10 h-11 bg-muted/40 border-border/40 focus:bg-background transition-all rounded-xl"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Navigation Tabs */}
            <div className="flex gap-4 mb-8 border-b border-border/40 pb-px">
                <Link
                    href="/portfolio/listings"
                    className="px-4 py-2 text-sm font-bold text-primary border-b-2 border-primary"
                >
                    Selling
                </Link>
                <Link
                    href="/portfolio/offers"
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border-b-2 border-transparent"
                >
                    Buying
                </Link>
            </div>

            {/* Content Area */}
            <div className="relative">
                {!address ? (
                    <div className="max-w-4xl mx-auto py-12">
                        <WalletConnectCTA
                            title="Connect wallet"
                            description="Securely manage your active marketplace listings."
                        />
                    </div>
                ) : (
                    <Suspense fallback={<ListingsSkeleton />}>
                        <PortfolioListings searchQuery={searchQuery} mode="listings" />
                    </Suspense>
                )}

                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
            </div>
        </div>
    );
}

function ListingsSkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array(4).fill(0).map((_, i) => (
                    <div key={i} className="rounded-xl border border-border/50 bg-card/50 overflow-hidden shadow-sm">
                        <Skeleton className="aspect-square w-full" />
                        <div className="p-4 space-y-3">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <div className="pt-2 flex flex-col gap-2">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-9 w-full" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
