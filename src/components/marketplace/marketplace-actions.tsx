"use client"

import { PurchaseDialog } from "@/components/marketplace/checkout/purchase-dialog"
import { OfferDialog } from "@/components/marketplace/checkout/offer-dialog"
import { ListingDialog } from "@/components/marketplace/listing-dialog"
import Link from "next/link"
import { useListing } from "@/hooks/useListing"
import { useMarketplace } from "@/hooks/useMarketplace"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useState } from "react"

import { ShoppingBag, HandCoins, RefreshCw, Sparkles, Tag, XCircle, Loader2 } from "lucide-react"

interface MarketplaceActionsProps {
    assetId: string
    assetName: string
    slug: string
    isOwner: boolean
    nftAddress: string
    tokenId: string
}

export function MarketplaceActions({
    assetId,
    assetName,
    slug,
    isOwner,
    nftAddress,
    tokenId
}: MarketplaceActionsProps) {
    const { data: listing, isLoading: isListingLoading } = useListing(nftAddress, tokenId)
    const { cancelListing, isProcessing } = useMarketplace()

    const handleCancel = async () => {
        if (!listing) return;
        // TODO: Pass correct cancel parameters based on listing data
        // For now we assume listing object has what we need or we reconstruct it
        await cancelListing(listing);
    }

    if (isListingLoading) {
        return (
            <div className="w-full h-24 flex items-center justify-center glass-card">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="w-full space-y-6">
            <div className="glass-card p-4 sm:p-5 space-y-4">

                {listing ? (
                    <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                            {listing.start_amount} {/* TODO: Format Price */} {listing.currency || "USDC"}
                        </span>
                    </div>
                ) : (
                    <div className="flex justify-between items-center">
                        <p className="text-lg text-muted-foreground">
                            {isOwner ? "Not listed for sale" : "Not listed yet"}
                        </p>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                    {isOwner ? (
                        listing ? (
                            <Button
                                variant="destructive"
                                className="flex-1 h-11 rounded-lg"
                                onClick={handleCancel}
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <XCircle className="mr-2 h-4 w-4" />
                                )}
                                Cancel Listing
                            </Button>
                        ) : (
                            <ListingDialog
                                asset={{
                                    id: assetId,
                                    name: assetName,
                                    image: "/placeholder.svg", // Pass real image
                                    collectionAddress: nftAddress,
                                    tokenId: tokenId
                                }}
                                trigger={
                                    <Button className="flex-1 w-full">
                                        <Tag className="mr-2 h-4 w-4" />
                                        List for Sale
                                    </Button>
                                }
                            />
                        )
                    ) : (
                        <>
                            {listing ? (
                                <PurchaseDialog
                                    asset={{
                                        id: assetId,
                                        name: assetName,
                                        price: listing.start_amount || "0",
                                        currency: listing.currency || "USDC",
                                        image: "/placeholder.svg",
                                        collectionName: "Collection",
                                        listing: listing
                                    }}
                                    trigger={
                                        <Button className="flex-1 w-full">
                                            <ShoppingBag className="mr-2 h-4 w-4" />
                                            Buy Now
                                        </Button>
                                    }
                                />
                            ) : (
                                <Button className="flex-1 h-11 glass-button text-muted-foreground cursor-not-allowed rounded-lg" disabled>
                                    Buy Now
                                </Button>
                            )}

                            <OfferDialog
                                asset={{
                                    id: assetId,
                                    name: assetName,
                                    floorPrice: "25.00",
                                    currency: "USDC",
                                    image: "/placeholder.svg",
                                    collectionName: "Collection",
                                    nftAddress: nftAddress,
                                    tokenId: tokenId
                                }}
                                trigger={
                                    <Button variant="outline" className="flex-1 h-11 glass-button text-foreground hover:text-foreground rounded-lg">
                                        <HandCoins className="mr-2 h-4 w-4" />
                                        Make Offer
                                    </Button>
                                }
                            />
                        </>
                    )}
                </div>
            </div>

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
