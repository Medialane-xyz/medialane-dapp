import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dapp.medialane.xyz'

    const routes = [
        { path: '', priority: 1.0, changeFrequency: 'daily' },
        { path: '/collections', priority: 0.9, changeFrequency: 'daily' },
        { path: '/assets', priority: 0.8, changeFrequency: 'daily' },
        { path: '/discover', priority: 0.8, changeFrequency: 'daily' },
        { path: '/launchpad', priority: 0.9, changeFrequency: 'daily' },
        { path: '/activities', priority: 0.8, changeFrequency: 'hourly' },
        { path: '/docs', priority: 0.6, changeFrequency: 'weekly' },
        { path: '/provenance', priority: 0.7, changeFrequency: 'weekly' },
    ] as const;

    const sitemapRoutes: MetadataRoute.Sitemap = routes.map((route) => ({
        url: `${baseUrl}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency as "daily" | "hourly" | "weekly",
        priority: route.priority,
    }));

    return sitemapRoutes;
}
