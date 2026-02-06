"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import type { CinematicOption } from "@/lib/creation-data-types"

interface StudioCardProps {
    option: CinematicOption
    index: number
    primary?: boolean
}

export function StudioCard({ option, index, primary = false }: StudioCardProps) {
    return (
        <Link href={option.href} className="group block h-full outline-none">
            <Card className={cn(
                "h-full relative overflow-hidden transition-all duration-300 border",
                primary
                    ? "bg-slate-900 border-indigo-500/50 shadow-lg shadow-indigo-900/20 hover:shadow-indigo-500/40"
                    : "bg-slate-900 border-white/10 hover:border-white/30"
            )}>

                {/* Animated Gradient Background for Primary */}
                {primary && (
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-slate-900 opacity-100 group-hover:scale-105 transition-transform duration-700" />
                )}

                {/* Hover Highlight for Secondary */}
                {!primary && (
                    <div className={cn(
                        "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br",
                        option.gradient
                    )} />
                )}

                <div className="relative z-10 p-6 h-full flex flex-col">

                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                        <div className={cn(
                            "p-3 rounded-xl transition-colors duration-300",
                            primary ? "bg-indigo-600 text-white shadow-lg" : "bg-white/5 text-slate-300 group-hover:text-white group-hover:bg-white/10"
                        )}>
                            <option.icon className="w-6 h-6" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="mb-8">
                        <h3 className={cn(
                            "text-lg font-bold mb-2",
                            primary ? "text-white text-2xl" : "text-slate-200 group-hover:text-white"
                        )}>
                            {option.title}
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed font-medium">
                            {option.description}
                        </p>
                    </div>

                    <div className="flex-1" />

                    {/* Action */}
                    <div>
                        {primary ? (
                            <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md border border-indigo-400/20">
                                Start Now <Plus className="ml-2 w-4 h-4" />
                            </Button>
                        ) : (
                            <div className="flex items-center text-xs font-bold text-slate-500 group-hover:text-indigo-400 uppercase tracking-widest transition-colors">
                                Launch <ArrowRight className="ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </div>
                        )}
                    </div>

                </div>
            </Card>
        </Link>
    )
}
