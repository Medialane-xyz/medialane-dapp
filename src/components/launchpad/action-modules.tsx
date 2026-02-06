"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Box, Layers, RefreshCw, Wand2, ArrowUpRight, Plus } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const modules = [
    {
        id: "mint",
        title: "Mint Asset",
        subtitle: "Register New IP",
        description: "Create a programmable IP asset with embedded licensing rules.",
        icon: Box,
        href: "/create/asset",
        color: "text-blue-500",
        bg: "bg-blue-500/10 dark:bg-blue-500/20",
        border: "group-hover:border-blue-500/50",
        size: "large", // Spans 2 cols on tablet+
    },
    {
        id: "collection",
        title: "Collection",
        subtitle: "Deploy Contract",
        description: "Launch a new smart contract collection for your assets.",
        icon: Layers,
        href: "/create/collection",
        color: "text-emerald-500",
        bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
        border: "group-hover:border-emerald-500/50",
        size: "medium",
    },
    {
        id: "remix",
        title: "Remix Studio",
        subtitle: "Derivative Work",
        description: "Create a valuable derivative from existing onchain IP.",
        icon: RefreshCw,
        href: "/create/remix",
        color: "text-purple-500",
        bg: "bg-purple-500/10 dark:bg-purple-500/20",
        border: "group-hover:border-purple-500/50",
        size: "medium",
    },
    {
        id: "agent",
        title: "Agent Swarm",
        subtitle: "Deploy AI",
        description: "Configure an autonomous agent to manage your IP portfolio.",
        icon: Wand2,
        href: "/agentic", // Placeholder
        color: "text-amber-500",
        bg: "bg-amber-500/10 dark:bg-amber-500/20",
        border: "group-hover:border-amber-500/50",
        size: "medium",
    },
]

export function ActionModules() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {modules.map((module) => (
                <Link
                    href={module.href}
                    key={module.id}
                    className={cn(
                        "group relative focus:outline-none",
                        module.size === "large" && "md:col-span-2 lg:col-span-2"
                    )}
                >
                    <Card className={cn(
                        "h-full p-6 transition-all duration-300",
                        "bg-card/50 backdrop-blur-sm border-border",
                        "hover:bg-accent/5 hover:shadow-lg dark:hover:shadow-primary/5",
                        module.border
                    )}>
                        {/* Hover Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />

                        <div className="relative flex flex-col h-full justify-between gap-6">
                            <div className="flex justify-between items-start">
                                <div className={cn(
                                    "p-3 rounded-lg flex items-center justify-center transition-colors",
                                    module.bg,
                                    module.color
                                )}>
                                    <module.icon className="w-6 h-6" />
                                </div>

                                <ArrowUpRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-foreground transition-colors" />
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                                        {module.title}
                                    </h3>
                                    <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-mono text-muted-foreground bg-secondary/50">
                                        {module.subtitle}
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {module.description}
                                </p>
                            </div>
                        </div>
                    </Card>
                </Link>
            ))}
        </div>
    )
}
