"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
    Loader2,
    AlertCircle,
    HandCoins,
    Wallet,
    Shield,
    Check,
    ExternalLink,
    Clock,
    TrendingUp,
    Info
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

interface OfferDialogProps {
    trigger?: React.ReactNode
    asset: {
        id: string
        name: string
        floorPrice?: string
        currency: string
        image: string
        collectionName: string
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

export function OfferDialog({ trigger, asset, isOpen: controlledOpen, onOpenChange: setControlledOpen }: OfferDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false)
    const isOpen = controlledOpen ?? internalOpen
    const setIsOpen = setControlledOpen ?? setInternalOpen

    const [stage, setStage] = useState<"form" | "processing" | "success" | "error">("form")
    const [errorMsg, setErrorMsg] = useState("")
    const [offerAmount, setOfferAmount] = useState("")
    const [expiration, setExpiration] = useState("7d")
    const [txHash, setTxHash] = useState("")

    const handleSubmitOffer = async () => {
        if (!offerAmount || parseFloat(offerAmount) <= 0) {
            setErrorMsg("Please enter a valid offer amount")
            setStage("error")
            return
        }

        setStage("processing")
        setErrorMsg("")

        try {
            // Mock transaction delay
            await new Promise(resolve => setTimeout(resolve, 2000))

            // Success state
            setTxHash("0x07c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6")
            setStage("success")
        } catch (err) {
            console.error(err)
            setErrorMsg("Failed to submit offer. Please try again.")
            setStage("error")
        }
    }

    const reset = () => {
        setStage("form")
        setErrorMsg("")
        setOfferAmount("")
        setExpiration("7d")
        setTxHash("")
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
            <DialogContent className="sm:max-w-lg p-0 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border-white/10 shadow-2xl">
                <AnimatePresence mode="wait">
                    {stage === "success" ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="p-8"
                        >
                            {/* Success State */}
                            <div className="flex flex-col items-center text-center space-y-6">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", duration: 0.6, delay: 0.1 }}
                                    className="w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-full flex items-center justify-center border-2 border-green-500/30 shadow-lg shadow-green-500/10"
                                >
                                    <Check className="w-12 h-12 text-green-400" />
                                </motion.div>

                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold text-white">Offer Submitted!</h2>
                                    <p className="text-slate-400 max-w-xs mx-auto">
                                        Your offer of <span className="font-semibold text-white">{offerAmount} {asset.currency}</span> for{" "}
                                        <span className="font-semibold text-white">{asset.name}</span> has been submitted.
                                    </p>
                                </div>

                                <div className="w-full bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-400">Offer Amount</span>
                                        <span className="font-semibold text-white">{offerAmount} {asset.currency}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-400">Expires In</span>
                                        <span className="text-slate-300">{EXPIRATION_OPTIONS.find(o => o.value === expiration)?.label}</span>
                                    </div>
                                    <Separator className="bg-slate-700/50" />
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-400">Transaction</span>
                                        <div className="flex items-center gap-2">
                                            <code className="text-xs text-slate-300 bg-slate-700/50 px-2 py-1 rounded">
                                                {txHash.slice(0, 8)}...{txHash.slice(-6)}
                                            </code>
                                            <Link href={`https://starkscan.co/tx/${txHash}`} target="_blank" className="text-blue-400 hover:text-blue-300">
                                                <ExternalLink className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 w-full pt-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsOpen(false)}
                                        className="border-slate-600 hover:bg-slate-800 text-slate-300"
                                    >
                                        Close
                                    </Button>
                                    <Link href={`/portfolio/offers`} className="w-full">
                                        <Button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white">
                                            View My Offers
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {/* Header with Asset Preview */}
                            <div className="relative h-32 overflow-hidden">
                                <div
                                    className="absolute inset-0 bg-cover bg-center blur-xl opacity-50"
                                    style={{ backgroundImage: `url(${asset.image})` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900" />
                                <div className="relative h-full flex items-end pb-4 px-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white/20 shadow-xl flex-shrink-0">
                                            <img
                                                src={asset.image}
                                                alt={asset.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-white">{asset.name}</h3>
                                            <p className="text-sm text-slate-400">{asset.collectionName}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-6">
                                {/* Floor Price Reference */}
                                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                                            <TrendingUp className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">Floor Price</p>
                                            <p className="text-xs text-slate-400">Collection average</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-white">{floorPrice} {asset.currency}</p>
                                        <p className="text-xs text-slate-400">≈ $1,532.45 USD</p>
                                    </div>
                                </div>

                                {/* Offer Input */}
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Your Offer</Label>
                                        <div className="relative">
                                            <Input
                                                type="number"
                                                placeholder="0.00"
                                                value={offerAmount}
                                                onChange={(e) => setOfferAmount(e.target.value)}
                                                className="h-14 text-2xl font-bold bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 pr-20 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                                            />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                                <Badge className="bg-slate-700 text-slate-300 border-slate-600">
                                                    {asset.currency}
                                                </Badge>
                                            </div>
                                        </div>
                                        {offerAmount && parseFloat(offerAmount) < parseFloat(floorPrice) && (
                                            <div className="flex items-center gap-2 text-amber-400 text-xs">
                                                <Info className="w-3 h-3" />
                                                <span>Your offer is below the floor price</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Expiration Select */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            Offer Expiration
                                        </Label>
                                        <div className="grid grid-cols-5 gap-2">
                                            {EXPIRATION_OPTIONS.map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => setExpiration(option.value)}
                                                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${expiration === option.value
                                                            ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-400 border"
                                                            : "bg-slate-800/50 border-slate-700/50 text-slate-400 border hover:bg-slate-700/50"
                                                        }`}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Error State */}
                                {stage === "error" && (
                                    <Alert variant="destructive" className="bg-red-500/10 border-red-500/30 text-red-400">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>{errorMsg}</AlertDescription>
                                    </Alert>
                                )}

                                {/* Info Notice */}
                                <div className="flex items-start gap-3 p-3 bg-cyan-500/5 rounded-xl border border-cyan-500/20">
                                    <Shield className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-slate-400">
                                        Your offer will be escrowed securely. If accepted, the asset will be transferred to your wallet automatically.
                                    </p>
                                </div>

                                {/* Action Button */}
                                <Button
                                    size="lg"
                                    className="w-full h-14 text-lg font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:via-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-cyan-500/20 transition-all duration-300"
                                    onClick={handleSubmitOffer}
                                    disabled={stage === "processing" || !offerAmount}
                                >
                                    {stage === "processing" ? (
                                        <div className="flex items-center gap-3">
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            <span>Submitting Offer...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <HandCoins className="h-5 w-5" />
                                            <span>Submit Offer</span>
                                        </div>
                                    )}
                                </Button>

                                <p className="text-xs text-center text-slate-500">
                                    The owner will be notified of your offer.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    )
}
