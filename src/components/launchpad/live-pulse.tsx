"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Music, Image as ImageIcon, Box } from "lucide-react"

const activities = [
    { icon: Music, text: "kalamaha.stark minted Audio #8822" },
    { icon: ImageIcon, text: "pixel_art.eth created a new Collection" },
    { icon: Box, text: "0x44...2a minted 3D Asset" },
    { icon: Sparkles, text: "Remix detected on 'Sunset Vibez'" },
]

export function LivePulse() {
    const [index, setIndex] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % activities.length)
        }, 3000)
        return () => clearInterval(timer)
    }, [])

    const CurrentIcon = activities[index].icon

    return (
        <div className="h-10 bg-black/60 backdrop-blur-xl border border-white/5 rounded-full px-4 flex items-center gap-3 overflow-hidden w-fit shadow-2xl">
            <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Live</span>
            </div>

            <div className="h-4 w-[1px] bg-white/10" />

            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 text-xs font-medium text-white/80 whitespace-nowrap"
                >
                    <CurrentIcon className="w-3 h-3 text-primary" />
                    {activities[index].text}
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
