"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Loader2,
    AlertCircle,
    HandCoins,
    Shield,
    CheckCircle2,
    ExternalLink,
    Clock,
    Info
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

interface CollectionOfferDialogProps {
    trigger?: React.ReactNode
    collection: {
        name: string
        image: string
        nftAddress: string
        floorPrice?: string
    }
    isOpen?: boolean
    onOpenChange?: (open: boolean) => void
}

const DURATION_OPTIONS = [
    { value: "1d", label: "1 Day", seconds: 86400 },
    { value: "3d", label: "3 Days", seconds: 2592000 },
    { value: "7d", label: "7 Days", seconds: 604800 },
    { value: "14d", label: "14 Days", seconds: 1209600 },
    { value: "30d", label: "1 Month", seconds: 2592000 },
]

import { useMarketplace } from "@/hooks/use-marketplace"
import { useAccount } from "@starknet-react/core"
import { EXPLORER_URL } from "@/lib/constants"

const SUPPORTED_CURRENCY_SYMBOLS = ["STRK", "USDC", "USDT"] as const;

const offerSchema = z.object({
    price: z.string()
        .min(1, { message: "Price is required" })
        .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
            message: "Amount must be greater than zero",
        }),
    currency: z.enum(SUPPORTED_CURRENCY_SYMBOLS, {
        required_error: "Currency is required",
    }),
    durationSeconds: z.number().min(86400, "Duration must be at least 1 day"),
})

type OfferFormValues = z.infer<typeof offerSchema>

export function CollectionOfferDialog({ trigger, collection, isOpen: controlledOpen, onOpenChange: setControlledOpen }: CollectionOfferDialogProps) {
    const { address } = useAccount()
    const { makeOffer, isProcessing, txHash, error, resetState } = useMarketplace()

    const [internalOpen, setInternalOpen] = useState(false)
    const isOpen = controlledOpen ?? internalOpen
    const setIsOpen = setControlledOpen ?? setInternalOpen

    const form = useForm<OfferFormValues>({
        resolver: zodResolver(offerSchema),
        defaultValues: {
            price: "",
            currency: "USDC",
            durationSeconds: 604800, // 7 days default
        },
    })

    const stage = txHash ? "success" : isProcessing ? "processing" : "form"

    const onSubmit = async (data: OfferFormValues) => {
        if (!address) return

        // 0 identifier_or_criteria denotes a Collection-wide offer
        await makeOffer(
            collection.nftAddress,
            "0",
            data.price,
            data.currency,
            data.durationSeconds
        )
    }

    const reset = () => {
        resetState()
        form.reset()
    }

    const floorPrice = collection.floorPrice

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
                        <DialogTitle className="text-xl font-bold tracking-tight">Make Collection Offer</DialogTitle>
                        <DialogDescription className="text-muted-foreground/80">
                            Submit a bid for ANY asset in this collection.
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
                                    Your collection offer of <span className="font-semibold text-foreground">{form.getValues().price} {form.getValues().currency}</span> has been broadcast.
                                </p>
                            </div>

                            <div className="w-full bg-muted/30 rounded-xl p-4 border border-border/50 space-y-3 text-sm">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-muted-foreground uppercase font-semibold">Expires In</span>
                                    <span className="font-medium text-foreground">{DURATION_OPTIONS.find(o => o.seconds === form.getValues().durationSeconds)?.label}</span>
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
                                    Approving & registering your collection offer on-chain. Please confirm the transaction in your wallet.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/50 group hover:bg-muted/40 transition-colors">
                                <div className="h-16 w-16 rounded-lg overflow-hidden border border-border/50 bg-background shrink-0 shadow-sm relative">
                                    <img
                                        src={collection.image || "/placeholder.svg"}
                                        alt={collection.name}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "/placeholder.svg"
                                        }}
                                    />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-bold text-foreground truncate">{collection.name}</h3>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <span className="text-[10px] text-muted-foreground/80 font-medium">Valid for ANY token</span>
                                    </div>
                                    {floorPrice && (
                                        <p className="text-[10px] font-bold text-primary/80 mt-1">FLOOR: {floorPrice}</p>
                                    )}
                                </div>
                            </div>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2.5">
                                                <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 flex justify-between">
                                                    Amount
                                                    {field.value && floorPrice && parseFloat(field.value) < parseFloat(floorPrice) && (
                                                        <span className="text-amber-500 font-bold lowercase flex items-center gap-1">
                                                            <Info className="h-3 w-3" />
                                                            below floor
                                                        </span>
                                                    )}
                                                </FormLabel>
                                                <div className="relative group">
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            step="any"
                                                            placeholder="0.00"
                                                            className="h-14 pl-4 pr-16 text-xl font-bold bg-muted/20 border-border/50 focus:border-primary/50 transition-all rounded-xl"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                                        <span className="text-sm font-black text-muted-foreground/60 select-none">
                                                            {form.watch("currency")}
                                                        </span>
                                                    </div>
                                                </div>
                                                <FormMessage className="text-xs ml-1" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="durationSeconds"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2.5">
                                                <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    Expiration
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="grid grid-cols-5 gap-1.5">
                                                        {DURATION_OPTIONS.map((option) => (
                                                            <Button
                                                                key={option.value}
                                                                type="button"
                                                                variant={field.value === option.seconds ? "default" : "outline"}
                                                                size="sm"
                                                                onClick={() => field.onChange(option.seconds)}
                                                                className={cn(
                                                                    "h-9 text-[10px] font-bold uppercase tracking-tight rounded-lg transition-all",
                                                                    field.value === option.seconds ? "shadow-md bg-primary" : "bg-muted/30 border-border/50 hover:bg-muted/50"
                                                                )}
                                                            >
                                                                {option.label}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-xs ml-1" />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex gap-3 shadow-inner mt-4">
                                        <Shield className="w-4 h-4 text-primary shrink-0 mt-0.5 opacity-80" />
                                        <div className="space-y-1">
                                            <p className="text-[11px] font-bold text-foreground/80">On-Chain Binding</p>
                                            <p className="text-[10px] text-muted-foreground leading-relaxed">
                                                Your offer remains valid until it expires. Anyone holding an asset from this collection can fulfill it instantly.
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
                                            type="button"
                                            variant="ghost"
                                            onClick={() => setIsOpen(false)}
                                            disabled={isProcessing}
                                            className="flex-1 font-semibold text-muted-foreground"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={!form.watch("price") || isProcessing}
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
                                                    Place Bid
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
