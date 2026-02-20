import { Metadata } from 'next'

import { constructMetadata } from '@/utils/seo'

export const metadata: Metadata = constructMetadata({
    title: 'Community Activities | Medialane',
    description: 'Track the latest IP activities on Medialane. See minting, transfers, remixes, and other on-chain events from the creator community.',
    url: '/activities'
})

export default function ActivitiesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
