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
import { Loader2, AlertCircle, CheckCircle2, ShoppingBag, ExternalLink } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { useMarketplace } from "@/hooks/use-marketplace"
import { Listing, Fulfillment } from "@/types/marketplace"
import { EXPLORER_URL } from "@/lib/constants"

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

    // Derived state from hook
    const stage = txHash ? "success" : isProcessing ? "processing" : error ? "error" : "review"

    const handlePurchase = async () => {
        if (!asset.listing) {
            console.error("No listing data available for purchase")
            return
        }

        // Mock fulfillment params for NOW until we parse listing
        // In reality, we need to construct Fulfillment struct
        // Fulfillment = { fulfiller: USER, order_hash: listing.orderHash, nonce: random }

        // TODO: Get nonce from contract if needed or generate random
        const fulfillment: Fulfillment = {
            fulfiller: "0x0", // Hook will override with current address
            order_hash: asset.listing.orderHash || "0x0",
            nonce: "0"
        }

        await buyItem(asset.listing.parameters, fulfillment)
    }

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) {
            // Reset state on close
            setTimeout(() => {
                resetState()
            }, 300)
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="sm:max-w-[425px] border-none shadow-2xl bg-transparent sm:rounded-2xl p-0 overflow-hidden">
                <div className="relative bg-background/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-2xl overflow-hidden">

                    {/* Header Gradient */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-outrun-cyan via-purple-500 to-outrun-magenta bg-[length:200%_100%] animate-gradient-x" />

                    <VisuallyHidden>
                        <DialogTitle>Confirm Purchase</DialogTitle>
                    </VisuallyHidden>

                    {stage === "success" ? (
                        <div className="p-8 flex flex-col items-center text-center">
                            <div className="mb-6 relative">
                                <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full animate-pulse-slow"></div>
                                <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-full p-4 shadow-lg shadow-green-500/30 text-white">
                                    <CheckCircle2 className="h-10 w-10" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Purchase Successful!</h2>
                            <p className="text-muted-foreground mb-8">
                                You have successfully purchased <span className="text-foreground font-semibold">{asset.name}</span>
                            </p>
                            <Link href={`${EXPLORER_URL}/tx/${txHash}`} target="_blank" className="text-primary text-sm flex items-center gap-1 hover:underline mb-6">
                                View Transaction <ExternalLink className="w-3 h-3" />
                            </Link>
                            <Button onClick={() => setOpen(false)} className="w-full">Close</Button>
                        </div>
                    ) : (
                        <>
                            <div className="p-6 pb-0">
                                <h2 className="text-2xl font-bold mb-1">Confirm Purchase</h2>
                                <p className="text-sm text-muted-foreground">Review transaction details</p>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Asset Preview */}
                                <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-xl border border-border/50">
                                    <div className="h-16 w-16 rounded-lg overflow-hidden bg-muted relative shrink-0">
                                        <img src={asset.image} alt={asset.name} className="object-cover h-full w-full" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs text-muted-foreground truncate">{asset.collectionName}</p>
                                        <h3 className="font-semibold truncate">{asset.name}</h3>
                                    </div>
                                </div>

                                {/* Price Details */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">Price</span>
                                        <span className="font-medium">{asset.price} {asset.currency}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">Network Fee</span>
                                        <span className="text-green-500 font-medium text-xs bg-green-500/10 px-2 py-0.5 rounded-full">Sponsored</span>
                                    </div>
                                    <div className="h-px bg-border/50 my-2" />
                                    <div className="flex justify-between items-center font-bold text-lg">
                                        <span>Total</span>
                                        <span>{asset.price} {asset.currency}</span>
                                    </div>
                                </div>

                                {/* Error Display */}
                                {stage === "error" && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>Error</AlertTitle>
                                        <AlertDescription>{error || "Transaction failed. Please try again."}</AlertDescription>
                                    </Alert>
                                )}

                                {stage !== "error" && (
                                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-xs text-yellow-600 dark:text-yellow-400">
                                        <p><strong>Note:</strong> You are interacting with the beta marketplace.</p>
                                    </div>
                                )}

                                <DialogFooter className="gap-2 sm:gap-0">
                                    <Button variant="ghost" onClick={() => setOpen(false)} disabled={stage === "processing"}>Cancel</Button>
                                    <Button
                                        className="gradient-vivid-primary text-white border-none shadow-lg shadow-purple-500/20"
                                        onClick={handlePurchase}
                                        disabled={stage === "processing" || !asset.listing} // Disable if no listing data
                                    >
                                        {stage === "processing" ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingBag className="mr-2 h-4 w-4" />
                                                Confirm Purchase
                                            </>
                                        )}
                                    </Button>
                                </DialogFooter>
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
