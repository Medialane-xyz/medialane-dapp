
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingBag, RefreshCw, HandCoins, Clock } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { PurchaseDialog } from "@/components/marketplace/checkout/purchase-dialog"
import { OfferDialog } from "@/components/marketplace/checkout/offer-dialog"

export function AssetActionPanel({ assetId }: { assetId: string }) {
    // Mock state for Seaport integration
    const [listingPrice, setListingPrice] = useState<string | null>("0.45 ETH") // Null if not listed
    const [isOwner, setIsOwner] = useState(false)

    return (
        <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-xl overflow-hidden">
            <CardContent className="p-6 space-y-6">

                {/* Sale Status */}
                {listingPrice ? (
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Current Price</p>
                        <div className="text-3xl font-bold text-white flex items-baseline gap-2">
                            {listingPrice}
                            <span className="text-sm font-normal text-muted-foreground">$1,532.45</span>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-amber-400 bg-amber-900/20 p-3 rounded-lg border border-amber-900/50">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm font-medium">Not currently for sale</span>
                    </div>
                )}

                {/* Primary Actions */}
                <div className="grid grid-cols-2 gap-3">
                    {listingPrice ? (
                        <PurchaseDialog
                            asset={{
                                id: assetId,
                                name: "Mizu I", // Ideally passed as prop or fetched
                                price: "0.45",
                                currency: "ETH",
                                image: "/placeholder.svg", // Ideally passed
                                collectionName: "Mizu Collection"
                            }}
                            trigger={
                                <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-6 text-lg shadow-lg shadow-blue-900/20">
                                    <ShoppingBag className="mr-2 h-5 w-5" /> Buy Now
                                </Button>
                            }
                        />
                    ) : (
                        <Button className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-6" disabled>
                            Not Listed
                        </Button>
                    )}

                    <OfferDialog
                        asset={{
                            id: assetId,
                            name: "Mizu I",
                            floorPrice: "0.45",
                            currency: "ETH",
                            image: "/placeholder.svg",
                            collectionName: "Mizu Collection"
                        }}
                        trigger={
                            <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 py-6 text-lg font-semibold">
                                <HandCoins className="mr-2 h-5 w-5" /> Make Offer
                            </Button>
                        }
                    />
                </div>

                <Separator className="bg-white/10" />

                {/* Remix Action */}
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-purple-200 font-medium">
                            <RefreshCw className="h-4 w-4 text-purple-400" />
                            Remix & License
                        </div>
                        <Badge variant="outline" className="border-purple-500/30 text-purple-300">New</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-4">
                        Create a derivative work based on this asset. You will be granted a commercial license upon minting.
                    </p>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-purple-900/20">
                        Create Remix
                    </Button>
                </div>

            </CardContent>
        </Card>
    )
}
