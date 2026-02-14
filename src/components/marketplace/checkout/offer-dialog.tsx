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
import { AVNU_PAYMASTER_CONFIG } from "@/lib/constants"

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

        // Construct Offer Parameters (Reverse of Listing)
        // Offer: ERC20 (User gives)
        // Consideration: NFT (User wants)

        const now = Math.floor(Date.now() / 1000)
        // Parse expiration string to seconds
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

        // Currency (ERC20)
        const currencySymbol = asset.currency || "USDC"
        const currencyConfig = AVNU_PAYMASTER_CONFIG.SUPPORTED_GAS_TOKENS.find(t => t.symbol === currencySymbol)
        const currencyAddress = currencyConfig?.address || AVNU_PAYMASTER_CONFIG.SUPPORTED_GAS_TOKENS[0].address

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

        await createListing(orderParameters) // reused for Offer creation (same register_order)
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
            <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none shadow-2xl bg-transparent sm:rounded-2xl">
                {/* Main Content Container with Subtle Glassmorphism */}
                <div className="relative bg-background/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-2xl overflow-hidden">

                    {/* Vivid Top Gradient Accent - Animated Outrun */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-outrun-cyan via-outrun-magenta to-outrun-orange bg-[length:200%_100%] animate-gradient-x" />

                    <VisuallyHidden>
                        <DialogTitle>Make an Offer</DialogTitle>
                    </VisuallyHidden>

                    {stage === "success" ? (
                        <div className="p-8 flex flex-col items-center text-center">
                            <div className="mb-6 relative">
                                <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full animate-pulse-slow"></div>
                                <div className="relative bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full p-4 shadow-lg shadow-cyan-500/30 text-white">
                                    <CheckCircle2 className="h-10 w-10" />
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-blue-400 mb-2">
                                Offer Submitted!
                            </h2>

                            <p className="text-muted-foreground mb-8">
                                Your offer of <span className="font-semibold text-foreground">{offerAmount} {asset.currency}</span> is now live.
                            </p>

                            <div className="w-full bg-muted/50 rounded-xl p-4 border border-border/50 mb-8 text-sm">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-muted-foreground">Expires In</span>
                                    <span className="font-medium text-foreground">{EXPIRATION_OPTIONS.find(o => o.value === expiration)?.label}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Transaction</span>
                                    <Link href={`https://starkscan.co/tx/${txHash}`} target="_blank" className="flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors">
                                        <span className="font-mono text-xs">{txHash ? `${txHash.slice(0, 8)}...${txHash.slice(-6)}` : ""}</span>
                                        <ExternalLink className="w-3 h-3" />
                                    </Link>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 w-full">
                                <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1 rounded-xl h-11">
                                    Close
                                </Button>
                                <Link href={`/portfolio/offers`} className="flex-1">
                                    <Button className="w-full rounded-xl h-11 gradient-vivid-accent border-0">
                                        View Offers
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ) : stage === "processing" ? (
                        <div className="p-12 flex flex-col items-center text-center justify-center min-h-[400px]">
                            <div className="relative mb-6">
                                <div className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full"></div>
                                <Loader2 className="relative h-16 w-16 animate-spin text-cyan-500" />
                            </div>

                            <h2 className="text-xl font-bold mb-2">Submitting Strategy</h2>
                            <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-8">
                                Processing your offer on the blockchain. Your funds will be securely escrowed.
                            </p>

                            <div className="flex items-center gap-2 text-xs text-muted-foreground/80 bg-muted/50 px-3 py-1.5 rounded-full">
                                <Shield className="w-3 h-3" />
                                <span>Verified Transaction</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="p-6 pb-0">
                                <div className="flex items-start gap-5">
                                    <div className="relative group shrink-0">
                                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                                        <div className="relative h-24 w-24 rounded-xl overflow-hidden border border-border shadow-sm">
                                            <img src={asset.image} alt={asset.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        </div>
                                    </div>

                                    <div className="pt-1 min-w-0 flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <Badge variant="secondary" className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20 text-[10px] items-center gap-1 px-2">
                                                <TrendingUp className="w-3 h-3" />
                                                High Demand
                                            </Badge>
                                            <div className="text-right">
                                                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Floor</p>
                                                <p className="text-xs font-bold">{floorPrice} {asset.currency}</p>
                                            </div>
                                        </div>
                                        <h2 className="text-xl font-bold truncate pr-2 mb-1">{asset.name}</h2>
                                        <p className="text-sm text-muted-foreground truncate font-medium">{asset.collectionName}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Offer Form */}
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="offer-amount" className="text-sm font-semibold text-foreground/80">Your Offer Amount</Label>
                                        <div className="relative group">
                                            <Input
                                                id="offer-amount"
                                                type="number"
                                                placeholder="0.00"
                                                value={offerAmount}
                                                onChange={(e) => setOfferAmount(e.target.value)}
                                                className="h-14 pl-4 pr-20 text-xl font-bold bg-muted/30 border-border/60 focus:bg-background focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all rounded-xl"
                                            />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <Badge variant="outline" className="bg-background/50 backdrop-blur-sm px-2 py-1 h-7 text-xs font-medium">
                                                    {asset.currency}
                                                </Badge>
                                            </div>
                                        </div>
                                        {offerAmount && parseFloat(offerAmount) < parseFloat(floorPrice) && (
                                            <div className="flex items-center gap-1.5 text-amber-500 text-xs font-medium px-1 animate-in fade-in slide-in-from-top-1">
                                                <Info className="h-3.5 w-3.5" />
                                                <span>Below floor price ({floorPrice} {asset.currency})</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                                            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                                            Offer Expiration
                                        </Label>
                                        <div className="grid grid-cols-5 gap-2">
                                            {EXPIRATION_OPTIONS.map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => setExpiration(option.value)}
                                                    type="button"
                                                    className={cn(
                                                        "py-2 px-1 rounded-lg text-xs font-medium transition-all duration-200 border",
                                                        expiration === option.value
                                                            ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30 shadow-sm scale-[1.02]"
                                                            : "bg-muted/30 text-muted-foreground border-transparent hover:bg-muted hover:text-foreground"
                                                    )}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Info Card */}
                                <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-3 flex gap-3 items-start">
                                    <div className="p-1.5 bg-blue-500/10 rounded-full shrink-0 mt-0.5">
                                        <Shield className="w-3.5 h-3.5 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-foreground/90 mb-0.5">Escrow Protection</p>
                                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                                            Your offer amount will be securely locked in the smart contract until accepted, expired, or cancelled.
                                        </p>
                                    </div>
                                </div>

                                {stage === "error" && (
                                    <Alert variant="destructive" className="animate-in fade-in zoom-in-95 duration-200">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>Error</AlertTitle>
                                        <AlertDescription>{error || "Offer failed. Please try again."}</AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            <DialogFooter className="p-6 pt-0 sm:justify-between gap-3 bg-muted/10">
                                <Button
                                    variant="ghost"
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 rounded-xl h-12 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSubmitOffer}
                                    disabled={!offerAmount}
                                    className="flex-[2] rounded-xl h-12 gradient-vivid-accent border-0 font-semibold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
                                >
                                    <HandCoins className="w-4 h-4 mr-2" />
                                    Submit Offer
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
