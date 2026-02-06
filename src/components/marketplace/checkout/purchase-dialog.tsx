"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2, AlertCircle, ShoppingBag, Wallet, Shield, Sparkles, Check, ExternalLink } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

interface PurchaseDialogProps {
    trigger?: React.ReactNode
    asset: {
        id: string
        name: string
        price: string
        currency: string
        image: string
        collectionName: string
    }
    isOpen?: boolean
    onOpenChange?: (open: boolean) => void
}

export function PurchaseDialog({ trigger, asset, isOpen: controlledOpen, onOpenChange: setControlledOpen }: PurchaseDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false)
    const isOpen = controlledOpen ?? internalOpen
    const setIsOpen = setControlledOpen ?? setInternalOpen

    const [stage, setStage] = useState<"review" | "processing" | "success" | "error">("review")
    const [errorMsg, setErrorMsg] = useState("")
    const [txHash, setTxHash] = useState("")

    const handlePurchase = async () => {
        setStage("processing")
        setErrorMsg("")

        try {
            // Mock transaction delay
            await new Promise(resolve => setTimeout(resolve, 2500))

            // Success state
            setTxHash("0x04a8b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9")
            setStage("success")
        } catch (err) {
            console.error(err)
            setErrorMsg("Transaction failed. Please try again.")
            setStage("error")
        }
    }

    const reset = () => {
        setStage("review")
        setErrorMsg("")
        setTxHash("")
    }

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
                                    <h2 className="text-2xl font-bold text-white">Asset Acquired!</h2>
                                    <p className="text-slate-400 max-w-xs mx-auto">
                                        You are now the owner of <span className="font-semibold text-white">{asset.name}</span>.
                                    </p>
                                </div>

                                <div className="w-full bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
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
                                    <Link href={`/asset/${asset.id}`} className="w-full">
                                        <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white">
                                            View Asset
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="checkout"
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
                                {/* Wallet Status */}
                                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                                            <Wallet className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">Wallet Connected</p>
                                            <p className="text-xs text-slate-400">0x02b4...7a9f</p>
                                        </div>
                                    </div>
                                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
                                        Active
                                    </Badge>
                                </div>

                                {/* Price Breakdown */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Order Summary</h4>

                                    <div className="space-y-3 bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400">Asset Price</span>
                                            <span className="font-medium text-white">{asset.price} {asset.currency}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400">Creator Royalty</span>
                                            <span className="font-medium text-slate-300">2.5%</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400">Network Fee</span>
                                            <span className="font-medium text-slate-300">~0.001 ETH</span>
                                        </div>
                                        <Separator className="bg-slate-700/50 my-2" />
                                        <div className="flex justify-between">
                                            <span className="font-semibold text-white">Total</span>
                                            <div className="text-right">
                                                <span className="font-bold text-xl text-white">{asset.price} {asset.currency}</span>
                                                <p className="text-xs text-slate-400">≈ $1,532.45 USD</p>
                                            </div>
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

                                {/* Security Notice */}
                                <div className="flex items-start gap-3 p-3 bg-blue-500/5 rounded-xl border border-blue-500/20">
                                    <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-slate-400">
                                        This transaction is secured by the Starknet blockchain. Your ownership will be verified and immutable.
                                    </p>
                                </div>

                                {/* Action Button */}
                                <Button
                                    size="lg"
                                    className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white shadow-xl shadow-indigo-500/20 transition-all duration-300"
                                    onClick={handlePurchase}
                                    disabled={stage === "processing"}
                                >
                                    {stage === "processing" ? (
                                        <div className="flex items-center gap-3">
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            <span>Processing Transaction...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="h-5 w-5" />
                                            <span>Confirm Purchase</span>
                                        </div>
                                    )}
                                </Button>

                                <p className="text-xs text-center text-slate-500">
                                    By confirming, you agree to the Medialane Terms of Service.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    )
}
