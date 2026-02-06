"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, HandCoins, RefreshCw } from "lucide-react"
import { PurchaseDialog } from "@/components/marketplace/checkout/purchase-dialog"
import { OfferDialog } from "@/components/marketplace/checkout/offer-dialog"
import Link from "next/link"

interface AssetMonetizationActionsProps {
    assetId: string
    assetName: string
    slug: string
}

export function AssetMonetizationActions({ assetId, assetName, slug }: AssetMonetizationActionsProps) {
    // Mock state
    const [listingPrice] = useState<string | null>("0.45 ETH")

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* Price & Actions Row */}
            <div className="flex flex-wrap items-center gap-3 w-full">

                {/* Price Badge - Optional/Integrated */}
                {listingPrice && (
                    <div className="flex items-baseline gap-1 bg-black/20 backdrop-blur-md px-3 py-2 rounded-lg border border-white/5 mr-1">
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Price</span>
                        <span className="text-lg font-bold text-white">{listingPrice}</span>
                    </div>
                )}

                {/* Buy Button */}
                {listingPrice ? (
                    <PurchaseDialog
                        asset={{
                            id: assetId,
                            name: assetName,
                            price: "0.45",
                            currency: "ETH",
                            image: "/placeholder.svg",
                            collectionName: "Collection"
                        }}
                        trigger={
                            <Button size="lg" className="flex-1 sm:flex-none min-w-[140px] bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-900/20 border-0 h-11">
                                <ShoppingBag className="mr-2 h-4 w-4" /> Buy Now
                            </Button>
                        }
                    />
                ) : (
                    <Button size="lg" className="flex-1 sm:flex-none bg-white/10 text-white/50 h-11" disabled>Not Listed</Button>
                )}

                {/* Make Offer */}
                <OfferDialog
                    asset={{
                        id: assetId,
                        name: assetName,
                        floorPrice: "0.45",
                        currency: "ETH",
                        image: "/placeholder.svg",
                        collectionName: "Collection"
                    }}
                    trigger={
                        <Button variant="outline" size="lg" className="flex-1 sm:flex-none min-w-[140px] glass h-11 border-white/20 hover:bg-white/10 hover:text-white text-white font-semibold">
                            <HandCoins className="mr-2 h-4 w-4" /> Make Offer
                        </Button>
                    }
                />

                {/* Create Remix */}
                <Link href={`/create/remix/${slug}`} className="flex-1 sm:flex-none">
                    <Button size="lg" className="w-full sm:w-auto min-w-[140px] bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-900/20 border-0 h-11">
                        <RefreshCw className="mr-2 h-4 w-4" /> Create Remix
                    </Button>
                </Link>
            </div>
        </div>
    )
}
