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
        const startTime = 0
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
            start_time: 0,
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
            // Delay reset to avoid UI flicker during close animation
            setTimeout(() => {
                resetState()
                setPrice("")
            }, 300)
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden border-none bg-background shadow-2xl">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-xl font-bold tracking-tight">List for Sale</DialogTitle>
                </DialogHeader>

                {stage === "success" ? (
                    <div className="p-8 flex flex-col items-center text-center space-y-6">
                        <div className="h-20 w-20 bg-emerald-500/10 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold tracking-tight">Listing Live!</h2>
                            <p className="text-muted-foreground">
                                Your asset is now available for <span className="font-semibold text-foreground">{price} {currency}</span> on the marketplace.
                            </p>
                        </div>
                        <div className="w-full space-y-3 pt-2">
                            <Button asChild variant="outline" className="w-full">
                                <Link href={`${EXPLORER_URL}/tx/${txHash}`} target="_blank" className="flex items-center justify-center gap-2">
                                    View Transaction <ExternalLink className="w-4 h-4" />
                                </Link>
                            </Button>
                            <Button onClick={() => setOpen(false)} className="w-full h-11">Done</Button>
                        </div>
                    </div>
                ) : (
                    <div className="p-6 space-y-6">
                        {/* Compact Asset Preview */}
                        <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 border border-border/50">
                            <div className="h-14 w-14 rounded-lg overflow-hidden border bg-background shrink-0 shadow-sm">
                                <img src={asset.image} alt={asset.name} className="h-full w-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-sm truncate">{asset.name}</h3>
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Asset Listing</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="space-y-2.5">
                                <Label htmlFor="listing-price" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                                    Set Price
                                </Label>
                                <div className="relative group">
                                    <Input
                                        id="listing-price"
                                        type="number"
                                        placeholder="0.00"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        className="h-12 pl-4 pr-16 bg-muted/20 border-border focus:ring-1 focus:ring-primary/20 text-lg font-medium"
                                        disabled={isProcessing}
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-background border rounded-md text-xs font-bold shadow-sm">
                                        {currency}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                                    Listing Duration
                                </Label>
                                <div className="grid grid-cols-4 gap-2">
                                    {DURATION_OPTIONS.map(opt => (
                                        <Button
                                            key={opt.value}
                                            variant={duration.value === opt.value ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setDuration(opt)}
                                            className={cn(
                                                "h-10 text-xs font-medium transition-all",
                                                duration.value === opt.value ? "shadow-md scale-[1.02]" : "hover:bg-muted/50"
                                            )}
                                            disabled={isProcessing}
                                        >
                                            {opt.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {stage === "error" && (
                            <Alert variant="destructive" className="bg-destructive/5 border-destructive/20 py-3">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription className="text-xs font-medium pl-2">{error || "Listing failed. Please try again."}</AlertDescription>
                            </Alert>
                        )}

                        <div className="pt-2 flex flex-col gap-3">
                            <Button
                                onClick={handleCreateListing}
                                disabled={isProcessing || !price}
                                className="w-full h-12 text-sm font-bold tracking-wide shadow-lg shadow-primary/10 transition-all hover:scale-[1.01]"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Confirming Order...
                                    </>
                                ) : (
                                    <>
                                        <Tag className="w-4 h-4 mr-2" />
                                        Complete Listing
                                    </>
                                )}
                            </Button>

                            <p className="text-[10px] text-center text-muted-foreground px-4 leading-relaxed">
                                Listing is free. You will be prompted to sign a message and approve the asset for sale in one atomic transaction.
                            </p>
                        </div>

                        {/* Debug Toggle (optional, keeping it for now but making it more subtle) */}
                        <div className="opacity-0 hover:opacity-100 transition-opacity">
                            <DebugSignature orderParams={debugParams} />
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

