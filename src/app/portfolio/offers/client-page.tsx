"use client";

import { useState } from "react";
import { PortfolioListings } from "@/components/portfolio/portfolio-listings";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft, History, Gavel } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OffersClientPage() {
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
                            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                                <Gavel className="w-6 h-6" />
                            </div>
                            <h1 className="text-4xl font-black tracking-tight text-foreground">
                                My Offers
                            </h1>
                        </div>
                        <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                            Manage your active marketplace bids and buy requests.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative group flex-1 sm:min-w-[300px]">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Search your offers..."
                            className="pl-10 h-11 bg-muted/40 border-border/40 focus:bg-background transition-all rounded-xl"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="h-11 rounded-xl border-border/40 px-6 gap-2 hover:bg-muted/50">
                        <History className="w-4 h-4" />
                        Bid History
                    </Button>
                </div>
            </div>

            {/* Quick Navigation Tabs */}
            <div className="flex gap-4 mb-8 border-b border-border/40 pb-px">
                <Link
                    href="/portfolio/listings"
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border-b-2 border-transparent"
                >
                    Selling
                </Link>
                <Link
                    href="/portfolio/offers"
                    className="px-4 py-2 text-sm font-bold text-primary border-b-2 border-primary"
                >
                    Buying
                </Link>
            </div>

            {/* Content Area */}
            <div className="relative">
                <PortfolioListings searchQuery={searchQuery} mode="offers" />

                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -z-10" />
            </div>
        </div>
    );
}
