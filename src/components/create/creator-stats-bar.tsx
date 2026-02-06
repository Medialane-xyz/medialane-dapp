"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Layers, FolderOpen, TrendingUp, Sparkles } from "lucide-react"
import { useAccount } from "@starknet-react/core"
import { usePortfolio } from "@/hooks/use-portfolio"

export function CreatorStatsBar() {
    const { address } = useAccount()
    const { stats, loading, collections } = usePortfolio()

    // Only show when wallet is connected
    if (!address || loading) {
        return null
    }

    const hasActivity = stats.totalNFTs > 0

    return (
        <Card className="glass-card p-4 mb-6 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/10 dark:to-purple-950/10">
            <div className="flex flex-wrap items-center gap-6">

                {/* Welcome Message */}
                <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm font-medium text-muted-foreground">Your Creator Dashboard</span>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-4 md:gap-6">
                    {/* Total Assets */}
                    <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <div className="text-sm">
                            <span className="font-bold text-foreground">{stats.totalNFTs}</span>
                            <span className="text-muted-foreground ml-1">Assets</span>
                        </div>
                    </div>

                    {/* Collections */}
                    <div className="flex items-center gap-2">
                        <FolderOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <div className="text-sm">
                            <span className="font-bold text-foreground">{collections.length}</span>
                            <span className="text-muted-foreground ml-1">Collections</span>
                        </div>
                    </div>

                    {/* Top Collection */}
                    {stats.topCollection.name && (
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            <div className="text-sm min-w-0">
                                <span className="font-medium text-foreground truncate inline-block max-w-[150px]">
                                    {stats.topCollection.name}
                                </span>
                                <span className="text-muted-foreground ml-1">({stats.topCollection.tokenCount})</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Status Badge */}
                <div className="ml-auto">
                    <Badge variant={hasActivity ? "default" : "secondary"} className="gap-1.5 text-xs">
                        <div className={`w-1.5 h-1.5 rounded-full ${hasActivity ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
                        {hasActivity ? "Active" : "New"}
                    </Badge>
                </div>
            </div>
        </Card>
    )
}
