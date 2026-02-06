
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRightLeft, History, Palette, Share2, AlertTriangle, ExternalLink, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

interface AssetActionPanelProps {
    assetId: string
    slug: string
    isOwner: boolean
    nftAddress: string
    tokenId: string
    onTransferClick: () => void
    onReportClick: () => void
    assetName?: string
}

export function AssetActionPanel({
    assetId,
    slug,
    isOwner,
    nftAddress,
    tokenId,
    onTransferClick,
    onReportClick,
    assetName
}: AssetActionPanelProps) {
    const { toast } = useToast()
    const [copied, setCopied] = useState(false)
    const EXPLORER_URL = process.env.NEXT_PUBLIC_EXPLORER_URL || "https://voyager.online";

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: assetName || "Asset",
                    text: `Check out ${assetName} on Medialane`,
                    url: window.location.href,
                })
            } catch (error) {
                console.error("Error sharing:", error)
            }
        } else {
            try {
                await navigator.clipboard.writeText(window.location.href)
                setCopied(true)
                toast({
                    title: "Link Copied",
                    description: "Asset link copied to clipboard",
                })
                setTimeout(() => setCopied(false), 2000)
            } catch (error) {
                console.error("Failed to copy URL:", error)
            }
        }
    }

    return (
        <Card className="border-border/50 bg-background/50 backdrop-blur-sm overflow-hidden sticky top-24">
            <div className="p-5 border-b border-border/50 bg-muted/20">
                <h3 className="font-semibold flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    Actions
                </h3>
            </div>
            <CardContent className="p-5 space-y-4">

                {/* Main Actions */}
                <div className="grid grid-cols-1 gap-3">
                    {isOwner && (
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full justify-start h-12 border-border/50 hover:bg-muted/50"
                            onClick={onTransferClick}
                        >
                            <ArrowRightLeft className="mr-3 h-4 w-4 text-muted-foreground" />
                            Transfer Asset
                        </Button>
                    )}

                    <Link href={`/create/remix/${slug}`} className="w-full">
                        <Button variant="outline" size="lg" className="w-full justify-start h-12 border-border/50 hover:bg-muted/50">
                            <Palette className="mr-3 h-4 w-4 text-muted-foreground" />
                            Remix Studio
                        </Button>
                    </Link>

                    <Link href={`/provenance/${slug}`} className="w-full">
                        <Button variant="outline" size="lg" className="w-full justify-start h-12 border-border/50 hover:bg-muted/50">
                            <History className="mr-3 h-4 w-4 text-muted-foreground" />
                            View Provenance
                        </Button>
                    </Link>
                </div>

                <Separator className="bg-border/50" />

                {/* Secondary Actions */}
                <div className="grid grid-cols-2 gap-3">
                    <Button
                        variant="ghost"
                        className="w-full justify-start border border-border/30 hover:bg-muted/30"
                        onClick={handleShare}
                    >
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                    </Button>

                    <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`${EXPLORER_URL}/nft/${nftAddress}/${tokenId}`}
                        className="w-full"
                    >
                        <Button variant="ghost" className="w-full justify-start border border-border/30 hover:bg-muted/30">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Explorer
                        </Button>
                    </Link>
                </div>

                <Button
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={onReportClick}
                >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Report Issue
                </Button>

            </CardContent>
        </Card>
    )
}
