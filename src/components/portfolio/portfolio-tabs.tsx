import Link from "next/link";
import { cn } from "@/lib/utils";

interface PortfolioTabsProps {
    activePath: string;
}

export function PortfolioTabs({ activePath }: PortfolioTabsProps) {
    const tabs = [
        { name: "My Listings", path: "/portfolio/listings" },
        { name: "Offers Made", path: "/portfolio/offers" },
        { name: "Offers Received", path: "/portfolio/offers-received" },
        { name: "Bid History", path: "/portfolio/bid-history" },
    ];

    return (
        <div className="flex gap-4 mb-8 border-b border-border/40 pb-px overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
                const isActive = activePath === tab.path;
                return (
                    <Link
                        key={tab.path}
                        href={tab.path}
                        className={cn(
                            "px-4 py-2 text-sm whitespace-nowrap transition-colors border-b-2",
                            isActive
                                ? "font-bold text-primary border-primary"
                                : "font-medium text-muted-foreground hover:text-foreground border-transparent"
                        )}
                    >
                        {tab.name}
                    </Link>
                );
            })}
        </div>
    );
}
