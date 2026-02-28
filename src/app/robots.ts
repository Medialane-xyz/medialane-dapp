import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dapp.medialane.io'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/portfolio/', '/settings/', '/transfer/', '/*?*'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl,
    }
}
