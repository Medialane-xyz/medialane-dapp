"use client"

import { Button } from "@/components/ui/button"
import {
    Plus,
    Lightbulb,
    Settings,
    LayoutGrid,
    Zap
} from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export function CreativeDock() {
    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-2 p-2 rounded-2xl bg-black/80 backdrop-blur-2xl border border-white/10 shadow-2xl ring-1 ring-white/5">

                <DockItem icon={LayoutGrid} label="Dashboard" active />
                <div className="w-[1px] h-8 bg-white/10 mx-1" />

                <DockItem icon={Lightbulb} label="Inspire Me" />
                <DockItem icon={Zap} label="Quick Mint" />

                <div className="w-[1px] h-8 bg-white/10 mx-1" />
                <DockItem icon={Settings} label="Settings" />

                <button className="ml-2 w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white shadow-lg hover:shadow-pink-500/50 hover:-translate-y-1 transition-all">
                    <Plus className="w-6 h-6" />
                </button>
            </div>
        </div>
    )
}

function DockItem({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
    return (
        <TooltipProvider delayDuration={0}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 ${active ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'}`}>
                        <Icon className="w-5 h-5" />
                    </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-black/90 border-white/10 text-white text-xs">
                    {label}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
