"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Rocket, Zap } from "lucide-react"
import Link from "next/link"
import { useFeaturedCollections } from "@/hooks/use-collection"

// Vivid gradient combinations for slides
const VIVID_GRADIENTS = [
    {
        bg: "from-violet-500/20 via-fuchsia-500/15 to-cyan-500/20",
        accent: "from-violet-500 to-fuchsia-500",
        glow: "violet"
    },
    {
        bg: "from-cyan-500/20 via-blue-500/15 to-violet-500/20",
        accent: "from-cyan-400 to-blue-500",
        glow: "cyan"
    },
    {
        bg: "from-rose-500/20 via-pink-500/15 to-violet-500/20",
        accent: "from-rose-500 to-pink-500",
        glow: "rose"
    },
    {
        bg: "from-emerald-500/20 via-teal-500/15 to-cyan-500/20",
        accent: "from-emerald-400 to-teal-500",
        glow: "emerald"
    }
]

export function FullScreenHero() {
    const { collections, loading } = useFeaturedCollections([1, 2, 4]);
    const [currentSlide, setCurrentSlide] = React.useState(0)

    // Only show real collections, no fallback mockups
    const slides = collections.length > 0 ? collections.map((col, idx) => ({
        id: col.id,
        title: col.name,
        description: col.description || "Discover this amazing collection on Medialane.",
        category: col.type || "Collection",
        image: col.image,
        gradient: VIVID_GRADIENTS[idx % VIVID_GRADIENTS.length],
        href: `/collections/${col.nftAddress || col.id}`
    })) : []

    const nextSlide = React.useCallback(() => {
        if (slides.length > 1) {
            setCurrentSlide((prev) => (prev + 1) % slides.length)
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

    // Loading state - clean glassmorphism design
    if (loading || slides.length === 0) {
        return (
            <div className="relative w-full h-[100svh] overflow-hidden">
                {/* Vivid Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/30 via-fuchsia-500/20 to-cyan-500/30" />

                {/* Animated Gradient Orbs */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        animate={{
                            x: [0, 100, 0],
                            y: [0, -50, 0],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-radial from-violet-500/40 to-transparent rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{
                            x: [0, -80, 0],
                            y: [0, 80, 0],
                            scale: [1, 1.3, 1]
                        }}
                        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-radial from-cyan-500/40 to-transparent rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{
                            x: [0, 60, 0],
                            y: [0, 60, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-1/3 right-1/3 w-1/3 h-1/3 bg-gradient-radial from-fuchsia-500/30 to-transparent rounded-full blur-3xl"
                    />
                </div>

                {/* Content */}
                <div className="relative z-10 container mx-auto h-full flex flex-col justify-center items-center px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl"
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
                            <Sparkles className="w-4 h-4 text-violet-400" />
                            <span className="text-sm font-medium text-foreground/90">The Integrity Web</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-[1.05]">
                            <span className="text-foreground">Create, Trade,</span>
                            <br />
                            <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">
                                Remix & Monetize
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light mb-10 leading-relaxed">
                            The decentralized platform for intellectual property.
                            Tokenize, license, and trade your creations on Starknet.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            <Button size="lg" className="rounded-full px-8 h-14 text-lg gradient-vivid-primary" asChild>
                                <Link href="/create">
                                    <Rocket className="w-5 h-5 mr-2" /> Start Creating
                                </Link>
                            </Button>

                            <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg glass hover:bg-white/20 border-white/20" asChild>
                                <Link href="/collections">
                                    Explore <ArrowRight className="w-5 h-5 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        )
    }

    return (
        <div className="relative w-full h-[100svh] overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeSlide.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute inset-0 z-0"
                >
                    {/* Background Image with Vivid Treatment */}
                    <div
                        className="absolute inset-0 bg-cover bg-center scale-105"
                        style={{ backgroundImage: `url(${activeSlide.image})` }}
                    />

                    {/* Vivid Gradient Overlay - NO dark overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${activeSlide.gradient.bg}`} />

                    {/* Subtle Edge Gradients for Readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                </motion.div>
            </AnimatePresence>

            {/* Floating Glow Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        x: [0, 50, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className={`absolute -top-20 -left-20 w-96 h-96 bg-${activeSlide.gradient.glow}-500/20 rounded-full blur-3xl`}
                />
                <motion.div
                    animate={{
                        y: [0, -30, 0],
                        scale: [1, 1.15, 1]
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-20 -right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
                />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto h-full flex flex-col justify-center px-6 md:px-12 pt-20">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`content-${activeSlide.id}`}
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="max-w-4xl"
                    >
                        {/* Category Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
                            <Zap className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm font-medium text-foreground/90">{activeSlide.category}</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-[1.05] text-foreground drop-shadow-sm">
                            {activeSlide.title}
                        </h1>

                        <p className="text-xl md:text-2xl text-foreground/80 max-w-2xl font-light mb-10 leading-relaxed line-clamp-3 drop-shadow-sm">
                            {activeSlide.description}
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Button size="lg" className="rounded-full px-8 h-14 text-lg gradient-vivid-accent" asChild>
                                <Link href={activeSlide.href}>
                                    <Sparkles className="w-5 h-5 mr-2" /> Explore Collection
                                </Link>
                            </Button>

                            <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg glass hover:bg-white/20 border-white/20" asChild>
                                <Link href="/collections">
                                    View All <ArrowRight className="w-5 h-5 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Dots */}
            {slides.length > 1 && (
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                    {slides.map((slide, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`relative h-2 rounded-full transition-all duration-500 ${index === currentSlide
                                ? `w-12 bg-gradient-to-r ${slide.gradient.accent}`
                                : "w-2 bg-white/30 hover:bg-white/50"
                                }`}
                        >
                            <span className="sr-only">Go to slide {index + 1}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* Slider Navigation Arrows */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={() => setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1))}
                        className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full glass hover:bg-white/20 transition-all hover:scale-110"
                    >
                        <ArrowRight className="w-6 h-6 rotate-180 text-foreground" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-6 md:right-8 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full glass hover:bg-white/20 transition-all hover:scale-110"
                    >
                        <ArrowRight className="w-6 h-6 text-foreground" />
                    </button>
                </>
            )}
        </div>
    )
}
