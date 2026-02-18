"use client";

import { useState } from "react";
import { PortfolioOrderList } from "@/components/portfolio/portfolio-order-list";
import { Input } from "@/components/ui/input";
import { Search, History } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OffersReceivedClientPage() {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="container max-w-7xl mx-auto px-4 py-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div className="space-y-4">

                    <div className="space-y-2">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl text-foreground bg-blue/10 rounded-xl py-2 px-4">
                                    Offers Received
                                </h1>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative group flex-1 sm:min-w-[300px]">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Search received offers..."
                            className="pl-10 h-11 bg-muted/40 border-border/40 focus:bg-background transition-all rounded-xl"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Link href="/portfolio/bid-history">
                        <Button variant="outline" className="h-11 rounded-xl border-border/40 px-6 gap-2 hover:bg-muted/50">
                            <History className="w-4 h-4" />
                            Bid History
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Quick Navigation Tabs */}
            <div className="flex gap-4 mb-8 border-b border-border/40 pb-px overflow-x-auto no-scrollbar">
                <Link
                    href="/portfolio/listings"
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border-b-2 border-transparent whitespace-nowrap"
                >
                    My Listings
                </Link>
                <Link
                    href="/portfolio/offers"
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border-b-2 border-transparent whitespace-nowrap"
                >
                    Offers Made
                </Link>
                <Link
                    href="/portfolio/offers-received"
                    className="px-4 py-2 text-sm font-bold text-primary border-b-2 border-primary whitespace-nowrap"
                >
                    Offers Received
                </Link>
                <Link
                    href="/portfolio/bid-history"
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border-b-2 border-transparent whitespace-nowrap"
                >
                    Bid History
                </Link>
            </div>

            {/* Content Area */}
            <div className="relative">
                <PortfolioOrderList searchQuery={searchQuery} mode="offers-received" />

                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10 animate-pulse delay-1000" />
            </div>
        </div>
    );
}
