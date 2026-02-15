"use client"

import { useRef, useCallback, type MouseEvent } from "react"
import {
    Shield,
    Grid3X3,
    RefreshCw,
    BookOpen,
    Sparkles,
    Layers,
    Crown,
    Ticket,
    RefreshCcw,
    Heart,
    CircleDollarSign,
    Gem,
    ArrowUpRight,
    Lock,
    type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

const iconMap: Record<string, LucideIcon> = {
    Shield, Grid3X3, RefreshCw, BookOpen, Sparkles, Layers,
    Crown, Ticket, RefreshCcw, Heart, CircleDollarSign, Gem,
}

export interface LaunchpadFeatureData {
    id: string
    title: string
    description: string
    icon: string
    href: string
    gradient: string
    tags: string[]
    active: boolean
}

interface LaunchpadCardProps {
    feature: LaunchpadFeatureData
    index: number
}

export function LaunchpadCard({ feature, index }: LaunchpadCardProps) {
    const cardRef = useRef<HTMLDivElement>(null)
    const Icon = iconMap[feature.icon] || Shield
    const isActive = feature.active

    const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current || !isActive) return
        const rect = cardRef.current.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        cardRef.current.style.setProperty("--mouse-x", `${x}%`)
        cardRef.current.style.setProperty("--mouse-y", `${y}%`)
    }, [isActive])

    const card = (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            className={cn(
                "lp-card h-full rounded-2xl border",
                "bg-card/70 backdrop-blur-sm border-border/30",
                isActive ? "lp-card--active" : "lp-card--inactive",
            )}
        >
            {/* Color edge */}
            {isActive && (
                <div className={cn("lp-card-edge bg-gradient-to-r", feature.gradient)} />
            )}

            {/* Gradient tint bleed */}
            <div className={cn("lp-card-tint bg-gradient-to-b", feature.gradient)} />

            <div className="relative z-[2] p-5 flex flex-col h-full">
                {/* Row 1: icon + status */}
                <div className="flex items-start justify-between mb-3">
                    <div
                        className={cn(
                            "lp-card-icon w-10 h-10 rounded-xl flex items-center justify-center shadow-sm",
                            "bg-gradient-to-br",
                            feature.gradient,
                        )}
                    >
                        <Icon className="h-[18px] w-[18px] text-white" />
                    </div>

                    {isActive ? (
                        <ArrowUpRight className="lp-card-arrow h-4 w-4 text-muted-foreground" />
                    ) : (
                        <Lock className="h-3 w-3 text-muted-foreground/30" />
                    )}
                </div>

                {/* Title */}
                <h3 className={cn(
                    "text-sm font-semibold mb-1 leading-tight",
                    isActive ? "text-foreground" : "text-muted-foreground/60"
                )}>
                    {feature.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-muted-foreground/55 leading-relaxed flex-1 line-clamp-2">
                    {feature.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-3">
                    {feature.tags.map((tag) => (
                        <span
                            key={tag}
                            className={cn(
                                "text-[9px] px-1.5 py-px rounded-md font-medium tracking-wide",
                                isActive
                                    ? "bg-muted/60 text-muted-foreground/50"
                                    : "bg-muted/25 text-muted-foreground/25"
                            )}
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )

    const wrapper = (
        <div className="stagger-in h-full" style={{ animationDelay: `${index * 40}ms` }}>
            {card}
        </div>
    )

    if (isActive) {
        return (
            <Link href={feature.href} className="block h-full">
                {wrapper}
            </Link>
        )
    }

    return wrapper
}
