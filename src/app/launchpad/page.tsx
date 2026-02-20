import type { Metadata } from "next"
import { LaunchpadContent } from "@/components/launchpad/launchpad-content"

import { constructMetadata } from "@/utils/seo"

export const metadata: Metadata = constructMetadata({
    title: "Creator Launchpad | Medialane",
    description: "Your monetization hub for the integrity web. Launch drops, mint assets, create collections, and build revenue streams with zero fees and full ownership.",
    url: "/launchpad"
})

export default function LaunchpadPage() {
    return <LaunchpadContent />
}
