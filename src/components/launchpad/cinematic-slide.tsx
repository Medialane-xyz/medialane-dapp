"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Wallet, Layers } from "lucide-react"
import Link from "next/link"
import { useAccount } from "@starknet-react/core"
import { usePortfolio } from "@/hooks/use-portfolio"
import type { CinematicOption } from "@/lib/creation-data-types"

interface CinematicSlideProps {
    option: CinematicOption
    index: number
}

export function CinematicSlide({ option, index }: CinematicSlideProps) {
    const { address } = useAccount()
    const { stats, loading } = usePortfolio()

    // Contextual Data Hook
    const getContext = () => {
        if (loading || !address) return null
        if (option.id === "asset") return { label: "My Assets", value: stats.totalNFTs }
        if (option.id === "collection") return { label: "My Collections", value: stats.topCollection ? "Active" : 0 }
        return null
    }

    const context = getContext()

    return (
        <section className="h-[calc(100vh-80px)] w-full snap-center relative flex items-center justify-center overflow-hidden border-b border-white/5 bg-slate-950">

            {/* 1. Atmospheric Background */}
            <div className={`absolute inset-0 bg-gradient-to-br opacity-20 blur-[120px] ${option.gradient}`} />

            {/* 2. Content Container */}
            <div className="relative z-10 container mx-auto px-6 max-w-4xl text-center flex flex-col items-center">

                {/* Icon Badge */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-24 h-24 mb-8 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xl shadow-2xl"
                >
                    <option.icon className="w-10 h-10 text-white" />
                </motion.div>

                {/* Typography */}
                <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-tight"
                >
                    {option.title}
                </motion.h2>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-lg md:text-xl text-slate-300 md:text-slate-400 max-w-2xl mb-10 leading-relaxed font-medium"
                >
                    {option.description}
                </motion.p>

                {/* Action & Data */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="flex flex-col items-center gap-6"
                >
                    {/* Primary Action */}
                    <Link href={option.href} className="w-full md:w-auto">
                        <Button className="w-full md:w-auto h-16 px-10 text-lg rounded-full bg-white text-black hover:bg-slate-200 transition-all hover:scale-105 font-bold shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                            Launch Tool <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>

                    {/* Real Data HUD */}
                    {context && (
                        <div className="flex items-center gap-2 text-sm font-mono text-slate-400 bg-black/40 px-4 py-2 rounded-full backdrop-blur-md border border-white/5">
                            <Layers className="w-4 h-4 text-emerald-500" />
                            <span>{context.label}:</span>
                            <span className="text-white font-bold">{context.value}</span>
                        </div>
                    )}
                </motion.div>

            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-bounce">
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/60">Scroll</span>
                <div className="w-px h-8 bg-gradient-to-b from-white to-transparent" />
            </div>

        </section>
    )
}
