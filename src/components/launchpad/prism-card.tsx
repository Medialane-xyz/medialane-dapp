"use client"

import React, { useRef, useState } from "react"
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

interface PrismCardProps {
    title: string
    subtitle: string
    icon: React.ElementType
    href: string
    gradient: string
    colSpan?: string
    rowSpan?: string
    delay?: number
}

export function PrismCard({
    title,
    subtitle,
    icon: Icon,
    href,
    gradient,
    colSpan = "col-span-1",
    rowSpan = "row-span-1",
    delay = 0
}: PrismCardProps) {
    const ref = useRef<HTMLDivElement>(null)

    const x = useMotionValue(0)
    const y = useMotionValue(0)

    // Mouse tilt logic
    const mouseX = useSpring(0, { stiffness: 500, damping: 100 })
    const mouseY = useSpring(0, { stiffness: 500, damping: 100 })

    function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect()
        const xPct = mouseX.set((clientX - left) / width - 0.5)
        const yPct = mouseY.set((clientY - top) / height - 0.5)

        x.set(clientX - left)
        y.set(clientY - top)
    }

    function onMouseLeave() {
        mouseX.set(0)
        mouseY.set(0)
        x.set(0)
        y.set(0)
    }

    const rotateX = useSpring(useMotionValue(0), { stiffness: 500, damping: 100 })
    const rotateY = useSpring(useMotionValue(0), { stiffness: 500, damping: 100 })

    // Link tilt to mouse position
    // We want: mouse top -> rotateX positive
    // mouse right -> rotateY negative
    // Adjust multipliers for intensity
    // Note: Framer motion useTransform logic would be cleaner but direct spring mapping works well for this localized effect

    // Dynamic style for the spotlight
    const maskImage = useMotionTemplate`radial-gradient(240px at ${x}px ${y}px, white, transparent)`

    // 3D transform string
    // transform: perspective(1000px) rotateX(var(--rX)) rotateY(var(--rY)) scale(1.02);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay }}
            className={cn("relative group perspective-1000", colSpan, rowSpan)}
        >
            <Link href={href} className="block h-full w-full outline-none">
                <motion.div
                    ref={ref}
                    onMouseMove={onMouseMove}
                    onMouseLeave={onMouseLeave}
                    style={{
                        transformStyle: "preserve-3d",
                        rotateX: mouseY, // Mapped loosely
                        rotateY: mouseX, // Mapped loosely
                    }}
                    className="relative h-full w-full rounded-3xl bg-black/40 border border-white/10 overflow-hidden transition-all duration-200 group-hover:border-white/30 group-focus:ring-2 ring-primary/50"
                >
                    {/* Vivid Background Mesh (The "Holo" part) */}
                    <div className={cn(
                        "absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500",
                        gradient // e.g. bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500
                    )} />

                    {/* Spotlight Effect */}
                    <motion.div
                        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100 z-10"
                        style={{ maskImage, background: "rgba(255, 255, 255, 0.1)" }}
                    />

                    {/* Content Layer */}
                    <div className="relative z-20 p-6 flex flex-col h-full justify-between transform translate-z-10">
                        <div className="flex justify-between items-start">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white shadow-lg border border-white/20 group-hover:scale-110 transition-transform duration-300">
                                <Icon className="w-6 h-6" />
                            </div>
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                                <ArrowUpRight className="w-4 h-4 text-white" />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/80">
                                {title}
                            </h3>
                            <p className="text-white/60 font-medium text-sm">
                                {subtitle}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </Link>
        </motion.div>
    )
}
