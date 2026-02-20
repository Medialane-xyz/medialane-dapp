import { Metadata } from 'next'

import { constructMetadata } from '@/utils/seo'

export const metadata: Metadata = constructMetadata({
    title: 'Explore Assets | Medialane',
    description: 'Discover and explore the latest minted IP assets on Medialane. Browse creative works from the global creator community.',
    url: '/assets'
})

export default function AssetsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
