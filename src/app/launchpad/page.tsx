"use client"

import {
    Layers,
    Zap,
    PlusCircle,
    Box,
    LayoutTemplate,
    Sparkles,
    Shield,
    FileText,
    Search,
    Rocket,
    SlidersHorizontal
} from "lucide-react"
import { useState } from "react"
import { LaunchpadOptionCard, LaunchpadOption } from "@/components/launchpad/launchpad-option-card"
import { LaunchpadOptionRow } from "@/components/launchpad/launchpad-option-row"
import { AppSidebar } from "@/components/launchpad/app-sidebar"
import { CreatorStatsBar } from "@/components/create/creator-stats-bar"
import { cn } from "@/lib/utils"
import {
    SidebarProvider,
    SidebarInset,
    useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

// Reuse data
const launchpadOptions: LaunchpadOption[] = [
    {
        id: "collection-drop",
        title: "Collection Drop",
        description: "Launch a comprehensive NFT drop with reveal mechanics, whitelists, and phases.",
        icon: Layers,
        href: "/launchpad/collection",
        popular: true,
        trending: true,
        gradient: "from-purple-500 to-indigo-600",
        iconColor: "text-purple-500",
        timeEstimate: "5-10 min",
        fee: "2.5%",
        complexity: "Intermediate",
        benefits: ["Dedicated landing page", "Whitelist management", "Reveal mechanics"],
        tag: "Deploy"
    },
    {
        id: "mint-drop",
        title: "Mint Drop",
        description: "Schedule a time-limited or open edition minting event for your community.",
        icon: Zap,
        href: "/launchpad/mint",
        popular: true,
        gradient: "from-amber-400 to-orange-500",
        iconColor: "text-amber-500",
        timeEstimate: "2-5 min",
        fee: "2.5%",
        complexity: "Beginner",
        benefits: ["Time-based scheduling", "Open Editions", "Instant Payouts"],
        tag: "Deploy"
    },
    {
        id: "claim-collection",
        title: "Claim Collection",
        description: "Claim ownership of an existing contract or collection deployed via third-party tools.",
        icon: Shield,
        href: "/claim/collection",
        trending: true,
        gradient: "from-emerald-400 to-green-600",
        iconColor: "text-emerald-500",
        timeEstimate: "Instant",
        fee: "Free",
        complexity: "Advanced",
        benefits: ["Dashboard management", "Royalty enforcement", "Verification badge"],
        tag: "Claim"
    },
    {
        id: "create-collection",
        title: "Standard Collection",
        description: "Deploy a classic ERC-721/1155 smart contract for manual minting.",
        icon: PlusCircle,
        href: "/create/collection",
        gradient: "from-blue-400 to-blue-600",
        iconColor: "text-blue-500",
        timeEstimate: "1-3 min",
        fee: "Gas",
        complexity: "Beginner",
        benefits: ["Full ownership", "Standard Compliance", "Custom Metadata"],
        tag: "Deploy"
    },
    {
        id: "create-nft",
        title: "Mint Single Asset",
        description: "Mint a unique 1/1 asset to your own or a shared collection.",
        icon: Box,
        href: "/create/asset",
        gradient: "from-pink-400 to-rose-500",
        iconColor: "text-pink-500",
        timeEstimate: "< 1 min",
        fee: "Gas",
        complexity: "Beginner",
        benefits: ["Permanent Storage", "Instant Indexing", "Marketplace Listing"],
        tag: "Deploy"
    },
    {
        id: "claim-asset",
        title: "Claim Asset",
        description: "Verify and claim authorship of a specific asset on-chain.",
        icon: FileText,
        href: "/claim/asset",
        gradient: "from-cyan-400 to-teal-500",
        iconColor: "text-cyan-500",
        timeEstimate: "Instant",
        fee: "Free",
        complexity: "Intermediate",
        benefits: ["Attribution", "Royalty Setup", "Creator Profile"],
        tag: "Claim"
    },
    {
        id: "ip-templates",
        title: "IP License Templates",
        description: "Attach legally enforceable licenses (CC0, Commercial) to your assets.",
        icon: LayoutTemplate,
        href: "/create/template",
        gradient: "from-slate-400 to-slate-600",
        iconColor: "text-slate-500",
        timeEstimate: "2 min",
        fee: "Free",
        complexity: "Beginner",
        benefits: ["Legal Protection", "Clear Rights", "Standardization"],
        tag: "Manage"
    },
    {
        id: "remix",
        title: "Create Remix",
        description: "Generate derivative works from existing IP with automated attribution.",
        icon: Sparkles,
        href: "/create/remix",
        gradient: "from-indigo-400 to-violet-600",
        iconColor: "text-indigo-500",
        timeEstimate: "3-10 min",
        fee: "Split",
        complexity: "Intermediate",
        benefits: ["On-chain Provenance", "Auto-Split Royalties", "Community Collabs"],
        tag: "Manage"
    }
]

const categories = [
    { id: "all", label: "All Tools" },
    { id: "Deploy", label: "Deploy & Mint" },
    { id: "Claim", label: "Claim & Verify" },
    { id: "Manage", label: "Manage & Remix" },
]

function LaunchpadContent({
    search, setSearch,
    category, setCategory,
    sortedOptions,
    viewMode, setViewMode,
    categories
}: {
    search: string, setSearch: (v: string) => void,
    category: string, setCategory: (v: string) => void,
    sortedOptions: LaunchpadOption[],
    categories: { id: string; label: string }[],
    viewMode: "grid" | "list", setViewMode: (v: "grid" | "list") => void
}) {
    const { toggleSidebar } = useSidebar()

    return (
        <SidebarInset>
            <div className="flex flex-col min-h-screen">

                {/* Main Content */}
                <div className="flex-1 p-4 md:p-8 space-y-8 pt-32 pb-20">

                    {/* Stats Only (No Header Text) */}
                    {category === "all" && !search && (
                        <CreatorStatsBar />
                    )}

                    {/* Toolbar / Trigger */}
                    <div className="flex items-center justify-between pb-4">
                        <div className="flex items-center gap-2">
                            {category !== "all" && (
                                <span className="text-xl font-bold text-primary">
                                    {categories.find(c => c.id === category)?.label}
                                </span>
                            )}
                        </div>

                        <Button
                            onClick={toggleSidebar}
                            variant="outline"
                            className="gap-2 rounded-full border-primary/20 hover:border-primary/50 hover:bg-primary/5 pl-4 pr-5 h-10 transition-all duration-300"
                        >
                            <SlidersHorizontal className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium">Filters</span>
                        </Button>
                    </div>

                    {/* Results Grid/List */}
                    {sortedOptions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-muted/20 border border-dashed rounded-xl">
                            <Search className="w-12 h-12 text-muted-foreground/20 mb-4" />
                            <h3 className="text-lg font-medium text-foreground">No tools found</h3>
                            <p className="text-muted-foreground text-sm">Clear filters to see all options.</p>
                            <Button
                                variant="link"
                                onClick={() => { setSearch(""); setCategory("all"); }}
                                className="mt-2 text-primary"
                            >
                                Reset filters
                            </Button>
                        </div>
                    ) : (
                        <div className={cn(
                            "animate-in fade-in zoom-in-95 duration-500",
                            viewMode === "grid"
                                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                                : "flex flex-col gap-3"
                        )}>
                            {sortedOptions.map(option => (
                                viewMode === "grid"
                                    ? <LaunchpadOptionCard key={option.id} option={option} />
                                    : <LaunchpadOptionRow key={option.id} option={option} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </SidebarInset>
    )
}

export default function LaunchpadPage() {
    const [search, setSearch] = useState("")
    const [category, setCategory] = useState("all")
    const [sort, setSort] = useState("popularity")
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

    // Filter Logic
    const filteredOptions = launchpadOptions.filter(opt => {
        const matchesSearch = opt.title.toLowerCase().includes(search.toLowerCase()) ||
            opt.description.toLowerCase().includes(search.toLowerCase())
        const matchesCategory = category === "all" || opt.tag === category
        return matchesSearch && matchesCategory
    })

    // Sort Logic
    const sortedOptions = [...filteredOptions].sort((a, b) => {
        switch (sort) {
            case "popularity":
                return (b.popular ? 1 : 0) - (a.popular ? 1 : 0)
            case "time":
                return a.timeEstimate.localeCompare(b.timeEstimate)
            case "complexity":
                return a.complexity.localeCompare(b.complexity)
            default:
                return 0
        }
    })

    return (
        <SidebarProvider defaultOpen={false}>
            {/* Content FIRST => Left in DOM */}
            <LaunchpadContent
                search={search} setSearch={setSearch}
                category={category} setCategory={setCategory}
                sortedOptions={sortedOptions}
                viewMode={viewMode} setViewMode={setViewMode}
                categories={categories}
            />
            {/* Sidebar SECOND => Right in DOM */}
            {/* side="right" + collapsible="offcanvas" ensures it overlays from right and takes 0 width in flow */}
            <AppSidebar
                side="right"
                collapsible="offcanvas"
                search={search} setSearch={setSearch}
                category={category} setCategory={setCategory}
                sort={sort} setSort={setSort}
                viewMode={viewMode} setViewMode={setViewMode}
                categories={categories}
            />
        </SidebarProvider>
    )
}
