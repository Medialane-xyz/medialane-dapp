"use client"

import { PurchaseDialog } from "@/components/marketplace/checkout/purchase-dialog"
import { OfferDialog } from "@/components/marketplace/checkout/offer-dialog"
import { ListingDialog } from "@/components/marketplace/listing-dialog"
import Link from "next/link"
import { useListing } from "@/hooks/use-listing"
import { useMarketplace } from "@/hooks/use-marketplace"
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
        await cancelListing(listing);
    }

    if (isListingLoading) {
        return (
            <div className="w-full h-24 flex items-center justify-center rounded-xl border bg-muted/30">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="w-full space-y-4">
            <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
                {listing ? (
                    <div className="flex flex-col gap-1">
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Current Price</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold tracking-tight text-foreground">
                                {listing.start_amount} {listing.currency || "USDC"}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-between items-center py-2">
                        <p className="text-sm font-medium text-muted-foreground">
                            {isOwner ? "Not listed for sale" : "Not listed yet"}
                        </p>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    {isOwner ? (
                        listing ? (
                            <Button
                                variant="destructive"
                                className="flex-1 h-11"
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
                                    image: `/api/assets/image?address=${nftAddress}&tokenId=${tokenId}`,
                                    collectionAddress: nftAddress,
                                    tokenId: tokenId
                                }}
                                trigger={
                                    <Button className="flex-1 h-11">
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
                                        image: `/api/assets/image?address=${nftAddress}&tokenId=${tokenId}`,
                                        collectionName: "Collection",
                                        listing: listing
                                    }}
                                    trigger={
                                        <Button className="flex-1 h-11">
                                            <ShoppingBag className="mr-2 h-4 w-4" />
                                            Buy Now
                                        </Button>
                                    }
                                />
                            ) : (
                                <Button className="flex-1 h-11" variant="secondary" disabled>
                                    Buy Now
                                </Button>
                            )}

                            <OfferDialog
                                asset={{
                                    id: assetId,
                                    name: assetName,
                                    floorPrice: listing?.start_amount,
                                    currency: listing?.currency || "USDC",
                                    image: `/api/assets/image?address=${nftAddress}&tokenId=${tokenId}`,
                                    collectionName: "Digital Asset",
                                    nftAddress: nftAddress,
                                    tokenId: tokenId
                                }}
                                trigger={
                                    <Button className="flex-1 h-11">
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
                <div className="p-5 rounded-xl border bg-card/50 hover:bg-card hover:border-primary/30 transition-all flex items-center justify-between group cursor-pointer shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <RefreshCw className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="font-semibold text-foreground">Create a Remix</p>
                            <p className="text-xs text-muted-foreground font-medium">Custom licensing & pricing</p>
                        </div>
                    </div>
                    <Sparkles className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
            </Link>
        </div>
    )
}
