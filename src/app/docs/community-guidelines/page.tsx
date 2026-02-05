
import type { Metadata } from "next"
import CommunityGuidelinesContent from "@/app/docs/community-guidelines/CommunityGuidelinesContent"

export const metadata: Metadata = {
  title: "Community Guidelines | Medialane",
  description: "Our standards for fostering a safe, inclusive, and respectful community for all creators and collectors.",
  openGraph: {
    title: "Community Guidelines | Medialane",
    description: "Building a respectful and thriving decentralized community.",
    url: 'https://dapp.medialane.xyz/docs/community-guidelines',
    siteName: 'Medialane',
    images: [
      {
        url: '/app-card.jpg',
        width: 1200,
        height: 630,
        alt: 'Mediolano Community',
      },
    ],
    locale: 'en_US',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Community Guidelines | Medialane",
    description: "Building a respectful and thriving decentralized community.",
    images: ['/mediolano-logo-dark.png'],
  },
}

export default function CommunityGuidelinesPage() {
  return <CommunityGuidelinesContent />
}
