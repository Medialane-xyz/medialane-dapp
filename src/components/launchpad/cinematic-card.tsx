"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Coins, Shield, MousePointerClick, Sparkles, ArrowRight, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { motion } from "framer-motion"
import type { CinematicOption } from "@/lib/creation-data"

interface CitadelCardProps {
    option: CinematicOption
    index: number
}

export function CitadelCard({ option, index }: CitadelCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group h-full"
        >
            <Link href={option.href} className="block h-full focus:outline-none">
                <Card className="h-full relative overflow-hidden bg-slate-900 border-white/10 hover:border-indigo-500/50 transition-all duration-300 shadow-2xl hover:shadow-indigo-500/10 group-hover:-translate-y-1">

                    {/* Hero Section (Mimics PurchaseDialog Header) */}
                    <div className="relative h-48 overflow-hidden">
                        {/* Blurred Background Layer */}
                        <div
                            className={cn(
                                "absolute inset-0 bg-gradient-to-br opacity-40 transition-opacity duration-500",
                                option.gradient
                            )}
                        />
                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-3xl" />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/60 to-slate-900" />

                        {/* Content */}
                        <div className="relative h-full flex items-end p-6">
                            <div className="flex items-center gap-4">
                                {/* Icon Box */}
                                <div className="w-16 h-16 rounded-xl bg-slate-900/50 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                                    <option.icon className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white tracking-tight leading-none mb-2">
                                        {option.title}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {option.tags.slice(0, 2).map(tag => (
                                            <Badge key={tag} variant="secondary" className="bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 text-[10px]">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Body Section */}
                    <div className="p-6 pt-2 space-y-6 flex flex-col h-[calc(100%-12rem)]">

                        <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
                            {option.description}
                        </p>

                        {/* Metadata Grid (Styled like Order Summary) */}
                        <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30 space-y-3">
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500 flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5" /> Est. Time
                                </span>
                                <span className="text-slate-200 font-medium">{option.timeEstimate}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500 flex items-center gap-1.5">
                                    <Coins className="w-3.5 h-3.5" /> Cost
                                </span>
                                <span className="text-emerald-400 font-medium">{option.cost}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500 flex items-center gap-1.5">
                                    <MousePointerClick className="w-3.5 h-3.5" /> Complexity
                                </span>
                                <span className="text-indigo-300 font-medium">{option.complexity}</span>
                            </div>
                        </div>

                        <div className="flex-1" />

                        {/* Action Button (The "Signature" Gradient) */}
                        <Button
                            size="lg"
                            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 group-hover:shadow-indigo-500/40"
                        >
                            <Sparkles className="mr-2 h-4 w-4" />
                            Launch Tool
                        </Button>

                    </div>
                </Card>
            </Link>
        </motion.div>
    )
}
