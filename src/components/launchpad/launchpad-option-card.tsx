"use client"

import { Card, CardContent } from "@/components/ui/card"
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

export interface LaunchpadOption {
    id: string
    title: string
    description: string
    icon: any // Lucide icon component
    href: string
    popular?: boolean
    trending?: boolean
    gradient: string
    iconColor: string
    timeEstimate: string
    fee: string
    complexity: string
    benefits: string[]
    userCount?: string
    tag?: string
}

interface LaunchpadOptionCardProps {
    option: LaunchpadOption
}

export function LaunchpadOptionCard({ option }: LaunchpadOptionCardProps) {
    return (
        <Card className="group relative overflow-hidden transition-all duration-500 hover:-translate-y-1 bg-white/50 dark:bg-black/40 backdrop-blur-xl border-black/5 dark:border-white/10 hover:border-primary/50 dark:hover:border-outrun-cyan/50 hover:shadow-[0_0_30px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_0_30px_rgba(0,255,255,0.15)] ring-1 ring-inset ring-transparent hover:ring-primary/20 dark:hover:ring-outrun-cyan/20">

            {/* Neon Glow Accent (Top) */}
            <div className={cn("absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r opacity-50 group-hover:opacity-100 transition-opacity", option.gradient)} />

            {/* Inner Glow (Dark Mode only) */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none dark:shadow-[inset_0_0_40px_rgba(0,255,255,0.05)]" />

            <CardContent className="p-6 relative z-10">
                {/* Header */}
                <div className="flex justify-between items-start mb-5">
                    <div className={cn(
                        "p-3 rounded-2xl border shadow-sm transition-transform group-hover:scale-105 duration-300",
                        "bg-white dark:bg-white/5 border-black/5 dark:border-white/10",
                        option.iconColor
                    )}>
                        <option.icon className="w-6 h-6" />
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        {option.popular && (
                            <Badge variant="secondary" className="font-mono text-[10px] tracking-wider uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
                                Popular
                            </Badge>
                        )}
                        {option.trending && (
                            <Badge variant="secondary" className="font-mono text-[10px] tracking-wider uppercase bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20">
                                Trending
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="mb-6 space-y-3">
                    <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary dark:group-hover:text-outrun-cyan transition-colors">
                        {option.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {option.description}
                    </p>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs font-medium text-muted-foreground/80 mb-6 p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                    <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 opacity-70" />
                        <span>{option.timeEstimate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Coins className="w-3.5 h-3.5 opacity-70" />
                        <span>{option.fee}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5 opacity-70" />
                        <span>{option.complexity}</span>
                    </div>
                    <div className="flex items-center gap-2 text-primary dark:text-outrun-cyan">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified</span>
                    </div>
                </div>

                {/* Action */}
                <Link href={option.href} className="block mt-auto">
                    <Button className="w-full justify-between bg-foreground/5 hover:bg-primary hover:text-white dark:hover:bg-outrun-cyan dark:hover:text-black transition-all border border-black/5 dark:border-white/10 text-foreground">
                        Get Started
                        <ChevronRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
                    </Button>
                </Link>
            </CardContent>
        </Card>
    )
}
