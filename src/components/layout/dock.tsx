"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Home,
    Search,
    Map,
    Users,
    Settings,
    Terminal,
    PlusCircle,
    LayoutGrid
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Dock() {
    const pathname = usePathname()

    const dockItems = [
        { name: "Home", icon: Home, href: "/" },
        { name: "Marketplace", icon: Map, href: "/marketplace" },
        { name: "Launchpad", icon: RocketIcon, href: "/create" },
        { name: "Collections", icon: LayoutGrid, href: "/collections" },
        { name: "Alliance", icon: Users, href: "/alliance" },
    ]

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl shadow-black/50 overflow-hidden">
                {dockItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link key={item.name} href={item.href}>
                            <motion.div
                                whileHover={{ scale: 1.1, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                className={cn(
                                    "relative group flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300",
                                    isActive ? "bg-white/20 border-white/30 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
                                )}
                            >
                                <item.icon className="w-6 h-6" />

                                {/* Tooltip */}
                                <span className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-xs px-2 py-1 rounded backdrop-blur-md pointer-events-none whitespace-nowrap border border-white/10">
                                    {item.name}
                                </span>

                                {/* Active Indicator */}
                                {isActive && (
                                    <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary shadow-[0_0_8px_2px_rgba(0,255,255,0.6)]" />
                                )}
                            </motion.div>
                        </Link>
                    )
                })}

                <div className="w-px h-8 bg-white/10 mx-2" />

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => document.dispatchEvent(new CustomEvent("openCommandMenu"))}
                    className="w-12 h-12 rounded-xl text-white/70 hover:bg-white/10 hover:text-white hover:scale-110 transition-all"
                >
                    <div className="sr-only">Command Menu</div>
                    <Terminal className="w-5 h-5" />
                </Button>
            </div>
        </div>
    )
}

function RocketIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
        </svg>
    )
}
