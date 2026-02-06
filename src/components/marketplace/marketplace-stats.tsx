
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Users, Activity, Layers } from "lucide-react"

const stats = [
    {
        label: "Total Volume",
        value: "2,345 STRK",
        change: "+12.5%",
        icon: Activity,
        color: "text-blue-500",
    },
    {
        label: "Active Listings",
        value: "1,234",
        change: "+5.2%",
        icon: Layers,
        color: "text-purple-500",
    },
    {
        label: "Unique Creators",
        value: "450+",
        change: "+8.1%",
        icon: Users,
        color: "text-green-500",
    },
    {
        label: "Floor Price",
        value: "0.05 STRK",
        change: "+2.3%",
        icon: TrendingUp,
        color: "text-yellow-500",
    },
]

export function MarketplaceStats() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
                <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                                    <span className="text-xs font-medium text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded-full">
                                        {stat.change}
                                    </span>
                                </div>
                            </div>
                            <div className={`p-2 rounded-lg bg-background/50 border border-white/5 ${stat.color}`}>
                                <stat.icon className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
