
import type { Metadata } from "next"
import UserGuideContent from "@/app/docs/user-guide/UserGuideContent"

export const metadata: Metadata = {
    title: "User Guide | Medialane",
    description: "Step-by-step instructions on how to use Mediolano Medialane to create, manage, and explore programmable IP assets on Starknet.",
    openGraph: {
        title: "User Guide | Medialane",
        description: "Learn how to use Mediolano Medialane. Complete guide for creators and collectors.",
        url: 'https://dapp.medialane.xyz/docs/user-guide',
        siteName: 'Medialane',
        images: [
            {
                url: '/app-card.jpg',
                width: 1200,
                height: 630,
                alt: 'Mediolano User Guide',
            },
        ],
        locale: 'en_US',
        type: 'article',
    },
}

export default function UserGuidePage() {
    return <UserGuideContent />
}
