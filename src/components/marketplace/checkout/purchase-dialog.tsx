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
import { Separator } from "@/components/ui/separator"
import { Loader2, AlertCircle, Wallet, Shield, Sparkles, CheckCircle2, ExternalLink, Zap } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

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
            await new Promise(resolve => setTimeout(resolve, 2500))
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
            <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none shadow-2xl bg-transparent sm:rounded-2xl">
                {/* Main Content Container with Subtle Glassmorphism */}
                <div className="relative bg-background/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-2xl overflow-hidden">

                    {/* Vivid Top Gradient Accent - Animated Outrun */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-outrun-magenta via-outrun-cyan to-outrun-orange bg-[length:200%_100%] animate-gradient-x" />

                    <VisuallyHidden>
                        <DialogTitle>Purchase Asset</DialogTitle>
                    </VisuallyHidden>

                    {stage === "success" ? (
                        <div className="p-8 flex flex-col items-center text-center">
                            <div className="mb-6 relative">
                                <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full animate-pulse-slow"></div>
                                <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-full p-4 shadow-lg shadow-green-500/30 text-white">
                                    <CheckCircle2 className="h-10 w-10" />
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 mb-2">
                                Purchase Successful!
                            </h2>

                            <p className="text-muted-foreground mb-8">
                                You are now the owner of <span className="font-semibold text-foreground">{asset.name}</span>
                            </p>

                            <div className="w-full bg-muted/50 rounded-xl p-4 border border-border/50 mb-8 text-sm">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-muted-foreground">Status</span>
                                    <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
                                        Confirmed
                                    </Badge>
                                </div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-muted-foreground">Amount</span>
                                    <span className="font-medium">{asset.price} {asset.currency}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Transaction</span>
                                    <Link href={`https://starkscan.co/tx/${txHash}`} target="_blank" className="flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors">
                                        <span className="font-mono text-xs">{txHash.slice(0, 8)}...{txHash.slice(-6)}</span>
                                        <ExternalLink className="w-3 h-3" />
                                    </Link>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 w-full">
                                <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1 rounded-xl h-11">
                                    Close
                                </Button>
                                <Link href={`/asset/${asset.id}`} className="flex-1">
                                    <Button className="w-full rounded-xl h-11 gradient-vivid-primary border-0">
                                        View Asset
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ) : stage === "processing" ? (
                        <div className="p-12 flex flex-col items-center text-center justify-center min-h-[400px]">
                            <div className="relative mb-6">
                                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
                                <Loader2 className="relative h-16 w-16 animate-spin text-primary" />
                            </div>

                            <h2 className="text-xl font-bold mb-2">Processing Update</h2>
                            <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-8">
                                Securing your transaction on the blockchain. This may take a moment.
                            </p>

                            <div className="flex items-center gap-2 text-xs text-muted-foreground/80 bg-muted/50 px-3 py-1.5 rounded-full">
                                <Shield className="w-3 h-3" />
                                <span>Blockchain Secured</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="p-6 pb-0">
                                <div className="flex items-start gap-5">
                                    <div className="relative group shrink-0">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-violet-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                                        <div className="relative h-24 w-24 rounded-xl overflow-hidden border border-border shadow-sm">
                                            <img src={asset.image} alt={asset.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        </div>
                                    </div>

                                    <div className="pt-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge variant="secondary" className="bg-primary/5 text-primary hover:bg-primary/10 transition-colors text-[10px] items-center gap-1 px-2">
                                                <Sparkles className="w-3 h-3" />
                                                Verified Asset
                                            </Badge>
                                        </div>
                                        <h2 className="text-xl font-bold truncate pr-2 mb-1">{asset.name}</h2>
                                        <p className="text-sm text-muted-foreground truncate font-medium">{asset.collectionName}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-5">
                                {/* Theme Aware Price Card */}
                                <div className="bg-muted/30 rounded-xl p-4 border border-border/50 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-violet-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none group-hover:from-blue-500/10 group-hover:to-violet-500/10 transition-colors duration-500"></div>

                                    <div className="relative flex justify-between items-end">
                                        <div>
                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Total Price</p>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
                                                    {asset.price}
                                                </span>
                                                <span className="text-lg font-bold text-muted-foreground">{asset.currency}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-medium text-muted-foreground mb-1">≈ $1,532.45 USD</p>
                                        </div>
                                    </div>

                                    <Separator className="my-3 bg-border/50" />

                                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                                        <span>Network Fee</span>
                                        <span className="font-mono">~0.001 ETH</span>
                                    </div>
                                </div>

                                {/* Wallet Status */}
                                <div className="flex items-center justify-between px-1">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400">
                                            <Wallet className="w-4 h-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-medium text-muted-foreground">Connected Wallet</span>
                                            <span className="text-xs font-bold font-mono text-foreground/80">0x02b4...7a9f</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/10">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                        <span className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wide">Ready</span>
                                    </div>
                                </div>

                                {stage === "error" && (
                                    <Alert variant="destructive" className="animate-in fade-in zoom-in-95 duration-200">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>Error</AlertTitle>
                                        <AlertDescription>{errorMsg}</AlertDescription>
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
                                    onClick={handlePurchase}
                                    className="flex-[2] rounded-xl h-12 gradient-vivid-primary border-0 font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <Zap className="w-4 h-4 mr-2 fill-current" />
                                    Confirm Purchase
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
