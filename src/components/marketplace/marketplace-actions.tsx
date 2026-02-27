"use client"

import { PurchaseDialog } from "@/components/marketplace/checkout/purchase-dialog"
import { OfferDialog } from "@/components/marketplace/checkout/offer-dialog"
import { ListingDialog } from "@/components/marketplace/listing-dialog"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useListing } from "@/hooks/use-listing"
import { useMarketplace } from "@/hooks/use-marketplace"
import { useAssetOffers } from "@/hooks/use-asset-offers"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useState, useMemo } from "react"
import { shortenAddress } from "@/lib/utils"
import { useCollectionFloor } from "@/hooks/use-collection-floor"
import { useCart } from "@/store/use-cart"
import {
    ShoppingBag,
    HandCoins,
    RefreshCw,
    Sparkles,
    Tag,
    XCircle,
    Loader2,
    Clock,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
} from "lucide-react"

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
    const router = useRouter()
    const { data: listing, isLoading: isListingLoading, refetch } = useListing(nftAddress, tokenId)
    const { cancelOrder, acceptOffer, isProcessing } = useMarketplace()
    const { allOffers, userOffer, isLoading: isOffersLoading } = useAssetOffers(nftAddress, tokenId)

    const collectionFloor = useCollectionFloor(nftAddress)
    const { items, addItem, removeItem, setIsOpen: setCartOpen } = useCart()
    const isInCart = listing ? items.some(i => i.listing.orderHash === listing.orderHash) : false

    const [cancellingOfferHash, setCancellingOfferHash] = useState<string | null>(null)
    const [acceptingOfferHash, setAcceptingOfferHash] = useState<string | null>(null)
    const [showAllOffers, setShowAllOffers] = useState(false)

    const handleCancelListing = async () => {
        if (!listing?.orderHash) return
        const hash = await cancelOrder(listing.orderHash)
        if (hash) {
            router.refresh()
            await refetch()
        }
    }

    const handleCancelOffer = async (orderHash: string) => {
        setCancellingOfferHash(orderHash)
        const hash = await cancelOrder(orderHash)
        setCancellingOfferHash(null)
        if (hash) router.refresh()
    }

    const handleAcceptOffer = async (orderHash: string) => {
        setAcceptingOfferHash(orderHash)
        const hash = await acceptOffer(orderHash, nftAddress, tokenId)
        setAcceptingOfferHash(null)
        if (hash) router.refresh()
    }

    if (isListingLoading) {
        return (
            <div className="w-full h-24 flex items-center justify-center rounded-xl border bg-muted/30">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        )
    }

    const visibleOffers = showAllOffers ? allOffers : allOffers.slice(0, 3)

    return (
        <div className="w-full space-y-4">

            {/* ── Main listing / buy panel ─────────────────────────────── */}
            <div className="rounded-xl glass-panel p-5 shadow-sm space-y-4">
                {listing ? (
                    <div className="flex flex-col gap-1">
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Current Price</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold tracking-tight text-foreground">
                                {listing.formattedPrice} {listing.currencySymbol || "USDC"}
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
                                onClick={handleCancelListing}
                                disabled={isProcessing}
                            >
                                {isProcessing && !cancellingOfferHash && !acceptingOfferHash ? (
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
                                <>
                                    <PurchaseDialog
                                        asset={{
                                            id: assetId,
                                            name: assetName,
                                            price: listing.formattedPrice || "0",
                                            currency: listing.currencySymbol || "USDC",
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
                                    <Button
                                        variant={isInCart ? "secondary" : "outline"}
                                        className="flex-1 h-11"
                                        onClick={() => {
                                            if (isInCart) {
                                                removeItem(listing.orderHash)
                                            } else {
                                                addItem(
                                                    listing,
                                                    {
                                                        id: assetId,
                                                        name: assetName,
                                                        collectionName: "Digital Asset",
                                                        image: `/api/assets/image?address=${nftAddress}&tokenId=${tokenId}`,
                                                    } as any,
                                                    undefined
                                                )
                                                setCartOpen(true)
                                            }
                                        }}
                                    >
                                        <ShoppingBag className="mr-2 h-4 w-4" />
                                        {isInCart ? "In Cart" : "Add to Cart"}
                                    </Button>
                                </>
                            ) : (
                                <Button className="flex-1 h-11" variant="secondary" disabled>
                                    Buy Now
                                </Button>
                            )}

                            <OfferDialog
                                asset={{
                                    id: assetId,
                                    name: assetName,
                                    floorPrice: collectionFloor?.formattedPrice ?? listing?.formattedPrice,
                                    currency: collectionFloor?.symbol ?? listing?.currencySymbol ?? "USDC",
                                    image: `/api/assets/image?address=${nftAddress}&tokenId=${tokenId}`,
                                    collectionName: "Digital Asset",
                                    nftAddress: nftAddress,
                                    tokenId: tokenId
                                }}
                                trigger={
                                    <Button className="flex-1 h-11" variant={userOffer ? "secondary" : "default"}>
                                        <HandCoins className="mr-2 h-4 w-4" />
                                        {userOffer ? "Update Offer" : "Make Offer"}
                                    </Button>
                                }
                            />
                        </>
                    )}
                </div>
            </div>

            {/* ── Your Active Offer (buyer view) ───────────────────────── */}
            {!isOwner && userOffer && (
                <div className="rounded-xl glass-panel p-5 shadow-sm space-y-3 border border-primary/20 bg-primary/5">
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-primary uppercase font-bold tracking-wider">Your Active Offer</p>
                        <Badge variant="secondary" className="text-xs gap-1">
                            <Clock className="h-3 w-3" />
                            {userOffer.timeRemaining}
                        </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-foreground">
                            {userOffer.formattedPrice} {userOffer.currencySymbol}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-destructive border-destructive/30 hover:bg-destructive/10"
                            onClick={() => handleCancelOffer(userOffer.orderHash)}
                            disabled={cancellingOfferHash === userOffer.orderHash}
                        >
                            {cancellingOfferHash === userOffer.orderHash ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                                <XCircle className="mr-1.5 h-3 w-3" />
                            )}
                            Cancel Offer
                        </Button>
                    </div>
                </div>
            )}

            {/* ── Offers received (owner view) ─────────────────────────── */}
            {isOwner && allOffers.length > 0 && (
                <div className="rounded-xl glass-panel p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                            Offers Received
                        </p>
                        <Badge variant="secondary">{allOffers.length}</Badge>
                    </div>

                    <div className="space-y-2">
                        {isOffersLoading ? (
                            <div className="flex items-center justify-center py-4">
                                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                            </div>
                        ) : (
                            visibleOffers.map((offer) => (
                                <div
                                    key={offer.orderHash}
                                    className="flex items-center justify-between gap-3 py-2.5 px-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex flex-col min-w-0">
                                        <span className="font-semibold text-foreground">
                                            {offer.formattedPrice} {offer.currencySymbol}
                                        </span>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                            <Clock className="h-3 w-3 flex-shrink-0" />
                                            {offer.timeRemaining} · {shortenAddress(offer.offerer)}
                                        </span>
                                    </div>
                                    <Button
                                        size="sm"
                                        className="h-8 shrink-0"
                                        onClick={() => handleAcceptOffer(offer.orderHash)}
                                        disabled={acceptingOfferHash === offer.orderHash || isProcessing}
                                    >
                                        {acceptingOfferHash === offer.orderHash ? (
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                        ) : (
                                            <CheckCircle2 className="mr-1.5 h-3 w-3" />
                                        )}
                                        Accept
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>

                    {allOffers.length > 3 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full h-8 text-muted-foreground"
                            onClick={() => setShowAllOffers((v) => !v)}
                        >
                            {showAllOffers ? (
                                <>
                                    <ChevronUp className="mr-1.5 h-3 w-3" /> Show less
                                </>
                            ) : (
                                <>
                                    <ChevronDown className="mr-1.5 h-3 w-3" /> Show {allOffers.length - 3} more
                                </>
                            )}
                        </Button>
                    )}
                </div>
            )}

            {/* ── Offer activity indicator (non-owner, others' bids) ───── */}
            {!isOwner && !userOffer && allOffers.length > 0 && (
                <p className="text-xs text-muted-foreground text-center px-2">
                    {allOffers.length} active {allOffers.length === 1 ? "offer" : "offers"} on this asset
                </p>
            )}

            {/* ── Remix panel ──────────────────────────────────────────── */}
            <Link href={`/create/remix/${slug}`} className="block">
                <div className="p-5 rounded-xl glass-panel hover:border-primary/30 transition-all flex items-center justify-between group cursor-pointer shadow-sm">
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
