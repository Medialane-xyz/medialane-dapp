"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Loader2,
    AlertCircle,
    Tag,
    Clock,
    CheckCircle2,
    ExternalLink,
    Store
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { cn } from "@/lib/utils"
import { useMarketplace } from "@/hooks/use-marketplace"
import { ItemType } from "@/types/marketplace"
import { useAccount } from "@starknet-react/core"
import { SUPPORTED_TOKENS, EXPLORER_URL } from "@/lib/constants"
import { constants } from "starknet"
import { DebugSignature } from "@/components/debug/debug-signature"

interface ListingDialogProps {
    trigger?: React.ReactNode
    asset: {
        id: string // contract-tokenId
        name: string
        image: string
        collectionAddress: string
        tokenId: string
    }
    isOpen?: boolean
    onOpenChange?: (open: boolean) => void
}

const DURATION_OPTIONS = [
    { value: "1d", label: "1 Day", seconds: 86400 },
    { value: "7d", label: "7 Days", seconds: 604800 },
    { value: "30d", label: "30 Days", seconds: 2592000 },
    { value: "180d", label: "6 Months", seconds: 15552000 },
]

export function ListingDialog({ trigger, asset }: ListingDialogProps) {
    const { address } = useAccount()
    const { createListing, isProcessing, txHash, error, resetState } = useMarketplace()

    const [open, setOpen] = useState(false)
    const [price, setPrice] = useState("")
    const [currency, setCurrency] = useState("USDC")
    const [duration, setDuration] = useState(DURATION_OPTIONS[2]) // Default 30 days

    // Derived state
    const stage = txHash ? "success" : isProcessing ? "processing" : error ? "error" : "input"

    // Generate Order Params for Submitting
    const getOrderParameters = () => {
        if (!price || parseFloat(price) <= 0 || !address) return null;

        const now = Math.floor(Date.now() / 1000)
        const startTime = now - 60
        const endTime = now + duration.seconds
        const salt = Math.floor(Math.random() * 1000000).toString()

        const decimals = currency === "USDC" || currency === "USDT" ? 6 : 18
        const priceWei = BigInt(Math.floor(parseFloat(price) * Math.pow(10, decimals))).toString()

        const currencyAddress = SUPPORTED_TOKENS.find(t => t.symbol === currency)?.address

        if (!currencyAddress) return null;

        return {
            offerer: address,
            offer: {
                item_type: ItemType.ERC721,
                token: asset.collectionAddress,
                identifier_or_criteria: asset.tokenId,
                start_amount: "1",
                end_amount: "1"
            },
            consideration: {
                item_type: ItemType.ERC20,
                token: currencyAddress,
                identifier_or_criteria: "0",
                start_amount: priceWei,
                end_amount: priceWei,
                recipient: address
            },
            start_time: startTime,
            end_time: endTime,
            salt: salt,
            nonce: "0"
        }
    }

    const debugParams = getOrderParameters();

    const handleCreateListing = async () => {
        const orderParameters = getOrderParameters();
        if (!orderParameters) return;
        await createListing(orderParameters)
    }

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) {
            setTimeout(() => {
                resetState()
                setPrice("")
            }, 300)
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="sm:max-w-[440px]">
                <DialogHeader>
                    <DialogTitle>List Asset for Sale</DialogTitle>
                </DialogHeader>

                {stage === "success" ? (
                    <div className="py-6 flex flex-col items-center text-center space-y-4">
                        <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="h-10 w-10 text-primary" />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold">Listing Created!</h2>
                            <p className="text-sm text-muted-foreground">
                                Your asset is now listed for <span className="font-medium text-foreground">{price} {currency}</span>
                            </p>
                        </div>
                        <Link href={`${EXPLORER_URL}/tx/${txHash}`} target="_blank" className="text-primary text-sm flex items-center gap-1 hover:underline">
                            View Transaction <ExternalLink className="w-3 h-3" />
                        </Link>
                        <Button onClick={() => setOpen(false)} className="w-full mt-2">Close</Button>
                    </div>
                ) : (
                    <div className="space-y-6 pt-2">
                        <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 border">
                            <div className="h-16 w-16 rounded-md overflow-hidden border bg-background">
                                <img src={asset.image} alt={asset.name} className="h-full w-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold truncate">{asset.name}</h3>
                                <p className="text-xs text-muted-foreground">Medialane Marketplace</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="listing-price">Listing Price</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="listing-price"
                                        type="number"
                                        placeholder="0.00"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        className="flex-1"
                                    />
                                    <div className="w-24 shrink-0 px-3 bg-muted border rounded-md flex items-center justify-center text-sm font-medium">
                                        {currency}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Duration</Label>
                                <div className="grid grid-cols-4 gap-2">
                                    {DURATION_OPTIONS.map(opt => (
                                        <Button
                                            key={opt.value}
                                            variant={duration.value === opt.value ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setDuration(opt)}
                                            className="h-9 text-xs"
                                        >
                                            {opt.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {stage === "error" && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription className="text-xs">{error || "Listing failed. Please try again."}</AlertDescription>
                            </Alert>
                        )}

                        <DialogFooter className="pt-2">
                            <Button variant="ghost" onClick={() => setOpen(false)} disabled={isProcessing}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCreateListing}
                                disabled={isProcessing || !price}
                                className="min-w-[120px]"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Tag className="w-4 h-4 mr-2" />
                                        Complete Listing
                                    </>
                                )}
                            </Button>
                        </DialogFooter>

                        <DebugSignature orderParams={debugParams} />
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
