"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
    Tag,
    CheckCircle2,
    ExternalLink,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useMarketplace } from "@/hooks/use-marketplace"
import { EXPLORER_URL } from "@/lib/constants"
import { useTokenMetadata } from "@/hooks/use-token-metadata"


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

// Determine supported currencies - ideally this comes from SUPPORTED_TOKENS directly
// But for schema defining at module level, we explicitly define the core valid ones
const SUPPORTED_CURRENCY_SYMBOLS = ["STRK", "USDC", "USDT"] as const;

// Strict form validation schema
const listingSchema = z.object({
    price: z.string()
        .min(1, { message: "Price is required" })
        .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
            message: "Price must be a positive number",
        })
        .refine((val) => {
            // Check for excessive decimals
            if (val.includes(".")) {
                const decimalPlaces = val.split(".")[1].length;
                return decimalPlaces <= 18; // generic cap, actual decimal limits per token handle later if needed
            }
            return true;
        }, {
            message: "Too many decimal places",
        }),
    currency: z.enum(SUPPORTED_CURRENCY_SYMBOLS, {
        required_error: "Please select a currency",
    }),
    durationSeconds: z.number().min(86400, "Duration must be at least 1 day"),
})

type ListingFormValues = z.infer<typeof listingSchema>

export function ListingDialog({ trigger, asset }: ListingDialogProps) {
    const { createListing, isProcessing, txHash, error, resetState } = useMarketplace()
    const metadata = useTokenMetadata(asset.tokenId, asset.collectionAddress)
    const { name: mName, image: mImage, loading: isLoadingMetadata } = metadata

    const displayName = mName || asset.name
    const displayImage = mImage || asset.image

    const [open, setOpen] = useState(false)

    // Derived state
    const stage = txHash ? "success" : isProcessing ? "processing" : error ? "error" : "input"

    // Initialize React Hook Form
    const form = useForm<ListingFormValues>({
        resolver: zodResolver(listingSchema),
        defaultValues: {
            price: "",
            currency: "USDC",
            durationSeconds: 2592000, // 30 days default
        },
    })

    const onSubmit = async (data: ListingFormValues) => {
        await createListing(
            asset.collectionAddress,
            asset.tokenId,
            data.price,
            data.currency,
            data.durationSeconds
        )
    }

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) {
            // Delay reset to avoid UI flicker during close animation
            setTimeout(() => {
                resetState()
                form.reset()
            }, 300)
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="sm:max-w-[420px] bg-card/90 backdrop-blur-3xl border-white/10 shadow-2xl p-0 overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-outrun-magenta via-outrun-purple to-neon-cyan" />
                <DialogHeader className="p-6 pb-2 relative z-10">
                    <DialogTitle className="text-xl font-bold tracking-tight">List for Sale</DialogTitle>
                </DialogHeader>

                {stage === "success" ? (
                    <div className="p-8 flex flex-col items-center text-center space-y-6">
                        <div className="h-20 w-20 bg-neon-cyan/20 rounded-full flex items-center justify-center shadow-glow shadow-neon-cyan/30">
                            <CheckCircle2 className="h-10 w-10 text-neon-cyan drop-shadow-lg" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold tracking-tight">Listing Live!</h2>
                            <p className="text-muted-foreground">
                                Your asset is now available for <span className="font-semibold text-foreground">{form.getValues().price} {form.getValues().currency}</span> on the marketplace.
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
                    <div className="p-6 pt-2 space-y-6">
                        {/* Compact Asset Preview */}
                        <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 border border-border/50 group hover:bg-muted/40 transition-colors">
                            <div className="h-14 w-14 rounded-lg overflow-hidden border border-border/50 bg-background shrink-0 shadow-sm relative">
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
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-sm truncate">{displayName}</h3>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <Badge variant="outline" className="text-[9px] h-3.5 py-0 font-medium bg-background/30">#{asset.tokenId}</Badge>
                                    <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Asset Listing</p>
                                </div>
                            </div>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2.5">
                                            <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                                                Set Price
                                            </FormLabel>
                                            <div className="relative group">
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="any"
                                                        placeholder="0.00"
                                                        className="h-12 pl-4 pr-16 bg-muted/20 border-border/50 focus:border-outrun-magenta/50 focus:ring-1 focus:ring-outrun-magenta/20 transition-all rounded-xl shadow-inner shadow-black/20 text-lg font-bold"
                                                        disabled={isProcessing}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <div className="absolute right-3 top-[9px] px-2.5 py-1.5 bg-background border border-border/50 rounded-md text-xs font-bold shadow-sm">
                                                    {form.watch("currency")}
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
                                            <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                                                Listing Duration
                                            </FormLabel>
                                            <FormControl>
                                                <div className="grid grid-cols-4 gap-2">
                                                    {DURATION_OPTIONS.map(opt => (
                                                        <Button
                                                            key={opt.value}
                                                            type="button"
                                                            variant={field.value === opt.seconds ? "default" : "outline"}
                                                            size="sm"
                                                            onClick={() => field.onChange(opt.seconds)}
                                                            className={cn(
                                                                "h-10 text-xs font-medium transition-all rounded-lg",
                                                                field.value === opt.seconds ? "shadow-glow-sm shadow-outrun-purple/30 bg-outrun-purple text-white border-transparent" : "bg-muted/30 border-border/50 hover:bg-muted/50"
                                                            )}
                                                            disabled={isProcessing}
                                                        >
                                                            {opt.label}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-xs ml-1" />
                                        </FormItem>
                                    )}
                                />

                                {stage === "error" && (
                                    <Alert variant="destructive" className="bg-destructive/5 border-destructive/20 py-3 mt-4">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription className="text-xs font-medium pl-2">{error || "Listing failed. Please try again."}</AlertDescription>
                                    </Alert>
                                )}

                                <div className="pt-4 flex flex-col gap-3">
                                    <Button
                                        type="submit"
                                        disabled={isProcessing}
                                        className="w-full h-12 text-sm font-bold tracking-wide shadow-glow-sm shadow-neon-cyan/30 text-white bg-outrun-purple hover:bg-outrun-purple/90 transition-all active:scale-[0.98]"
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
                            </form>
                        </Form>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

