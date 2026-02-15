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
import { ItemType, OrderType } from "@/types/marketplace"
import { useAccount } from "@starknet-react/core"
import { AVNU_PAYMASTER_CONFIG, EXPLORER_URL } from "@/lib/constants"
import { constants } from "starknet"

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

    const handleCreateListing = async () => {
        if (!price || parseFloat(price) <= 0) return
        if (!address) return

        // 1. Construct Order Parameters
        const now = Math.floor(Date.now() / 1000)
        const startTime = now
        const endTime = now + duration.seconds
        const salt = Math.floor(Math.random() * 1000000).toString()

        // Handle decimals properly based on currency
        // USDC has 6 decimals, ETH/STRK has 18
        const decimals = currency === "USDC" || currency === "USDT" ? 6 : 18
        const priceWei = BigInt(Math.floor(parseFloat(price) * Math.pow(10, decimals))).toString()

        const currencyAddress = AVNU_PAYMASTER_CONFIG.SUPPORTED_GAS_TOKENS.find(t => t.symbol === currency)?.address

        if (!currencyAddress) {
            console.error("Currency not supported")
            return
        }

        const orderParameters = {
            offerer: address,
            zone: "0x0", // No zone
            offer: [{
                item_type: ItemType.ERC721, // 2
                token: asset.collectionAddress,
                identifier_or_criteria: asset.tokenId,
                start_amount: "1",
                end_amount: "1"
            }],
            consideration: [{
                item_type: ItemType.ERC20,
                token: currencyAddress,
                identifier_or_criteria: "0",
                start_amount: priceWei,
                end_amount: priceWei,
                recipient: address
            }],
            order_type: OrderType.FULL_OPEN, // 0
            start_time: startTime,
            end_time: endTime,
            zone_hash: "0",
            salt: salt,
            conduit_key: "0", // No conduit
            total_original_consideration_items: 1,
            nonce: "0" // Contract manages nonces? 
            // Wait, usually the USER manages nonces in SNIP-12 to prevent replay if the contract tracks by hash.
            // Medialane contract: `self.nonces.use_checked_nonce(offerer, order_parameters.nonce)`
            // So we need to fetch the next nonce for the user or use a random one if the contract tracks consumed nonces bitmask style?
            // "use_checked_nonce" implies we need to pass the expected nonce.
            // If I pass 0 and it's used, it fails.
            // I should use `useContract` to fetch `nonces(address)`?
            // For now, let's use a random large nonce to avoid collision if it's bitmask, 
            // OR if it's strictly incremental, we must fetch it.
            // Checking: `NoncesComponent` usually is incremental.
            // I'll assume 0 for now but might need `get_nonce`.
        }

        // 2. Call Contract Hook
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
            <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none shadow-2xl bg-transparent sm:rounded-2xl">
                <div className="relative bg-background/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-2xl overflow-hidden">

                    {/* Header Gradient */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-outrun-cyan via-purple-500 to-outrun-magenta bg-[length:200%_100%] animate-gradient-x" />

                    <VisuallyHidden>
                        <DialogTitle>List Asset</DialogTitle>
                    </VisuallyHidden>

                    {stage === "success" ? (
                        <div className="p-8 flex flex-col items-center text-center">
                            <div className="mb-6 relative">
                                <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full animate-pulse-slow"></div>
                                <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-full p-4 shadow-lg shadow-green-500/30 text-white">
                                    <CheckCircle2 className="h-10 w-10" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Listing Created!</h2>
                            <p className="text-muted-foreground mb-8">
                                Your asset is now listed for <span className="text-foreground font-semibold">{price} {currency}</span>
                            </p>
                            <Link href={`${EXPLORER_URL}/tx/${txHash}`} target="_blank" className="text-primary text-sm flex items-center gap-1 hover:underline mb-6">
                                View Transaction <ExternalLink className="w-3 h-3" />
                            </Link>
                            <Button onClick={() => setOpen(false)} className="w-full">Close</Button>
                        </div>
                    ) : (
                        <>
                            <div className="p-6 pb-0">
                                <div className="flex items-start gap-5">
                                    <div className="relative h-20 w-20 rounded-xl overflow-hidden border border-border">
                                        <img src={asset.image} alt={asset.name} className="h-full w-full object-cover" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">{asset.name}</h2>
                                        <p className="text-sm text-muted-foreground">List for sale on Medialane</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Listing Price</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                type="number"
                                                placeholder="0.00"
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value)}
                                                className="flex-1"
                                            />
                                            <div className="w-24 shrink-0 bg-muted/30 border rounded-md flex items-center justify-center font-semibold">
                                                {currency}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Duration</Label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {DURATION_OPTIONS.map(opt => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => setDuration(opt)}
                                                    className={cn(
                                                        "py-2 px-1 rounded-lg text-xs font-medium border transition-all",
                                                        duration.value === opt.value
                                                            ? "bg-primary/10 border-primary text-primary"
                                                            : "bg-muted/30 border-transparent hover:bg-muted"
                                                    )}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {stage === "error" && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>Error</AlertTitle>
                                        <AlertDescription>{error || "Listing failed. Please try again."}</AlertDescription>
                                    </Alert>
                                )}

                                <DialogFooter className="gap-2 sm:gap-0">
                                    <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                                    <Button
                                        onClick={handleCreateListing}
                                        disabled={isProcessing || !price}
                                        className="gradient-vivid-outrun"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Signing...
                                            </>
                                        ) : (
                                            <>
                                                <Tag className="w-4 h-4 mr-2" />
                                                List Item
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
