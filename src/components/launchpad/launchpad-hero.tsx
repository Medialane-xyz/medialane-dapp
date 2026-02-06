"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export function LaunchpadHero() {
    return (
        <div className="relative overflow-hidden rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl mb-12">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="relative z-10 px-8 py-20 md:py-28 text-center max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-blue-200 mb-6 backdrop-blur-md">
                        <Sparkles className="w-4 h-4 text-blue-400" />
                        <span>New Revenue Streams Live</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white via-white/90 to-white/50">
                        The Future of IP is <br className="hidden md:block" />
                        <span className="text-blue-400">Programmable</span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                        Transform your creative work into liquid, programmable assets.
                        Unlock automated royalties, instant licensing, and global reach on the Starknet blockchain.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="#create-options">
                            <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-white text-black hover:bg-white/90 shadow-lg shadow-white/10 group">
                                Start Creating
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link href="/docs/programmable-ip">
                            <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-white/10 hover:bg-white/5 backdrop-blur-md">
                                Learn More
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
