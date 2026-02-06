"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, X, SlidersHorizontal } from "lucide-react"

interface HubActionsProps {
    searchQuery: string
    setSearchQuery: (query: string) => void
    activeFilter: string
    setActiveFilter: (filter: string) => void
}

const filters = [
    { id: "all", label: "All Tools" },
    { id: "core", label: "Core" },
    { id: "advanced", label: "Advanced" },
]

export function HubActions({ searchQuery, setSearchQuery, activeFilter, setActiveFilter }: HubActionsProps) {
    return (
        <div className="flex flex-col md:flex-row items-center gap-4 mb-10 p-2">
            {/* Search Input (Dark Slate Style) */}
            <div className="relative flex-1 w-full group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <Input
                    className="h-12 pl-11 bg-slate-900/50 border-slate-700/50 hover:bg-slate-800/50 focus:bg-slate-800 focus:border-blue-500/50 text-slate-200 rounded-xl transition-all placeholder:text-slate-600"
                    placeholder="Search creation tools..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery("")}
                        className="absolute inset-y-0 right-4 flex items-center text-slate-600 hover:text-slate-300 transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Filter Chips (Slate Style) */}
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                {filters.map(filter => (
                    <Button
                        key={filter.id}
                        variant="ghost"
                        onClick={() => setActiveFilter(filter.id)}
                        className={`h-11 px-5 rounded-xl text-sm font-medium transition-all border ${activeFilter === filter.id
                                ? "bg-slate-800 border-indigo-500/30 text-indigo-400 shadow-lg shadow-indigo-900/20"
                                : "bg-transparent border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
                            }`}
                    >
                        {filter.label}
                    </Button>
                ))}
            </div>
        </div>
    )
}
