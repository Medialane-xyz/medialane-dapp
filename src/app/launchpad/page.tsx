import type { Metadata } from "next"
import { LaunchpadContent } from "@/components/launchpad/launchpad-content"

export const metadata: Metadata = {
    title: "Creator Launchpad | Mediolano",
    description:
        "Your monetization hub for the integrity web. Launch drops, mint assets, create collections, and build revenue streams with zero fees and full ownership.",
    openGraph: {
        title: "Creator Launchpad — Mediolano",
        description:
            "Launch your IP monetization journey. Collection drops, NFT minting, remixes, and more — all on-chain, all yours.",
    },
}

export default function LaunchpadPage() {
    return <LaunchpadContent />
}
