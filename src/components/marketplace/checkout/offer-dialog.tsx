"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
    Loader2,
    AlertCircle,
    HandCoins,
    Shield,
    CheckCircle2,
    ExternalLink,
    Clock,
    TrendingUp,
    Info,
    Sparkles
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { cn } from "@/lib/utils"

interface OfferDialogProps {
    trigger?: React.ReactNode
    asset: {
        id: string
        name: string
        floorPrice?: string
        currency: string
        image: string
        collectionName: string
        nftAddress: string
        tokenId: string
    }
    isOpen?: boolean
    onOpenChange?: (open: boolean) => void
}

const EXPIRATION_OPTIONS = [
    { value: "1d", label: "1 Day" },
    { value: "3d", label: "3 Days" },
    { value: "7d", label: "7 Days" },
    { value: "14d", label: "14 Days" },
    { value: "30d", label: "1 Month" },
]

import { useMarketplace } from "@/hooks/use-marketplace"
import { ItemType, OrderType } from "@/types/marketplace"
import { useAccount } from "@starknet-react/core"
import { SUPPORTED_TOKENS, EXPLORER_URL } from "@/lib/constants"

export function OfferDialog({ trigger, asset, isOpen: controlledOpen, onOpenChange: setControlledOpen }: OfferDialogProps) {
    const { address } = useAccount()
    const { createListing, isProcessing, txHash, error, resetState } = useMarketplace()

    const [internalOpen, setInternalOpen] = useState(false)
    const isOpen = controlledOpen ?? internalOpen
    const setIsOpen = setControlledOpen ?? setInternalOpen

    const [offerAmount, setOfferAmount] = useState("")
    const [expiration, setExpiration] = useState("7d")

    // Derived state
    const stage = txHash ? "success" : isProcessing ? "processing" : error ? "error" : "form"

    const handleSubmitOffer = async () => {
        if (!offerAmount || parseFloat(offerAmount) <= 0) return
        if (!address) return

        const now = Math.floor(Date.now() / 1000)
        const durationSeconds = {
            "1d": 86400,
            "3d": 259200,
            "7d": 604800,
            "14d": 1209600,
            "30d": 2592000
        }[expiration] || 604800

        const startTime = now
        const endTime = now + durationSeconds
        const salt = Math.floor(Math.random() * 1000000).toString()

        const currencySymbol = asset.currency || "USDC"
        const currencyConfig = SUPPORTED_TOKENS.find(t => t.symbol === currencySymbol)
        const currencyAddress = currencyConfig?.address || SUPPORTED_TOKENS[0].address

        const decimals = currencyConfig?.decimals || 18
        const priceWei = BigInt(Math.floor(parseFloat(offerAmount) * Math.pow(10, decimals))).toString()

        const orderParameters = {
            offerer: address,
            zone: "0x0",
            offer: [{
                item_type: ItemType.ERC20,
                token: currencyAddress,
                identifier_or_criteria: "0",
                start_amount: priceWei,
                end_amount: priceWei
            }],
            consideration: [{
                item_type: ItemType.ERC721,
                token: asset.nftAddress,
                identifier_or_criteria: asset.tokenId,
                start_amount: "1",
                end_amount: "1",
                recipient: address
            }],
            order_type: OrderType.FULL_OPEN,
            start_time: startTime,
            end_time: endTime,
            zone_hash: "0",
            salt: salt,
            conduit_key: "0",
            total_original_consideration_items: 1,
            nonce: "0"
        }

        await createListing(orderParameters)
    }

    const reset = () => {
        resetState()
        setOfferAmount("")
        setExpiration("7d")
    }

    const floorPrice = asset.floorPrice || "0.45"

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open)
            if (!open) {
                setTimeout(reset, 300)
            }
        }}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="sm:max-w-[440px]">
                <DialogHeader>
                    <DialogTitle>Make an Offer</DialogTitle>
                    <DialogDescription>
                        Place a bid for this asset.
                    </DialogDescription>
                </DialogHeader>

                {stage === "success" ? (
                    <div className="py-6 flex flex-col items-center text-center space-y-4">
                        <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="h-10 w-10 text-primary" />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold">Offer Submitted!</h2>
                            <p className="text-sm text-muted-foreground text-center">
                                Your offer of <span className="font-semibold text-foreground">{offerAmount} {asset.currency}</span> is now live.
                            </p>
                        </div>

                        <div className="w-full bg-muted/50 rounded-lg p-4 border space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Expires In</span>
                                <span className="font-medium">{EXPIRATION_OPTIONS.find(o => o.value === expiration)?.label}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Transaction</span>
                                <Link href={`${EXPLORER_URL}/tx/${txHash}`} target="_blank" className="flex items-center gap-1 text-primary hover:underline">
                                    <span className="font-mono text-xs">{txHash ? `${txHash.slice(0, 8)}...` : ""}</span>
                                    <ExternalLink className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 w-full pt-2">
                            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
                                Close
                            </Button>
                            <Link href={`/portfolio/offers`} className="flex-1">
                                <Button className="w-full">
                                    View My Offers
                                </Button>
                            </Link>
                        </div>
                    </div>
                ) : stage === "processing" ? (
                    <div className="py-12 flex flex-col items-center text-center space-y-4">
                        <div className="relative">
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-lg font-bold">Submitting Offer</h2>
                            <p className="text-sm text-muted-foreground max-w-[280px]">
                                Processing your offer on the blockchain. Your funds will be securely escrowed.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 pt-2">
                        <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 border">
                            <div className="h-16 w-16 rounded-md overflow-hidden border bg-background shrink-0">
                                <img src={asset.image} alt={asset.name} className="h-full w-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                    <Badge variant="outline" className="text-[10px] uppercase tracking-wider py-0 px-1.5 h-4">
                                        Collection
                                    </Badge>
                                    <div className="text-right shrink-0">
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Floor</p>
                                        <p className="text-xs font-bold">{floorPrice} {asset.currency}</p>
                                    </div>
                                </div>
                                <h3 className="font-bold truncate">{asset.name}</h3>
                                <p className="text-xs text-muted-foreground truncate">{asset.collectionName}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="offer-amount">Your Offer Amount</Label>
                                <div className="relative">
                                    <Input
                                        id="offer-amount"
                                        type="number"
                                        placeholder="0.00"
                                        value={offerAmount}
                                        onChange={(e) => setOfferAmount(e.target.value)}
                                        className="h-12 pl-4 pr-16 text-lg font-semibold"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <span className="text-sm font-bold text-muted-foreground">
                                            {asset.currency}
                                        </span>
                                    </div>
                                </div>
                                {offerAmount && parseFloat(offerAmount) < parseFloat(floorPrice) && (
                                    <p className="text-[11px] text-amber-600 font-medium flex items-center gap-1 px-1">
                                        <Info className="h-3 w-3" />
                                        Below floor price
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm flex items-center gap-2">
                                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                                    Offer Expiration
                                </Label>
                                <div className="grid grid-cols-5 gap-2">
                                    {EXPIRATION_OPTIONS.map((option) => (
                                        <Button
                                            key={option.value}
                                            variant={expiration === option.value ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setExpiration(option.value)}
                                            className="h-9 text-xs px-1"
                                        >
                                            {option.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 flex gap-3">
                            <Shield className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <p className="text-[11px] text-muted-foreground leading-snug">
                                Your offer will be securely locked in the smart contract. You can cancel it at any time.
                            </p>
                        </div>

                        {stage === "error" && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription className="text-xs">{error || "Offer failed. Please try again."}</AlertDescription>
                            </Alert>
                        )}

                        <DialogFooter className="pt-2">
                            <Button
                                variant="ghost"
                                onClick={() => setIsOpen(false)}
                                disabled={isProcessing}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmitOffer}
                                disabled={!offerAmount || isProcessing}
                                className="min-w-[140px]"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <HandCoins className="w-4 h-4 mr-2" />
                                        Submit Offer
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
