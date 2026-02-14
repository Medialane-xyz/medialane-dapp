"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Rocket, Layers } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useFeaturedCollections } from "@/hooks/use-collection"

export function FullScreenHero() {
    const { collections, loading } = useFeaturedCollections([1, 2, 4]);
    const [currentSlide, setCurrentSlide] = React.useState(0)

    const slides = collections.length > 0 ? collections.map((col) => ({
        id: col.id,
        title: col.name,
        description: col.description || "",
        category: col.type || "IP",
        image: col.image,
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

    // Loading/Default state - Minimal
    if (loading || slides.length === 0) {
        return (
            <div className="relative w-full h-[100svh] overflow-hidden bg-background">
                <div className="relative z-10 container mx-auto h-full flex flex-col justify-center items-center px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 text-foreground bg-muted/50 rounded-full text-sm font-semibold mb-6">
                            Feature Collections
                        </div>

                        <h1 className="text-5xl font-bold tracking-tight mb-8 text-foreground">
                            Loading...
                        </h1>

                        <div className="flex flex-wrap justify-center gap-4">
                            <Button size="lg" className="rounded-full" disabled>
                                <Rocket className="w-5 h-5 mr-2" /> Create
                            </Button>
                            <Button size="lg" variant="outline" className="rounded-full" disabled>
                                Explore <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        )
    }

    return (
        <div className="relative w-full h-[100svh] overflow-hidden bg-black">
            {/* Full Screen Image */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeSlide.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2 }}
                    className="absolute inset-0"
                >
                    <div className="absolute inset-0 bg-black/40 z-10" />
                    <Image
                        src={activeSlide.image}
                        alt={activeSlide.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </motion.div>
            </AnimatePresence>

            {/* Content */}
            <div className="relative z-20 container mx-auto h-full flex flex-col justify-center items-center px-6 text-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`content-${activeSlide.id}`}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-4xl"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 text-white bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-sm font-medium mb-6">
                            {activeSlide.category}
                        </div>

                        <Link href={activeSlide.href}>
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 text-white">
                                {activeSlide.title}
                            </h1>
                        </Link>

                        <div className="flex gap-4 justify-center">
                            <Button size="lg" className="rounded-full bg-white text-black hover:bg-white/90" asChild>
                                <Link href={activeSlide.href}>
                                    <Layers className="w-5 h-5 mr-2" /> Open
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Dots */}
            {slides.length > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`rounded-full transition-all duration-300 ${index === currentSlide
                                ? "w-8 h-2 bg-white"
                                : "w-2 h-2 bg-white/40 hover:bg-white/60"
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
