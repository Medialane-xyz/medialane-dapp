
"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    MoreHorizontal,
    RefreshCw,
    ExternalLink,
    FileText,
    Flag,
    Share2,
    Eye,
    ShoppingBag,
    Loader2
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useListing } from "@/hooks/useListing"
import { cn } from "@/lib/utils"

export interface MarketplaceAsset {
    id: string
    title: string
    creator: string
    image: string
    collectionAddress: string
    tokenId: string
    type: string
    verified?: boolean
}

function truncateAddress(address: string) {
    if (!address) return ""
    return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function AssetCard({ asset }: { asset: MarketplaceAsset }) {
    const { data: listing, isLoading } = useListing(asset.collectionAddress, asset.tokenId)
    const [imageError, setImageError] = useState(false)

    const displayImage = imageError ? "/placeholder.svg" : (asset.image || "/placeholder.svg")
    const isListed = !!listing

    return (
        <Card className="overflow-hidden border border-white/10 bg-black/20 backdrop-blur-sm hover:border-outrun-cyan/30 hover:bg-black/30 transition-all duration-500 group flex flex-col h-full hover:shadow-[0_0_30px_rgba(0,255,255,0.15)] relative">
            <Link href={`/asset/${asset.id}`} className="block relative aspect-square overflow-hidden bg-muted/20">
                <Image
                    src={displayImage}
                    alt={asset.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={() => setImageError(true)}
                    unoptimized={displayImage.startsWith("htt")} // Simple check for external URLs
                />

                {/* Type Badge */}
                <div className="absolute top-2 left-2 flex gap-2">
                    <Badge variant="secondary" className="bg-black/50 backdrop-blur text-xs font-normal border border-white/10">
                        {asset.type}
                    </Badge>
                    {isListed && (
                        <Badge className="bg-outrun-cyan/80 text-black backdrop-blur text-xs font-bold border-none">
                            LISTED
                        </Badge>
                    )}
                </div>
            </Link>

            <CardContent className="p-4 flex-1">
                <div className="flex justify-between items-start gap-2 mb-2">
                    <div className="min-w-0 w-full">
                        <Link href={`/asset/${asset.id}`} className="hover:underline">
                            <h3 className="font-semibold text-lg truncate" title={asset.title}>{asset.title}</h3>
                        </Link>
                        <div className="flex justify-between items-end mt-1">
                            <p className="text-sm text-muted-foreground truncate flex items-center gap-1" title={asset.creator}>
                                {truncateAddress(asset.creator)}
                                {asset.verified && (
                                    <span className="text-blue-400 shrink-0" title="Verified Creator">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                                            <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.498 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.491 4.491 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                )}
                            </p>

                            {/* Price / Status */}
                            <div className="text-right">
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                ) : listing ? (
                                    <p className="font-bold text-outrun-cyan">
                                        {listing.start_amount} <span className="text-xs text-muted-foreground">{listing.currency || "ETH"}</span>
                                    </p>
                                ) : (
                                    <p className="text-xs text-muted-foreground font-medium">Not Listed</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 grid grid-cols-[1fr,1fr,auto] gap-2">
                <Link href={`/asset/${asset.id}`} className="w-full">
                    <Button
                        className={cn(
                            "w-full border-none gap-2 font-semibold px-2 transition-all",
                            isListed
                                ? "gradient-vivid-outrun text-white hover:brightness-110"
                                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        )}
                        disabled={!isListed && false} // We still allow clicking to go to page to offer
                    >
                        <ShoppingBag className="h-4 w-4" />
                        <span className="hidden sm:inline">{isListed ? "Buy" : "Trade"}</span>
                    </Button>
                </Link>

                <Link href={`/create/remix/${asset.id}`} className="w-full">
                    <Button className="w-full bg-primary/90 hover:bg-primary text-primary-foreground shadow-lg shadow-primary/20 gap-2 group-hover:shadow-primary/30 transition-all font-semibold px-2">
                        <RefreshCw className="h-4 w-4" />
                        <span className="hidden sm:inline">Remix</span>
                    </Button>
                </Link>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="border-white/10 hover:bg-white/5 hover:text-white shrink-0">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More actions</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-black/90 backdrop-blur-xl border-white/10 text-white">
                        <Link href={`/asset/${asset.id}`}>
                            <DropdownMenuItem className="focus:bg-white/10 cursor-pointer">
                                <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem className="focus:bg-white/10 cursor-pointer">
                            <Share2 className="mr-2 h-4 w-4" /> Transfer Asset
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-white/10 cursor-pointer">
                            <FileText className="mr-2 h-4 w-4" /> View Provenance
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <div onClick={() => window.open(`https://starkscan.co/contract/${asset.collectionAddress}`, '_blank')}>
                            <DropdownMenuItem className="focus:bg-white/10 cursor-pointer">
                                <ExternalLink className="mr-2 h-4 w-4" /> View on Explorer
                            </DropdownMenuItem>
                        </div>
                        <DropdownMenuItem className="focus:bg-white/10 text-red-400 focus:text-red-400 focus:bg-red-900/10 cursor-pointer">
                            <Flag className="mr-2 h-4 w-4" /> Report Asset
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardFooter>
        </Card>
    )
}
