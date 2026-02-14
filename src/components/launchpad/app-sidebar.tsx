"use client"

import * as React from "react"
import {
    Rocket,
    Search,
    Grid3X3,
    List as ListIcon,
    ArrowUpDown
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInput,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from "@/components/ui/sidebar"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    search: string
    setSearch: (value: string) => void
    category: string
    setCategory: (value: string) => void
    sort: string
    setSort: (value: string) => void
    viewMode: "grid" | "list"
    setViewMode: (value: "grid" | "list") => void
    categories: { id: string; label: string }[]
}

export function AppSidebar({
    search,
    setSearch,
    category,
    setCategory,
    sort,
    setSort,
    viewMode,
    setViewMode,
    categories,
    ...props
}: AppSidebarProps) {
    return (
        <Sidebar {...props}>
            <SidebarHeader className="p-4 pb-0">
                <div className="flex items-center gap-2 px-1 mb-2">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Rocket className="size-4" />
                    </div>
                    <div className="flex flex-col gap-0.5 leading-none">
                        <span className="font-semibold">Launchpad</span>
                        <span className="text-xs text-muted-foreground">Creator Tools</span>
                    </div>
                </div>
                <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <SidebarInput
                        placeholder="Search tools..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </SidebarHeader>

            <SidebarContent className="px-2">

                <SidebarGroup>
                    <SidebarGroupLabel>Categories</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {categories.map((cat) => (
                                <SidebarMenuItem key={cat.id}>
                                    <SidebarMenuButton
                                        isActive={category === cat.id}
                                        onClick={() => setCategory(cat.id)}
                                        className="data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                                    >
                                        <span>{cat.label}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarSeparator />

                <SidebarGroup>
                    <SidebarGroupLabel>View & Sort</SidebarGroupLabel>
                    <SidebarGroupContent className="space-y-4 pt-2">

                        {/* Sort Select */}
                        <div className="px-2">
                            <Select value={sort} onValueChange={setSort}>
                                <SelectTrigger className="w-full h-9 text-xs">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <ArrowUpDown className="w-3.5 h-3.5" />
                                        <span>Sort by</span>
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="popularity">Popularity</SelectItem>
                                    <SelectItem value="time">Fastest Time</SelectItem>
                                    <SelectItem value="complexity">Complexity</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* View Toggle */}
                        <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-lg mx-2 border border-border/50">
                            <Button
                                variant={viewMode === "grid" ? "secondary" : "ghost"}
                                size="sm"
                                className={cn("flex-1 h-7 text-xs gap-1.5", viewMode === "grid" && "bg-background shadow-sm")}
                                onClick={() => setViewMode("grid")}
                            >
                                <Grid3X3 className="w-3.5 h-3.5" />
                                Grid
                            </Button>
                            <Button
                                variant={viewMode === "list" ? "secondary" : "ghost"}
                                size="sm"
                                className={cn("flex-1 h-7 text-xs gap-1.5", viewMode === "list" && "bg-background shadow-sm")}
                                onClick={() => setViewMode("list")}
                            >
                                <ListIcon className="w-3.5 h-3.5" />
                                List
                            </Button>
                        </div>

                    </SidebarGroupContent>
                </SidebarGroup>

            </SidebarContent>
        </Sidebar>
    )
}
