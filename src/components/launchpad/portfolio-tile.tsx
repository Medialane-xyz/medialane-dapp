"use client"

import { usePortfolio } from "@/hooks/use-portfolio"
import { Card } from "@/components/ui/card"
import { Loader2, Layers, TrendingUp, Wallet } from "lucide-react"
import { useAccount } from "@starknet-react/core"

export function PortfolioTile() {
    const { address } = useAccount()
    const { stats, loading, collections } = usePortfolio()

    if (!address) {
        return (
            <Card className="h-full bg-slate-900 border-white/10 p-6 flex flex-col justify-center items-center text-center space-y-3 relative overflow-hidden group">
                {/* Vivid inactive state */}
                <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-blue-600/10 transition-colors" />
                <div className="relative z-10 p-4 rounded-full bg-slate-800 text-slate-400">
                    <Wallet className="w-6 h-6" />
                </div>
                <div className="relative z-10">
                    <h3 className="text-white font-semibold">Connect Wallet</h3>
                    <p className="text-sm text-slate-500">View your creator stats</p>
                </div>
            </Card>
        )
    }

    if (loading) {
        return (
            <Card className="h-full bg-slate-900 border-white/10 p-6 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
            </Card>
        )
    }

    const hasActivity = stats.totalNFTs > 0

    return (
        <Card className="h-full bg-slate-900 border-white/10 relative overflow-hidden group hover:border-blue-500/30 transition-all duration-500">

            {/* Dynamic Background */}
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-blue-600/10 blur-[80px] rounded-full group-hover:bg-blue-500/20 transition-all duration-500" />

            <div className="p-6 relative z-10 h-full flex flex-col justify-between">

                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                            <Layers className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold text-white uppercase tracking-wider">Your Assets</span>
                    </div>
                    {hasActivity && <span className="text-xs text-emerald-400 font-mono flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Active</span>}
                </div>

                <div className="space-y-1 mt-4">
                    <div className="text-4xl font-bold text-white tracking-tighter">
                        {stats.totalNFTs}
                    </div>
                    <p className="text-sm text-slate-400 font-medium">
                        Total Created Items
                    </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Collections</span>
                        <span className="text-white font-mono">{collections.length}</span>
                    </div>
                    {hasActivity && stats.topCollection.name && (
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Top Collection</span>
                            <span className="text-blue-300 truncate max-w-[120px]">{stats.topCollection.name}</span>
                        </div>
                    )}
                </div>

            </div>
        </Card>
    )
}
