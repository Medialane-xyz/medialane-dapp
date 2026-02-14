"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Clock,
    Coins,
    Shield,
    ChevronRight,
    TrendingUp,
    Star,
    CheckCircle2
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { LaunchpadOption } from "./launchpad-option-card"

interface LaunchpadOptionRowProps {
    option: LaunchpadOption
}

export function LaunchpadOptionRow({ option }: LaunchpadOptionRowProps) {
    return (
        <div className="group relative overflow-hidden transition-all duration-300 hover:bg-card/80 border border-border/50 rounded-lg bg-card/40 backdrop-blur-sm">

            {/* Gradient accent (Left) */}
            <div className={cn("absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b opacity-50 group-hover:opacity-100", option.gradient)} />

            <div className="flex flex-col md:flex-row items-center gap-4 p-4 pl-6">

                {/* Icon */}
                <div className={cn("p-2 rounded-lg bg-background/50 border border-border/50 shadow-sm shrink-0", option.iconColor)}>
                    <option.icon className="w-5 h-5" />
                </div>

                {/* Main Info */}
                <div className="flex-1 min-w-0 text-center md:text-left">
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {option.title}
                        </h3>

                        {/* Badges inline for desktop */}
                        <div className="hidden md:flex gap-2">
                            {option.popular && (
                                <Badge variant="secondary" className="text-[10px] h-5 px-1.5 text-amber-500 bg-amber-500/10 border-amber-500/20">
                                    Popular
                                </Badge>
                            )}
                            {option.trending && (
                                <Badge variant="secondary" className="text-[10px] h-5 px-1.5 text-purple-500 bg-purple-500/10 border-purple-500/20">
                                    Trending
                                </Badge>
                            )}
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground truncate max-w-lg mt-0.5">
                        {option.description}
                    </p>
                </div>

                {/* Metadata (Hidden on small mobile, visible on tablet+) */}
                <div className="hidden md:grid grid-cols-3 gap-6 text-xs text-muted-foreground shrink-0 px-4 border-l border-r border-border/30">
                    <div className="flex flex-col items-center md:items-start gap-1">
                        <span className="text-[10px] uppercase opacity-50 font-semibold tracking-wider">Time</span>
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3" />
                            <span>{option.timeEstimate}</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center md:items-start gap-1">
                        <span className="text-[10px] uppercase opacity-50 font-semibold tracking-wider">Fee</span>
                        <div className="flex items-center gap-1.5">
                            <Coins className="w-3 h-3" />
                            <span>{option.fee}</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center md:items-start gap-1">
                        <span className="text-[10px] uppercase opacity-50 font-semibold tracking-wider">Level</span>
                        <div className="flex items-center gap-1.5">
                            <Shield className="w-3 h-3" />
                            <span>{option.complexity}</span>
                        </div>
                    </div>
                </div>

                {/* Action */}
                <Link href={option.href} className="w-full md:w-auto shrink-0">
                    <Button variant="ghost" size="sm" className="w-full gap-2 hover:bg-primary/10 hover:text-primary group-hover:translate-x-1 transition-all">
                        Start
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </Link>
            </div>
        </div>
    )
}
