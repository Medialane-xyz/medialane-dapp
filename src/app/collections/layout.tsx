import { Metadata } from 'next'

import { constructMetadata } from '@/utils/seo'

export const metadata: Metadata = constructMetadata({
    title: 'IP Collections | Medialane',
    description: 'Explore and discover curated IP collections on Starknet. Browse digital assets, artwork, and intellectual property protected on the blockchain.',
    url: '/collections'
})

export default function CollectionsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
