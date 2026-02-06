"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { motion } from "framer-motion"
import type { CinematicOption } from "@/lib/creation-data"

interface WorkstationCardProps {
    option: CinematicOption
    index: number
}

export function WorkstationCard({ option, index }: WorkstationCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="h-full"
        >
            <Link href={option.href} className="block h-full outline-none group">
                <Card className="h-full relative overflow-hidden bg-slate-900 border-white/5 hover:border-indigo-500/30 transition-all duration-300 shadow-lg hover:shadow-indigo-500/10">

                    {/* Subtle Gradient Backsplash */}
                    <div className={cn(
                        "absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-br opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 blur-3xl",
                        option.gradient
                    )} />

                    <div className="p-8 h-full flex flex-col">

                        {/* Header */}
                        <div className="flex justify-between items-start mb-6">
                            <div className={cn(
                                "w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 border border-white/5",
                                "bg-gradient-to-br from-slate-800 to-slate-900 shadow-inner"
                            )}>
                                <option.icon className="w-7 h-7 text-white/90" />
                            </div>

                            {option.popular && (
                                <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-300 border-indigo-500/20">Popular</Badge>
                            )}
                        </div>

                        {/* Content */}
                        <div className="space-y-3 mb-8">
                            <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-indigo-400 transition-colors">
                                {option.title}
                            </h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                {option.description}
                            </p>
                        </div>

                        <div className="flex-1" />

                        {/* Action Footer */}
                        <div className="flex items-center gap-2 text-sm font-semibold text-white/40 group-hover:text-white transition-colors">
                            <span>Open Tool</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </div>

                    </div>
                </Card>
            </Link>
        </motion.div>
    )
}
