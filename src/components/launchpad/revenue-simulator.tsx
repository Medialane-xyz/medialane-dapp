"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Calculator, DollarSign, TrendingUp, HelpCircle } from "lucide-react"

export function RevenueSimulator() {
    const [licensePrice, setLicensePrice] = useState(0.05)
    const [volume, setVolume] = useState(100)
    const [royaltyRate, setRoyaltyRate] = useState(5)

    // Calculations
    const primarySales = licensePrice * volume
    const secondaryVolume = primarySales * 2 // Estimate secondary trade volume multiplier
    const royaltyRevenue = secondaryVolume * (royaltyRate / 100)
    const totalRevenue = primarySales + royaltyRevenue

    return (
        <Card className="h-full bg-slate-900/50 border-white/10 backdrop-blur-xl shadow-xl">
            <CardHeader className="pb-4 border-b border-white/5">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-indigo-400" />
                        Revenue Simulator
                    </CardTitle>
                    <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 bg-indigo-500/10">BETA</Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
                {/* Input: License Price */}
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400">License Price (ETH)</span>
                        <span className="text-white font-mono">{licensePrice.toFixed(3)} ETH</span>
                    </div>
                    <Slider
                        value={[licensePrice]}
                        max={1}
                        step={0.005}
                        onValueChange={([v]) => setLicensePrice(v)}
                        className="py-1"
                    />
                </div>

                {/* Input: Volume */}
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Projected Sales</span>
                        <span className="text-white font-mono">{volume} Units</span>
                    </div>
                    <Slider
                        value={[volume]}
                        max={1000}
                        step={10}
                        onValueChange={([v]) => setVolume(v)}
                        className="py-1"
                    />
                </div>

                {/* Input: Royalty */}
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Royalty Rate</span>
                        <span className="text-white font-mono">{royaltyRate}%</span>
                    </div>
                    <Slider
                        value={[royaltyRate]}
                        max={10}
                        step={0.5}
                        onValueChange={([v]) => setRoyaltyRate(v)}
                        className="py-1"
                    />
                </div>

                {/* Output: Total Estimations */}
                <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10">
                    <div className="flex items-center gap-2 mb-2 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                        <TrendingUp className="w-3 h-3" />
                        Potential Earnings
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-white tracking-tight">
                            {totalRevenue.toFixed(2)} ETH
                        </span>
                        <span className="text-sm text-emerald-400">
                            ≈ ${(totalRevenue * 2600).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>
                    </div>
                    <div className="mt-2 text-xs text-slate-500 flex justify-between">
                        <span>Primary: {primarySales.toFixed(2)} ETH</span>
                        <span>Royalties: {royaltyRevenue.toFixed(2)} ETH</span>
                    </div>
                </div>

                <div className="text-xs text-slate-600 flex items-start gap-2">
                    <HelpCircle className="w-3 h-3 mt-0.5 shrink-0" />
                    <p>Estimations based on typical market liquidity. Royalties calculated purely on simulated secondary trade volume.</p>
                </div>

            </CardContent>
        </Card>
    )
}
