
"use client"

import { useState } from "react"
import { FilterSidebar } from "@/components/marketplace/filter-sidebar"
import { AssetGrid } from "@/components/marketplace/asset-grid"
import { Search, SlidersHorizontal, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function MarketplacePage() {
    // Remove unused state since we use Sheet for filters now
    const [sortOrder, setSortOrder] = useState<"recent" | "oldest">("recent")

    return (
        <div className="min-h-screen bg-background pt-24 pb-8">
            <main className="container mx-auto px-4 max-w-[1600px]">
                <div className="flex-1 min-w-0 space-y-6">
                    {/* Toolbar */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-background/60 p-4 rounded-xl border border-white/5 backdrop-blur-xl transition-all duration-200">
                        {/* Filter Toggle (Drawer) */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="w-full sm:w-auto gap-2 border-white/10 hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-colors">
                                    <Filter className="h-4 w-4" />
                                    Filters
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-black/95 border-r border-white/10 backdrop-blur-2xl">
                                <div className="py-6">
                                    <h2 className="text-lg font-semibold mb-6 px-1">Marketplace Filters</h2>
                                    <FilterSidebar />
                                </div>
                            </SheetContent>
                        </Sheet>

                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search assets, collections, and creators..."
                                className="pl-10 bg-black/20 border-white/10 w-full focus:bg-black/40 transition-colors"
                            />
                        </div>

                        {/* Sort Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="hidden sm:flex shrink-0 gap-2 border-white/10 hover:bg-white/5 w-[180px] justify-between">
                                    <span className="flex items-center gap-2">
                                        <SlidersHorizontal className="h-4 w-4" />
                                        Sort by: {sortOrder === "recent" ? "Recent" : "Oldest"}
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[180px] bg-black/95 border-white/10">
                                <DropdownMenuItem onClick={() => setSortOrder("recent")} className="cursor-pointer">
                                    Recently Added
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortOrder("oldest")} className="cursor-pointer">
                                    Oldest Added
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <AssetGrid sortOrder={sortOrder} />
                </div>
            </main>
        </div>
    )
}
