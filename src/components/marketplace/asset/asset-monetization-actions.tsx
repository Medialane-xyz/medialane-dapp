"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingBag, HandCoins, RefreshCw, Sparkles } from "lucide-react"
import { PurchaseDialog } from "@/components/marketplace/checkout/purchase-dialog"
import { OfferDialog } from "@/components/marketplace/checkout/offer-dialog"
import Link from "next/link"

interface AssetMonetizationActionsProps {
    assetId: string
    assetName: string
    slug: string
}

export function AssetMonetizationActions({ assetId, assetName, slug }: AssetMonetizationActionsProps) {
    const [listingPrice] = useState<string | null>("0.45 ETH")
    const [usdPrice] = useState<string>("~$1,245")

    return (
        <div className="w-full space-y-6">
            {/* --- Purchase Section --- */}
            <div className="glass-card p-4 sm:p-5 space-y-4">
                {/* Price Display */}
                {listingPrice ? (
                    <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{listingPrice}</span>
                        <span className="text-sm text-muted-foreground">{usdPrice}</span>
                    </div>
                ) : (
                    <p className="text-lg text-muted-foreground">Not listed for sale</p>
                )}

                {/* Buy / Offer Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
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
                                <Button className="flex-1 h-11 gradient-vivid-primary rounded-lg">
                                    <ShoppingBag className="mr-2 h-4 w-4" />
                                    Buy Now
                                </Button>
                            }
                        />
                    ) : (
                        <Button className="flex-1 h-11 glass-button text-muted-foreground cursor-not-allowed rounded-lg" disabled>
                            Not Listed
                        </Button>
                    )}

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
                            <Button variant="outline" className="flex-1 h-11 glass-button text-foreground hover:text-foreground rounded-lg">
                                <HandCoins className="mr-2 h-4 w-4" />
                                Make Offer
                            </Button>
                        }
                    />
                </div>
            </div>

            {/* --- Remix Section (Separate Visual) --- */}
            <Link href={`/create/remix/${slug}`} className="block">
                <div className="glass-interactive p-4 sm:p-5 rounded-xl flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-500 to-violet-600 flex items-center justify-center">
                            <RefreshCw className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="font-semibold text-foreground">Create a Remix</p>
                            <p className="text-xs text-muted-foreground">Custom licensing & pricing</p>
                        </div>
                    </div>
                    <Sparkles className="h-5 w-5 text-muted-foreground group-hover:text-pink-500 transition-colors" />
                </div>
            </Link>
        </div>
    )
}
