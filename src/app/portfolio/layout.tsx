import { Metadata } from 'next'

import { constructMetadata } from '@/utils/seo'

export const metadata: Metadata = constructMetadata({
    title: 'IP Portfolio | Medialane',
    description: 'Manage your intellectual property portfolio on Starknet. View your collections, assets, and track your digital asset holdings.',
    url: '/portfolio',
    noIndex: true
})

export default function PortfolioLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
