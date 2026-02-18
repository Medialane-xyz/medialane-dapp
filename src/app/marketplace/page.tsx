
"use client"

import { useState } from "react"
import { FilterSidebar } from "@/components/marketplace/filter-sidebar"
import { AssetGrid } from "@/components/marketplace/asset-grid"
import { Search, SlidersHorizontal, Filter, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
} from "@/components/ui/sheet"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"

export default function MarketplacePage() {
    const [sortOrder, setSortOrder] = useState<"recent" | "oldest">("recent")

    return (
        <div className="min-h-screen py-10">
            <main className="container mx-auto px-4 max-w-7xl">
                <PageHeader
                    title="Marketplace"
                    description="Discover, buy, and sell IP assets on the integrity web."
                >
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto mt-4 md:mt-0">
                        {/* Search Bar */}
                        <div className="relative flex-1 sm:min-w-[300px] lg:min-w-[400px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search assets..."
                                className="pl-10 bg-white/5 border-white/10 w-full focus:bg-white/10 focus:border-outrun-cyan/50 focus:shadow-[0_0_15px_rgba(0,255,255,0.1)] transition-all h-10"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            {/* Filter Button */}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="sm" className="gap-2 border-white/10 hover:bg-white/10 hover:border-outrun-cyan/30 hover:shadow-[0_0_10px_rgba(0,255,255,0.15)] transition-all duration-200 h-10 px-3 min-w-[100px] justify-center">
                                        <Filter className="h-4 w-4" />
                                        <span className="hidden sm:inline">Filters</span>
                                        <span className="sm:hidden">Filter</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-[300px] sm:w-[360px] bg-black/95 border-r border-white/10 backdrop-blur-2xl">
                                    <VisuallyHidden.Root>
                                        <SheetTitle>Filters</SheetTitle>
                                    </VisuallyHidden.Root>
                                    <div className="py-4">
                                        <FilterSidebar />
                                    </div>
                                </SheetContent>
                            </Sheet>

                            {/* Sort Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="gap-2 border-white/10 hover:bg-white/10 hover:border-outrun-cyan/30 hover:shadow-[0_0_10px_rgba(0,255,255,0.15)] transition-all duration-200 h-10 px-3 min-w-[120px] justify-between">
                                        <div className="flex items-center gap-2">
                                            <SlidersHorizontal className="h-4 w-4" />
                                            <span className="hidden sm:inline">{sortOrder === "recent" ? "Recent" : "Oldest"}</span>
                                            <span className="sm:hidden">Sort</span>
                                        </div>
                                        <ChevronDown className="h-3 w-3 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[140px] bg-black/95 backdrop-blur-xl border-white/10">
                                    <DropdownMenuItem onClick={() => setSortOrder("recent")} className="cursor-pointer focus:bg-white/10">
                                        Recent
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSortOrder("oldest")} className="cursor-pointer focus:bg-white/10">
                                        Oldest
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </PageHeader>

                <div className="space-y-4">
                    {/* Asset Grid */}
                    <AssetGrid sortOrder={sortOrder} />
                </div>
            </main>
        </div>
    )
}



