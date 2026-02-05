
import type { Metadata } from "next"
import PermissionlessSetupContent from "./PermissionlessSetupContent"

export const metadata: Metadata = {
    title: "Permissionless Setup | Medialane",
    description: "Guide to running Mediolano Medialane locally or deploying your own instance.",
    openGraph: {
        title: "Permissionless Setup | Medialane",
        description: "Run Mediolano permissionlessly. Local setup and deployment guide.",
        url: 'https://dapp.medialane.xyz/docs/permissionless-setup',
        siteName: 'Medialane',
        images: [
            {
                url: '/app-card.jpg',
                width: 1200,
                height: 630,
                alt: 'Mediolano Permissionless Setup',
            },
        ],
        locale: 'en_US',
        type: 'article',
    },
}

export default function PermissionlessSetupPage() {
    return <PermissionlessSetupContent />
}
