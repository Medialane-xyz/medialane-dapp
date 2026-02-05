
import type { Metadata } from "next"
import FAQContent from "@/app/docs/faq/FAQContent"

export const metadata: Metadata = {
    title: "FAQ | Medialane",
    description: "Frequently Asked Questions about Mediolano, IP tokenization, fees, and more.",
    openGraph: {
        title: "FAQ | Medialane",
        description: "Find answers to your questions about the Integrity Web and Programmable IP.",
        url: 'https://dapp.medialane.xyz/docs/faq',
        siteName: 'Medialane',
        images: [
            {
                url: '/app-card.jpg',
                width: 1200,
                height: 630,
                alt: 'Mediolano FAQ',
            },
        ],
        locale: 'en_US',
        type: 'article',
    },
    twitter: {
        card: 'summary_large_image',
        title: "FAQ | Medialane",
        description: "Find answers to your questions about the Integrity Web and Programmable IP.",
        images: ['/mediolano-logo-dark.png'],
    },
}

export default function FAQPage() {
    return <FAQContent />
}
