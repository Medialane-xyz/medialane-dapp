"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, BarChart3, Zap, Layers, Music, Image as ImageIcon } from "lucide-react"

export function MarketInsights() {
    return (
        <Card className="h-full bg-slate-900/50 border-white/10 backdrop-blur-xl shadow-xl flex flex-col">
            <CardHeader className="pb-4 border-b border-white/5">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-emerald-400" />
                        Market Insights
                    </CardTitle>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] font-medium text-emerald-400">LIVE</span>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-6 flex-1">

                {/* Top Trending Categories */}
                <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Top Performing Categories (24h)</h4>

                    <div className="space-y-2">
                        <TrendItem
                            icon={Music}
                            label="Lo-Fi Beats"
                            growth="+12.4%"
                            volume="45 ETH"
                            color="text-pink-400"
                        />
                        <TrendItem
                            icon={ImageIcon}
                            label="Abstract 3D"
                            growth="+8.2%"
                            volume="22 ETH"
                            color="text-blue-400"
                        />
                        <TrendItem
                            icon={Layers}
                            label="Game Sprites"
                            growth="+5.1%"
                            volume="15 ETH"
                            color="text-amber-400"
                        />
                    </div>
                </div>

                {/* Opportunity Alert */}
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                            <Zap className="w-4 h-4" />
                        </div>
                        <div>
                            <h5 className="text-sm font-medium text-blue-200 mb-1">Low Supply Alert</h5>
                            <p className="text-xs text-slate-400 leading-relaxed mb-3">
                                Verified "Sci-Fi Soundscapes" are in high demand but low supply. Minting in this category is recommended.
                            </p>
                            <Button size="sm" variant="ghost" className="h-7 text-xs px-0 text-blue-400 hover:text-blue-300 hover:bg-transparent p-0">
                                View Category <ArrowUpRight className="w-3 h-3 ml-1" />
                            </Button>
                        </div>
                    </div>
                </div>

            </CardContent>
        </Card>
    )
}

function TrendItem({ icon: Icon, label, growth, volume, color }: any) {
    return (
        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${color}`} />
                <span className="text-sm font-medium text-slate-200 group-hover:text-white">{label}</span>
            </div>
            <div className="text-right">
                <div className="text-xs font-bold text-emerald-400">{growth}</div>
                <div className="text-[10px] text-slate-500">Vol: {volume}</div>
            </div>
        </div>
    )
}
