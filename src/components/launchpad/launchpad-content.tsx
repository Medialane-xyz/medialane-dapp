"use client"

import "@/components/launchpad/launchpad.css"
import { LaunchpadCard, type LaunchpadFeatureData } from "@/components/launchpad/launchpad-card"
import { CreatorStatsBar } from "@/components/create/creator-stats-bar"
import { PageHeader } from "@/components/page-header"

/* ═══════════════════════════════════════════════════════
   Feature Manifest
   To ship a feature: set active → true, set real href.
   ═══════════════════════════════════════════════════════ */
const features: LaunchpadFeatureData[] = [
    {
        id: "collection-drop",
        title: "Collection Drop",
        description: "Launch a premium NFT drop with a dedicated landing page, minting mechanics, and visual storytelling.",
        icon: "Sparkles",
        href: "/create/collection-drop",
        gradient: "from-amber-500 to-orange-600",
        tags: ["Drop", "NFT", "Launch"],
        active: true,
    },
    {
        id: "single-mint",
        title: "Single Mint Drop",
        description: "Register and protect your intellectual property as a programmable asset with full metadata.",
        icon: "Shield",
        href: "/create/asset",
        gradient: "from-blue-500 to-cyan-500",
        tags: ["IP", "Asset", "Mint"],
        active: true,
    },
    {
        id: "create-collection",
        title: "Create NFT Collection",
        description: "Group related assets into a collection with unified branding and management features.",
        icon: "Layers",
        href: "/create/collection",
        gradient: "from-emerald-500 to-green-600",
        tags: ["Collection", "Organize"],
        active: true,
    },
    {
        id: "create-asset",
        title: "Create NFT Asset",
        description: "Mint a new NFT asset with full customization over metadata, licensing, and distribution.",
        icon: "Gem",
        href: "/create/asset",
        gradient: "from-violet-500 to-purple-600",
        tags: ["NFT", "Custom"],
        active: true,
    },
    {
        id: "ip-templates",
        title: "Create with IP Templates",
        description: "Use optimized templates for music, art, video, software and other IP types.",
        icon: "Grid3X3",
        href: "/create/templates",
        gradient: "from-fuchsia-500 to-pink-600",
        tags: ["Template", "IP"],
        active: true,
    },
    {
        id: "create-remix",
        title: "Create Remix",
        description: "Remix existing IP assets to build derivative works with proper licensing and provenance.",
        icon: "RefreshCw",
        href: "/create/remix",
        gradient: "from-rose-500 to-red-600",
        tags: ["Remix", "Derivative"],
        active: true,
    },
    {
        id: "ip-clubs",
        title: "IP Clubs",
        description: "Create memberships and exclusive communities for your fans and collectors.",
        icon: "Crown",
        href: "/launchpad",
        gradient: "from-amber-500 to-yellow-500",
        tags: ["Membership", "Community"],
        active: false,
    },
    {
        id: "ip-tickets",
        title: "IP Tickets",
        description: "Sell NFT tickets to online or IRL events with verifiable proof of attendance.",
        icon: "Ticket",
        href: "/launchpad",
        gradient: "from-pink-500 to-rose-500",
        tags: ["Events", "Tickets"],
        active: false,
    },
    {
        id: "ip-subscription",
        title: "IP Subscription",
        description: "Offer recurring subscription access to your exclusive IP content.",
        icon: "RefreshCcw",
        href: "/launchpad",
        gradient: "from-blue-500 to-indigo-500",
        tags: ["Recurring", "Access"],
        active: false,
    },
    {
        id: "crowdfunding",
        title: "Crowdfunding",
        description: "Fund your creative projects with community-backed on-chain crowdfunding.",
        icon: "Heart",
        href: "/launchpad",
        gradient: "from-emerald-500 to-teal-500",
        tags: ["Funding", "Community"],
        active: false,
    },
    {
        id: "ip-coin",
        title: "IP Coin",
        description: "Launch a token tied to your intellectual property for community governance.",
        icon: "CircleDollarSign",
        href: "/launchpad",
        gradient: "from-cyan-500 to-blue-500",
        tags: ["Token", "Governance"],
        active: false,
    },
    {
        id: "creator-coin",
        title: "Creator Coin",
        description: "Create your own creator economy with a personal coin and social tokens.",
        icon: "BookOpen",
        href: "/launchpad",
        gradient: "from-violet-500 to-purple-500",
        tags: ["Social", "Economy"],
        active: false,
    },
]

/* ═══════════════════════════════════════════════════════ */

export function LaunchpadContent() {
    return (
        <div className="min-h-screen pb-16 px-4 md:px-6">
            <main className="container mx-auto max-w-6xl">

                <CreatorStatsBar />

                <PageHeader
                    title="Creator Launchpad"
                    description="Pick a tool. Launch something new. Zero fees, full ownership."
                />

                {/* All features — unified grid, no section breaks */}
                <div className="lp-grid">
                    {features.map((feature, index) => (
                        <LaunchpadCard key={feature.id} feature={feature} index={index} />
                    ))}
                </div>
            </main>
        </div>
    )
}
