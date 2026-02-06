"use client"

import { creationOptions } from "@/lib/creation-data"
import { cn } from "@/lib/utils"
import type { CinematicOption } from "@/lib/creation-data-types"

interface ToolSidebarProps {
    activeId: string
    onSelect: (option: CinematicOption) => void
}

export function ToolSidebar({ activeId, onSelect }: ToolSidebarProps) {
    return (
        <div className="h-full bg-slate-950 border-l border-white/5 p-6 flex flex-col">

            <div className="mb-8 pl-4">
                <h1 className="text-xl font-bold tracking-tighter text-white">
                    STUDIO<span className="text-blue-500">.</span>
                </h1>
                <p className="text-xs text-slate-500">v1.1.0 Command</p>
            </div>

            <div className="space-y-2 flex-1">
                {creationOptions.map((option) => {
                    const isActive = activeId === option.id
                    return (
                        <button
                            key={option.id}
                            onClick={() => onSelect(option)}
                            className={cn(
                                "w-full text-left p-4 rounded-xl transition-all duration-300 group relative overflow-hidden",
                                isActive ? "bg-white/5" : "hover:bg-white/5"
                            )}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full" />
                            )}

                            <div className="flex items-center gap-4 relative z-10">
                                <option.icon className={cn(
                                    "w-5 h-5 transition-colors",
                                    isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"
                                )} />

                                <div>
                                    <div className={cn(
                                        "font-semibold text-sm transition-colors",
                                        isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                                    )}>
                                        {option.title}
                                    </div>
                                </div>
                            </div>
                        </button>
                    )
                })}
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-white/5 text-xs text-slate-500">
                <p>Logged in as Creator level.</p>
                <p className="mt-1">System Operational.</p>
            </div>

        </div>
    )
}
