
"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"

export function MarketplaceHero() {
    return (
        <div className="relative overflow-hidden border-b border-white/5 bg-gradient-to-b from-background to-black/40 pt-24 pb-12 lg:pt-32 lg:pb-20">
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/10 blur-[120px] rounded-full opacity-50" />
                <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-blue-500/10 blur-[100px] rounded-full opacity-30" />
            </div>

            <div className="container relative z-10 mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    <div className="flex-1 space-y-6 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-primary-foreground/80"
                        >
                            <Sparkles className="w-4 h-4 text-yellow-400" />
                            <span>Discover the Integrity Web</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/60"
                        >
                            The Marketplace for <br />
                            <span className="text-primary">Programmable IP</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0"
                        >
                            Buy, sell, and license intellectual property with verified ownership and programmable rights on Starknet.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
                        >
                            <Button size="lg" className="rounded-full shadow-lg shadow-primary/20">
                                Explore Assets
                            </Button>
                            <Button variant="outline" size="lg" className="rounded-full backdrop-blur-sm bg-white/5 border-white/10 hover:bg-white/10">
                                Start Selling <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </motion.div>
                    </div>

                    <div className="flex-1 w-full max-w-lg lg:max-w-none">
                        {/* 3D-like floating cards visualization */}
                        <div className="relative aspect-square md:aspect-[4/3] lg:aspect-square">
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[380px] rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/10 shadow-2xl z-20 flex flex-col overflow-hidden"
                            >
                                <div className="h-2/3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 relative group">
                                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-xs font-bold border border-white/5">
                                        #1337
                                    </div>
                                </div>
                                <div className="flex-1 p-4 space-y-3 relative">
                                    <div className="w-12 h-12 absolute -top-6 left-4 rounded-xl border-2 border-black bg-gray-800" />
                                    <div className="mt-4">
                                        <div className="h-4 w-3/4 bg-white/10 rounded mb-2" />
                                        <div className="h-3 w-1/2 bg-white/5 rounded" />
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div className="h-6 w-20 bg-primary/20 rounded-full" />
                                        <div className="h-4 w-16 bg-white/10 rounded" />
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, -30, 0], rotate: [-6, -12, -6] }}
                                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[240px] h-[320px] rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-white/5 shadow-xl z-10 opacity-70"
                            />

                            <motion.div
                                animate={{ y: [0, -25, 0], rotate: [6, 12, 6] }}
                                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[240px] h-[320px] rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-white/5 shadow-xl z-10 opacity-70"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
