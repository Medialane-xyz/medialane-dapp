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
import { ItemType } from "@/types/marketplace"
import { useAccount } from "@starknet-react/core"
import { SUPPORTED_TOKENS, EXPLORER_URL } from "@/lib/constants"
import { useTokenMetadata } from "@/hooks/use-token-metadata"

export function OfferDialog({ trigger, asset, isOpen: controlledOpen, onOpenChange: setControlledOpen }: OfferDialogProps) {
    const { address } = useAccount()
    const { createListing, isProcessing, txHash, error, resetState } = useMarketplace()
    const { metadata: metadataRaw } = { metadata: useTokenMetadata(asset.tokenId, asset.nftAddress) }
    const { name: mName, image: mImage, loading: isLoadingMetadata } = metadataRaw

    const [internalOpen, setInternalOpen] = useState(false)
    const isOpen = controlledOpen ?? internalOpen
    const setIsOpen = setControlledOpen ?? setInternalOpen

    const [offerAmount, setOfferAmount] = useState("")
    const [expiration, setExpiration] = useState("7d")

    // Derived state
    const stage = txHash ? "success" : isProcessing ? "processing" : "form"

    // Use metadata if available
    const displayName = mName || asset.name
    const displayImage = mImage || asset.image
    const displayCollection = metadataRaw?.description ? asset.collectionName : asset.collectionName // Just keep existing collection for now

    const handleSubmitOffer = async () => {
        if (!offerAmount || parseFloat(offerAmount) <= 0) return
        if (!address) return

        const now = Math.floor(Date.now() / 1000)
        const startTime = now + 300 // 5 minutes in future
        const durationSeconds = {
            "1d": 86400,
            "3d": 259200,
            "7d": 604800,
            "14d": 1209600,
            "30d": 2592000
        }[expiration] || 604800

        const endTime = now + durationSeconds
        const salt = Math.floor(Math.random() * 1000000).toString()

        const currencySymbol = asset.currency || "USDC"
        const currencyConfig = SUPPORTED_TOKENS.find(t => t.symbol === currencySymbol)
        const currencyAddress = currencyConfig?.address || SUPPORTED_TOKENS[0].address

        const decimals = currencyConfig?.decimals || 6
        const priceWei = BigInt(Math.floor(parseFloat(offerAmount) * Math.pow(10, decimals))).toString()

        const orderParameters = {
            offerer: address,
            offer: {
                item_type: "ERC20",
                token: currencyAddress,
                identifier_or_criteria: "0",
                start_amount: priceWei,
                end_amount: priceWei
            },
            consideration: {
                item_type: "ERC721",
                token: asset.nftAddress,
                identifier_or_criteria: asset.tokenId,
                start_amount: "1",
                end_amount: "1",
                recipient: address
            },
            start_time: startTime.toString(),
            end_time: endTime.toString(),
            salt: salt,
        }

        await createListing(orderParameters)
    }

    const reset = () => {
        resetState()
        setOfferAmount("")
        setExpiration("7d")
    }

    const floorPrice = asset.floorPrice

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open)
            if (!open) {
                setTimeout(reset, 300)
            }
        }}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden bg-card border-none shadow-2xl">
                <div className="p-6 space-y-6">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold tracking-tight">Make an Offer</DialogTitle>
                        <DialogDescription className="text-muted-foreground/80">
                            Create a binding offer for this digital asset.
                        </DialogDescription>
                    </DialogHeader>

                    {stage === "success" ? (
                        <div className="py-2 flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in duration-300">
                            <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="h-10 w-10 text-primary" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold tracking-tight text-foreground">Offer Live!</h2>
                                <p className="text-sm text-muted-foreground max-w-[280px]">
                                    Your offer of <span className="font-semibold text-foreground">{offerAmount} {asset.currency}</span> has been broadcast to the network.
                                </p>
                            </div>

                            <div className="w-full bg-muted/30 rounded-xl p-4 border border-border/50 space-y-3 text-sm">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-muted-foreground uppercase font-semibold">Expires In</span>
                                    <span className="font-medium text-foreground">{EXPIRATION_OPTIONS.find(o => o.value === expiration)?.label}</span>
                                </div>
                                <Separator className="bg-border/30" />
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-muted-foreground uppercase font-semibold">Transaction</span>
                                    <Link
                                        href={`${EXPLORER_URL}/tx/${txHash}`}
                                        target="_blank"
                                        className="flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors"
                                    >
                                        <span className="font-mono">{txHash ? `${txHash.slice(0, 10)}...` : ""}</span>
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 w-full pt-2">
                                <Button
                                    className="w-full font-semibold"
                                    asChild
                                >
                                    <Link href="/portfolio/assets">
                                        View in Portfolio
                                    </Link>
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full text-muted-foreground"
                                >
                                    Dismiss
                                </Button>
                            </div>
                        </div>
                    ) : stage === "processing" ? (
                        <div className="py-12 flex flex-col items-center text-center space-y-6 animate-in fade-in duration-300">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                                <Loader2 className="h-12 w-12 animate-spin text-primary relative z-10" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-xl font-bold tracking-tight">Processing Offer</h2>
                                <p className="text-sm text-muted-foreground max-w-[260px] mx-auto">
                                    Approving & registering your offer on-chain. Please confirm the transaction in your wallet.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
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
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{displayCollection}</p>
                                        {floorPrice && (
                                            <p className="text-[10px] font-bold text-primary/80">FLOOR: {floorPrice} {asset.currency}</p>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-foreground truncate">{displayName}</h3>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <Badge variant="outline" className="text-[9px] h-4 py-0 font-medium bg-background/50">#{asset.tokenId}</Badge>
                                        <span className="text-[10px] text-muted-foreground/60 font-medium">Verified IP</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2.5">
                                    <Label htmlFor="offer-amount" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 flex justify-between">
                                        Amount
                                        {offerAmount && floorPrice && parseFloat(offerAmount) < parseFloat(floorPrice) && (
                                            <span className="text-amber-500 font-bold lowercase flex items-center gap-1">
                                                <Info className="h-3 w-3" />
                                                below floor
                                            </span>
                                        )}
                                    </Label>
                                    <div className="relative group">
                                        <Input
                                            id="offer-amount"
                                            type="number"
                                            placeholder="0.00"
                                            value={offerAmount}
                                            onChange={(e) => setOfferAmount(e.target.value)}
                                            className="h-14 pl-4 pr-16 text-xl font-bold bg-muted/20 border-border/50 focus:border-primary/50 transition-all rounded-xl"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                            <span className="text-sm font-black text-muted-foreground/60 select-none">
                                                {asset.currency}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2.5">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5" />
                                        Expiration
                                    </Label>
                                    <div className="grid grid-cols-5 gap-1.5">
                                        {EXPIRATION_OPTIONS.map((option) => (
                                            <Button
                                                key={option.value}
                                                variant={expiration === option.value ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setExpiration(option.value)}
                                                className={cn(
                                                    "h-9 text-[10px] font-bold uppercase tracking-tight rounded-lg transition-all",
                                                    expiration === option.value ? "shadow-md bg-primary" : "bg-muted/30 border-border/50 hover:bg-muted/50"
                                                )}
                                            >
                                                {option.label}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex gap-3 shadow-inner">
                                <Shield className="w-4 h-4 text-primary shrink-0 mt-0.5 opacity-80" />
                                <div className="space-y-1">
                                    <p className="text-[11px] font-bold text-foreground/80">On-Chain Binding</p>
                                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                                        Your offer remains valid until it expires or is cancelled. Only the amount specified will be transferable from your wallet.
                                    </p>
                                </div>
                            </div>

                            {error && (
                                <Alert className="bg-destructive/10 border-destructive/20 text-destructive animate-in shake-in-1 duration-300">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription className="text-xs font-medium ml-2">{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="flex items-center gap-3 pt-2">
                                <Button
                                    variant="ghost"
                                    onClick={() => setIsOpen(false)}
                                    disabled={isProcessing}
                                    className="flex-1 font-semibold text-muted-foreground"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSubmitOffer}
                                    disabled={!offerAmount || isProcessing}
                                    className="flex-[2] h-12 font-bold shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 transition-all active:scale-[0.98]"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Confirming...
                                        </>
                                    ) : (
                                        <>
                                            <HandCoins className="w-4 h-4 mr-2" />
                                            Place Offer
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
