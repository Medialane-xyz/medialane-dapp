"use client"

import { Button } from "@/components/ui/button"
import { Check, Package, Share2, ExternalLink } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface CheckoutSuccessProps {
    assetName: string
    assetId: string
    txHash?: string
    onClose: () => void
}

export function CheckoutSuccess({ assetName, assetId, txHash, onClose }: CheckoutSuccessProps) {
    return (
        <div className="flex flex-col items-center justify-center p-6 text-center space-y-6">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20"
            >
                <Check className="w-10 h-10 text-green-500" />
            </motion.div>

            <div className="space-y-2">
                <h2 className="text-2xl font-bold">Asset Acquired!</h2>
                <p className="text-muted-foreground max-w-xs mx-auto">
                    You successfully purchased <span className="font-semibold text-foreground">{assetName}</span>.
                </p>
            </div>

            <div className="w-full bg-muted/30 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Transaction Hash</span>
                    <div className="flex items-center gap-1 font-mono text-xs">
                        {txHash ? `${txHash.slice(0, 6)}...${txHash.slice(-4)}` : "Pending..."}
                        {txHash && (
                            <Link href={`https://starkscan.co/tx/${txHash}`} target="_blank">
                                <ExternalLink className="w-3 h-3 hover:text-primary transition-colors" />
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full">
                <Button variant="outline" onClick={onClose} className="w-full">
                    Close
                </Button>
                <Link href={`/asset/${assetId}`} className="w-full">
                    <Button className="w-full">View Asset</Button>
                </Link>
            </div>
        </div>
    )
}
