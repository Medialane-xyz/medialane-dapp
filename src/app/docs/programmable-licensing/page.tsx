
import type { Metadata } from "next"
import ProgrammableLicensingContent from "@/app/docs/programmable-licensing/ProgrammableLicensingContent"

export const metadata: Metadata = {
    title: "Programmable Licensing | Medialane",
    description: "Learn how Mediolano handles decentralized and immutable programmable licensing for intellectual property on Starknet.",
    openGraph: {
        title: "Programmable Licensing | Medialane",
        description: "Decentralized, Immutable, and Programmable IP Licensing.",
        url: 'https://dapp.medialane.xyz/docs/programmable-licensing',
        siteName: 'Medialane',
        images: [
            {
                url: '/app-card.jpg',
                width: 1200,
                height: 630,
                alt: 'Mediolano Programmable Licensing',
            },
        ],
        locale: 'en_US',
        type: 'article',
    },
    twitter: {
        card: 'summary_large_image',
        title: "Programmable Licensing | Medialane",
        description: "Decentralized, Immutable, and Programmable IP Licensing.",
        images: ['/mediolano-logo-dark.png'],
    },
}

export default function ProgrammableLicensingPage() {
    return <ProgrammableLicensingContent />
}
