"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, AlertCircle, CheckCircle2, ShoppingBag, ExternalLink } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { useMarketplace } from "@/hooks/use-marketplace"
import { Listing, Fulfillment } from "@/types/marketplace"
import { EXPLORER_URL } from "@/lib/constants"
import { useTokenMetadata } from "@/hooks/use-token-metadata"

interface PurchaseDialogProps {
    trigger?: React.ReactNode
    asset: {
        id: string
        name: string
        price: string
        currency: string
        image: string
        collectionName: string
        listing?: Listing
    }
}

export function PurchaseDialog({ trigger, asset }: PurchaseDialogProps) {
    const { buyItem, isProcessing, txHash, error, resetState } = useMarketplace()
    const [open, setOpen] = useState(false)

    // Parse NFT Address and Token ID from asset.id (contract-tokenId)
    const [nftAddress, tokenId] = asset.id.split("-")
    const metadata = useTokenMetadata(tokenId, nftAddress)
    const { name: mName, image: mImage, loading: isLoadingMetadata } = metadata

    const displayName = mName || asset.name
    const displayImage = mImage || asset.image

    // Derived state from hook
    const stage = txHash ? "success" : isProcessing ? "processing" : error ? "error" : "review"

    const handlePurchase = async () => {
        if (!asset.listing) {
            console.error("No listing data available for purchase")
            return
        }

        const fulfillment: Fulfillment = {
            fulfiller: "0x0",
            order_hash: asset.listing.orderHash || "0x0",
            nonce: "0"
        }

        await buyItem(asset.listing.parameters, fulfillment)
    }

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) {
            setTimeout(() => {
                resetState()
            }, 300)
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="sm:max-w-[420px]">
                <DialogHeader>
                    <DialogTitle>Confirm Purchase</DialogTitle>
                </DialogHeader>

                {stage === "success" ? (
                    <div className="py-6 flex flex-col items-center text-center space-y-4">
                        <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="h-10 w-10 text-primary" />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold">Purchase Successful!</h2>
                            <p className="text-sm text-muted-foreground">
                                You have successfully purchased <span className="font-medium text-foreground">{asset.name}</span>
                            </p>
                        </div>
                        <Link href={`${EXPLORER_URL}/tx/${txHash}`} target="_blank" className="text-primary text-sm flex items-center gap-1 hover:underline">
                            View Transaction <ExternalLink className="w-3 h-3" />
                        </Link>
                        <Button onClick={() => setOpen(false)} className="w-full mt-2">Close</Button>
                    </div>
                ) : (
                    <div className="space-y-6 pt-2">
                        {/* Asset Preview */}
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/50 group hover:bg-muted/40 transition-colors">
                            <div className="h-16 w-16 rounded-lg overflow-hidden border border-border/50 bg-background shrink-0 shadow-sm relative">
                                {isLoadingMetadata ? (
                                    <div className="absolute inset-0 bg-muted animate-pulse" />
                                ) : (
                                    <img
                                        src={displayImage}
                                        alt={displayName}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "/placeholder.svg"
                                        }}
                                    />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{asset.collectionName}</p>
                                <h3 className="font-bold text-foreground truncate">{displayName}</h3>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <Badge variant="outline" className="text-[9px] h-4 py-0 font-medium bg-background/50">#{tokenId}</Badge>
                                    <span className="text-[10px] text-muted-foreground/60 font-medium">Verified IP</span>
                                </div>
                            </div>
                        </div>

                        {/* Price Details */}
                        <div className="space-y-3 px-1">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Price</span>
                                <span className="font-bold text-lg">{asset.price} {asset.currency}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Network Fee</span>
                                <Badge variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 text-[10px] font-bold">
                                    Sponsored
                                </Badge>
                            </div>
                            <div className="h-px bg-border pt-2" />
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Total to Pay</span>
                                <span className="font-bold text-xl">{asset.price} {asset.currency}</span>
                            </div>
                        </div>

                        {/* Error Display */}
                        {stage === "error" && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription className="text-xs">{error || "Transaction failed. Please try again."}</AlertDescription>
                            </Alert>
                        )}

                        <div className="bg-amber-500/5 border border-amber-500/10 rounded-lg p-3">
                            <p className="text-[11px] text-amber-600 font-medium leading-tight text-center">
                                You are interacting with the Medialane Beta Marketplace.
                            </p>
                        </div>

                        <DialogFooter>
                            <Button variant="ghost" onClick={() => setOpen(false)} disabled={stage === "processing"}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handlePurchase}
                                disabled={stage === "processing" || !asset.listing}
                                className="min-w-[140px]"
                            >
                                {stage === "processing" ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <ShoppingBag className="mr-2 h-4 w-4" />
                                        Buy Now
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
