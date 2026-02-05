"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import Link from "next/link"
import { useFeaturedCollections } from "@/hooks/use-collection"

// Fallback slides for loading or error states
const FALLBACK_SLIDES = [
    {
        id: 1,
        title: "Loading Media...",
        description: "Connecting to the Integrity Web.",
        category: "System",
        image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=2940&auto=format&fit=crop",
        gradient: "from-blue-900/80 to-purple-900/80"
    }
]

// Deterministic gradients based on index
const GRADIENTS = [
    "from-blue-900/80 to-purple-900/80",
    "from-fuchsia-900/80 to-indigo-900/80",
    "from-amber-900/80 to-red-900/80",
    "from-emerald-900/80 to-teal-900/80"
]

export function FullScreenHero() {
    // Fetch featured collections (IDs 1, 2, 4 as per original FeaturedHero)
    const { collections, loading } = useFeaturedCollections([1, 2, 4]);

    const [currentSlide, setCurrentSlide] = React.useState(0)

    // Use collections if available, otherwise fallback
    const slides = collections.length > 0 ? collections.map((col, idx) => ({
        id: col.id,
        title: col.name,
        description: col.description || "Discover this amazing collection on Medialane.",
        category: col.type || "Mixed Media",
        image: col.image || FALLBACK_SLIDES[0].image,
        gradient: GRADIENTS[idx % GRADIENTS.length],
        href: `/collections/${col.nftAddress || col.id}`
    })) : FALLBACK_SLIDES

    const nextSlide = React.useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, [slides.length])

    React.useEffect(() => {
        if (slides.length <= 1) return
        const timer = setInterval(nextSlide, 6000)
        return () => clearInterval(timer)
    }, [nextSlide, slides.length])

    // If loading effectively, we show fallback, but let's automate transition once loaded
    React.useEffect(() => {
        if (!loading && collections.length > 0) {
            setCurrentSlide(0)
        }
    }, [loading, collections.length])

    const activeSlide = slides[currentSlide]

    return (
        <div className="relative w-full h-[100svh] overflow-hidden bg-black text-white">
            <AnimatePresence mode="wait">
                <motion.div
                    key={loading ? 'loading' : activeSlide.id}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-0 z-0"
                >
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${activeSlide.image})` }}
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-black/40" />
                    <div className={`absolute inset-0 bg-gradient-to-t ${activeSlide.gradient} opacity-60 mix-blend-multiply`} />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90" />
                </motion.div>
            </AnimatePresence>

            {/* Content */}
            <div className="relative z-10 container mx-auto h-full flex flex-col justify-center px-6 md:px-12 pt-20">
                <motion.div
                    key={`content-${activeSlide.id}`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="max-w-4xl"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium text-white/90 mb-6">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        {activeSlide.category}
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-[1.1] line-clamp-2">
                        {activeSlide.title}
                    </h1>

                    <p className="text-xl md:text-2xl text-white/80 max-w-2xl font-light mb-10 leading-relaxed line-clamp-3">
                        {activeSlide.description}
                    </p>

                    <div className="flex flex-wrap gap-4">
                        {activeSlide.href ? (
                            <Button size="lg" className="rounded-full px-8 h-14 text-lg bg-primary hover:bg-primary/90 text-primary-foreground border-none" asChild>
                                <Link href={activeSlide.href}>
                                    <Play className="w-5 h-5 mr-2 fill-current" /> Explore Collection
                                </Link>
                            </Button>
                        ) : (
                            <Button size="lg" className="rounded-full px-8 h-14 text-lg bg-primary hover:bg-primary/90 text-primary-foreground border-none" disabled>
                                Loading...
                            </Button>
                        )}

                        <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg border-white/20 bg-white/5 hover:bg-white/20 backdrop-blur-md text-white" asChild>
                            <Link href="/collections">
                                View All <ArrowRight className="w-5 h-5 ml-2" />
                            </Link>
                        </Button>
                    </div>
                </motion.div>
            </div>

            {/* Navigation Dots */}
            {slides.length > 1 && (
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-4">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`group relative h-1.5 rounded-full transition-all duration-300 ${index === currentSlide ? "w-12 bg-white" : "w-4 bg-white/30 hover:bg-white/50"}`}
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
                        className="absolute left-8 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-black/20 hover:bg-white/10 backdrop-blur-md text-white transition-all opacity-0 md:opacity-100 hover:scale-110"
                    >
                        <ArrowRight className="w-6 h-6 rotate-180" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-8 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-black/20 hover:bg-white/10 backdrop-blur-md text-white transition-all opacity-0 md:opacity-100 hover:scale-110"
                    >
                        <ArrowRight className="w-6 h-6" />
                    </button>
                </>
            )}

        </div>
    )
}
