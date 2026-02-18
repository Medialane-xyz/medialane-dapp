"use client";

import { useState } from "react";
import { PortfolioOrderList } from "@/components/portfolio/portfolio-order-list";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";

export default function BidHistoryClientPage() {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="container max-w-7xl mx-auto px-4 py-20">
            {/* Header Section */}
            <PageHeader
                title="Bid History"
                description="View your past bidding activity."
                className="pt-8 pb-8"
            >
                <div className="relative group flex-1 sm:min-w-[300px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search history..."
                        className="pl-10 bg-muted/20 border-border/50 focus:border-primary/50 transition-all rounded-xl"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </PageHeader>

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
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border-b-2 border-transparent whitespace-nowrap"
                >
                    Offers Received
                </Link>
                <Link
                    href="/portfolio/bid-history"
                    className="px-4 py-2 text-sm font-bold text-primary border-b-2 border-primary whitespace-nowrap"
                >
                    Bid History
                </Link>
            </div>

            {/* Content Area */}
            <div className="relative">
                <PortfolioOrderList searchQuery={searchQuery} mode="bid-history" />

                {/* Decorative Elements */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10 animate-pulse delay-1000" />
            </div>
        </div>
    );
}
