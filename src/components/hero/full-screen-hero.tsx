"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Rocket, Layers } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useFeaturedCollections } from "@/hooks/use-collection"

// Vivid accent colors for navigation dots
const ACCENT_COLORS = [
    { accent: "from-violet-500 to-fuchsia-500" },
    { accent: "from-cyan-400 to-blue-500" },
    { accent: "from-rose-500 to-pink-500" },
    { accent: "from-emerald-400 to-teal-500" }
]

export function FullScreenHero() {
    const { collections, loading } = useFeaturedCollections([1, 2, 4]);
    const [currentSlide, setCurrentSlide] = React.useState(0)

    const slides = collections.length > 0 ? collections.map((col, idx) => ({
        id: col.id,
        title: col.name,
        description: col.description || "",
        category: col.type || "IP",
        image: col.image,
        colors: ACCENT_COLORS[idx % ACCENT_COLORS.length],
        href: `/collections/${col.nftAddress || col.id}`
    })) : []

    const nextSlide = React.useCallback(() => {
        if (slides.length > 1) {
            setCurrentSlide((prev) => (prev + 1) % slides.length)
        }
    }, [slides.length])

    const prevSlide = React.useCallback(() => {
        if (slides.length > 1) {
            setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
        }
    }, [slides.length])

    React.useEffect(() => {
        if (slides.length <= 1) return
        const timer = setInterval(nextSlide, 7000)
        return () => clearInterval(timer)
    }, [nextSlide, slides.length])

    React.useEffect(() => {
        if (!loading && collections.length > 0) {
            setCurrentSlide(0)
        }
    }, [loading, collections.length])

    const activeSlide = slides[currentSlide]

    // Loading/Default state - matching slider style
    if (loading || slides.length === 0) {
        return (
            <div className="relative w-full h-[100svh] overflow-hidden">
                {/* Animated Gradient Orbs */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-radial from-violet-500/40 to-transparent rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{ x: [0, -80, 0], y: [0, 80, 0], scale: [1, 1.3, 1] }}
                        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-radial from-cyan-500/40 to-transparent rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{ x: [0, 60, 0], y: [0, 60, 0], scale: [1, 1.1, 1] }}
                        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-1/3 right-1/3 w-1/3 h-1/3 bg-gradient-radial from-fuchsia-500/30 to-transparent rounded-full blur-3xl"
                    />
                </div>

                {/* Content - Centered like slider */}
                <div className="relative z-10 container mx-auto h-full flex flex-col justify-center items-center px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl"
                    >
                        {/* Badge - matching slider style */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 text-foreground backdrop-blur-sm rounded-full glass text-sm font-semibold mb-6 shadow-sm">
                            Feature Collections
                        </div>

                        {/* Title - matching slider shadow style */}
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.05] text-foreground">
                            Getting onchain...
                        </h1>

                        {/* Buttons - matching slider style */}
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button size="lg" className="rounded-full px-4 h-10 text-foreground glass backdrop-blur-sm hover:bg-white/20" asChild>
                                <Link href="/create">
                                    <Rocket className="w-5 h-5 mr-2" /> Create
                                </Link>
                            </Button>
                            <Button size="lg" className="rounded-full px-4 h-10 text-foreground glass backdrop-blur-sm hover:bg-white/20" asChild>
                                <Link href="/collections">
                                    Explore <ArrowRight className="w-5 h-5 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>

                {/* Subtle dots placeholder - matching slider position */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
                    <div className="w-8 h-2 rounded-full bg-foreground/20 animate-pulse" />
                    <div className="w-2 h-2 rounded-full bg-foreground/10" />
                    <div className="w-2 h-2 rounded-full bg-foreground/10" />
                </div>
            </div>
        )
    }

    return (
        <div className="relative w-full h-[100svh] overflow-hidden bg-black">
            {/* Full Screen Image - No overlay */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeSlide.id}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="absolute inset-0"
                >
                    <Image
                        src={activeSlide.image}
                        alt={activeSlide.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </motion.div>
            </AnimatePresence>

            {/* Content - Centered */}
            <div className="relative z-10 container mx-auto h-full flex flex-col justify-center items-center px-6 text-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`content-${activeSlide.id}`}
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="max-w-4xl"
                    >
                        {/* Category Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 text-white backdrop-blur-sm rounded-full glass text-sm font-semibold mb-6 shadow-sm">
                            {activeSlide.category}
                        </div>

                        {/* Title - Strong shadow for readability without overlay */}
                        <Link href={activeSlide.href}>
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.05] text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.3)] [text-shadow:0_2px_10px_rgba(0,0,0,0.3),0_4px_25px_rgba(0,0,0,0.3)]">
                                {activeSlide.title}
                            </h1>
                        </Link>

                        {/* Action Button */}
                        <Button size="lg" className="rounded-full px-4 h-10 text-white glass backdrop-blur-sm hover:bg-white/20" asChild>
                            <Link href={activeSlide.href}>
                                <Layers className="w-5 h-5 mr-2" /> Open
                            </Link>
                        </Button>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation - Centered at bottom, subtle */}
            {slides.length > 1 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3"
                >
                    {slides.map((slide, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`rounded-full transition-all duration-500 ${index === currentSlide
                                ? `w-8 h-2 bg-white`
                                : "w-2 h-2 bg-white/40 hover:bg-white/60"
                                }`}
                        />
                    ))}
                </motion.div>
            )}
        </div>
    )
}
