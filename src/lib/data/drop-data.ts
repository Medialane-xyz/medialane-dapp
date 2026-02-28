export const DROP_DATA = {
    // Collection Metadata
    collection: {
        id: 'genesis-drop-001',
        name: 'Medialane Genesis',
        symbol: 'MLG',
        description: 'The Medialane Genesis collection represents the founding pillars of the creator economy protocol. Holders gain exclusive access to beta features, governance rights, and reduced protocol fees.',
        coverImage: 'https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?w=1600&auto=format&fit=crop&q=80',
        tags: ['Utility', 'Governance', 'Access Pass'],
    },

    // Mint Configuration
    mint: {
        price: 0.08, // ETH
        currencySymbol: 'ETH',
        maxSupply: 1000,
        maxPerWallet: 5,
        startDate: '2024-03-01T12:00:00Z', // UTC ISO string
        endDate: '2024-03-08T12:00:00Z',
        isLive: true,
    },

    // Initial State Data
    live: {
        totalMinted: 842,
    },

    // Creator Profile
    creator: {
        name: 'Medialane Protocol',
        role: 'Core Team',
        bio: 'Building the financial infrastructure for the creator capital markets. Medialane empowers creators to tokenize and monetize their intellectual property.',
        avatar: 'https://github.com/medialane.png',
        socials: {
            twitter: 'https://twitter.com/medialane',
            discord: 'https://discord.gg/medialane',
            website: 'https://medialane.io',
        },
        stats: {
            collections: 1,
            volume: '450 ETH',
        }
    },

    // Roadmap
    roadmap: [
        {
            phase: 'Phase 1',
            title: 'Genesis Launch',
            description: 'Public mint of 1,000 Genesis Pass NFTs. Community onboarding and role assignment.',
            status: 'Current',
            date: 'Q1 2024'
        },
        {
            phase: 'Phase 2',
            title: 'Staking & Utility',
            description: 'Release of the staking dashboard. Holders begin earning protocol yield shares.',
            status: 'Upcoming',
            date: 'Q2 2024'
        },
        {
            phase: 'Phase 3',
            title: 'Creator Launchpad',
            description: 'Holders get priority access to invest in upcoming creator launches on the platform.',
            status: 'Planned',
            date: 'Q3 2024'
        },
        {
            phase: 'Phase 4',
            title: 'DAO Governance',
            description: 'Transition to community governance. Genesis holders vote on protocol parameters.',
            status: 'Planned',
            date: 'Q4 2024'
        }
    ],

    // Gallery / Traits Preview
    previewItems: [
        {
            id: 1,
            name: 'Genesis Core #042',
            rarity: 'Legendary',
            image: 'https://images.unsplash.com/photo-1618172193622-ae2d025f4032?w=800&auto=format&fit=crop&q=60'
        },
        {
            id: 2,
            name: 'Genesis Core #108',
            rarity: 'Rare',
            image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60'
        },
        {
            id: 3,
            name: 'Genesis Core #337',
            rarity: 'Epic',
            image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&auto=format&fit=crop&q=60'
        },
        {
            id: 4,
            name: 'Genesis Core #892',
            rarity: 'Common',
            image: 'https://images.unsplash.com/photo-1633101585257-23c347ad68fb?w=800&auto=format&fit=crop&q=60'
        },
    ]
};
