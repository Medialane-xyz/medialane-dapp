"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Box, Layers, RefreshCw, ArrowRight, Wand2 } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const tools = [
    {
        id: "asset",
        title: "Mint Asset",
        description: "Turn your creative work into a Programmable IP asset with embedded licensing terms.",
        icon: Box,
        href: "/create/asset",
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        badge: "Most Popular",
    },
    {
        id: "collection",
        title: "Create Collection",
        description: "Deploy a smart contract collection to organize and manage multiple IP assets.",
        icon: Layers,
        href: "/create/collection",
        color: "text-green-400",
        bg: "bg-green-500/10",
        badge: "Core",
    },
    {
        id: "remix",
        title: "Remix Existing",
        description: "Create a derivative work from an existing IP asset to unlock new value.",
        icon: RefreshCw,
        href: "/create/remix",
        color: "text-purple-400",
        bg: "bg-purple-500/10",
        badge: "Advanced",
    },
]

export function CreationTools() {
    return (
        <div id="create-options" className="space-y-8 mb-20">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Wand2 className="w-6 h-6 text-primary" />
                    Creation Studio
                </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {tools.map((tool, index) => (
                    <motion.div
                        key={tool.id}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <Link href={tool.href} className="block h-full">
                            <Card className="h-full p-6 bg-black/40 border-white/10 hover:border-white/20 hover:bg-white/5 backdrop-blur-xl transition-all group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`w-14 h-14 rounded-2xl ${tool.bg} flex items-center justify-center ${tool.color} group-hover:scale-110 transition-transform`}>
                                        <tool.icon className="w-8 h-8" />
                                    </div>
                                    {tool.badge && (
                                        <Badge variant="secondary" className="bg-white/10 text-white/80 border-white/10">
                                            {tool.badge}
                                        </Badge>
                                    )}
                                </div>

                                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                                    {tool.title}
                                </h3>
                                <p className="text-muted-foreground mb-6 line-clamp-2">
                                    {tool.description}
                                </p>

                                <div className="flex items-center text-sm font-medium text-white/50 group-hover:text-white transition-colors">
                                    Get Started
                                    <ArrowRight className="ml-2 w-4 h-4 -translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all" />
                                </div>
                            </Card>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
