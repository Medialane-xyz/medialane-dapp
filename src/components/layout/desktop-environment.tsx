"use client"

import * as React from "react"
import { Dock } from "@/components/layout/dock"

export function DesktopEnvironment({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen w-full relative overflow-x-hidden text-foreground selection:bg-primary/30">

            {/* Animated Mesh Background - Fixed Layer */}
            <div className="fixed inset-0 z-[-1]">
                <div className="absolute inset-0 bg-background" />
                <div className="absolute inset-0 bg-mesh opacity-40 animate-pulse-slow" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] animate-grain" />
            </div>

            {/* Main Workspace Content */}
            <main className="relative z-10 w-full min-h-screen pb-32 pt-6 px-4 md:px-8 max-w-[1920px] mx-auto">
                {children}
            </main>

            {/* OS Interface Elements */}
            <Dock />

            {/* Vignette Overlay */}
            <div className="fixed inset-0 pointer-events-none z-40 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

        </div>
    )
}
