"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PortfolioListingsTabsProps {
    activeTab: "made" | "received"
    onTabChange: (tab: "made" | "received") => void
}

export function PortfolioListingsTabs({ activeTab, onTabChange }: PortfolioListingsTabsProps) {
    return (
        <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-xl border border-border/50 w-fit mb-6">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onTabChange("made")}
                className={cn(
                    "rounded-lg text-xs font-bold transition-all px-4",
                    activeTab === "made" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
            >
                Offers Made
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onTabChange("received")}
                className={cn(
                    "rounded-lg text-xs font-bold transition-all px-4",
                    activeTab === "received" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
            >
                Offers Received
            </Button>
        </div>
    )
}
