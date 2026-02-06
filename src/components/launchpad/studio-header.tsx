"use client"

import { Badge } from "@/components/ui/badge"
import { Wifi, Command, UserCircle } from "lucide-react"

export function StudioHeader() {
    return (
        <div className="flex flex-col gap-4 mb-8">
            {/* Top Bar / Status Line */}
            <div className="flex items-center justify-between py-2 border-b border-border/40">
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="rounded-none border-primary/20 bg-primary/5 text-primary h-6 px-2 font-mono text-[10px] uppercase tracking-wider">
                        Creator Console v1.0
                    </Badge>
                    <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
                        <span className="relative w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        System Online
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
                        <Wifi className="w-3 h-3" />
                        <span>Starknet Mainnet</span>
                    </div>
                    <div className="h-4 w-[1px] bg-border/40 hidden sm:block" />
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-foreground">kalamaha.stark</span>
                        <UserCircle className="w-4 h-4 text-muted-foreground" />
                    </div>
                </div>
            </div>

            {/* Greeting / Context */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                        Creation Studio
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Manage your intellectual property assets and collections.
                    </p>
                </div>

                {/* Quick Actions / Stats Placeholder */}
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 rounded-lg bg-background border border-border flex flex-col items-center min-w-[100px]">
                        <span className="text-[10px] uppercase text-muted-foreground font-mono">Assets</span>
                        <span className="text-lg font-bold font-mono">12</span>
                    </div>
                    <div className="px-4 py-2 rounded-lg bg-background border border-border flex flex-col items-center min-w-[100px]">
                        <span className="text-[10px] uppercase text-muted-foreground font-mono">Royalty</span>
                        <span className="text-lg font-bold font-mono">2.4%</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
