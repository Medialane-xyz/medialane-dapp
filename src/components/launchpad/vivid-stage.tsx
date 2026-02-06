"use client"

import { motion, AnimatePresence } from "framer-motion"
import { usePortfolio } from "@/hooks/use-portfolio"
import { Button } from "@/components/ui/button"
import { ArrowRight, Wallet, Loader2 } from "lucide-react"
import Link from "next/link"
import { useAccount } from "@starknet-react/core"
import type { CinematicOption } from "@/lib/creation-data-types"

interface VividStageProps {
    activeOption: CinematicOption
}

export function VividStage({ activeOption }: VividStageProps) {
    const { stats, loading } = usePortfolio()
    const { address } = useAccount()

    // Dynamic Content based on selection
    const getContextStats = () => {
        if (loading) return null
        if (!address) return { label: "Wallet Status", value: "Not Connected" }

        switch (activeOption.id) {
            case "asset":
                return { label: "Your Total Assets", value: stats.totalNFTs.toString() }
            case "collection":
                return { label: "Your Collections", value: stats.topCollection ? "Active" : "None" } // Simplified for now
            case "remix":
                return { label: "Remixable Assets", value: "Global Database" }
            default:
                return { label: "Available Templates", value: "12" }
        }
    }

    const contextStat = getContextStats()

    return (
        <div className="relative w-full h-full overflow-hidden bg-black flex flex-col justify-center p-8 md:p-16">

            {/* Background Morphing Gradient */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeOption.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className={`absolute inset-0 bg-gradient-to-br opacity-20 blur-[100px] ${activeOption.gradient}`}
                />
            </AnimatePresence>

            {/* Content Layer */}
            <div className="relative z-10 max-w-2xl">

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeOption.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                    >
                        {/* Large Icon */}
                        <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 backdrop-blur-md">
                            <activeOption.icon className="w-10 h-10 text-white" />
                        </div>

                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
                            {activeOption.title}
                        </h2>

                        <p className="text-lg text-slate-400 mb-10 leading-relaxed max-w-xl">
                            {activeOption.description}
                        </p>

                        {/* Real Data Context Badge */}
                        {contextStat && (
                            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-10">
                                {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                                ) : !address ? (
                                    <Wallet className="w-4 h-4 text-slate-400" />
                                ) : (
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                )}
                                <span className="text-sm font-medium text-slate-300">
                                    {contextStat.label}: <span className="text-white ml-1">{contextStat.value}</span>
                                </span>
                            </div>
                        )}

                        {/* Main Action */}
                        <div>
                            <Link href={activeOption.href}>
                                <Button size="lg" className="h-14 px-8 text-base bg-white text-black hover:bg-slate-200 transition-colors border-0 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                                    Launch Interface <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </AnimatePresence>

            </div>
        </div>
    )
}
