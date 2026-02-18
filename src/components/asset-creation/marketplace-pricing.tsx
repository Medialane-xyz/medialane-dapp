import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DollarSign, TrendingUp, Zap, Sparkles, ShieldCheck, Coins } from "lucide-react"
import type { AssetFormState } from "@/hooks/use-asset-form"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MarketplacePricingProps {
    formState: AssetFormState
    updateFormField: (field: string, value: unknown) => void
}

export function MarketplacePricing({ formState, updateFormField }: MarketplacePricingProps) {
    const hasPrice = formState.listingPrice && parseFloat(formState.listingPrice) > 0

    return (
        <div className="space-y-6 pt-6 border-t mt-6">
            <div className="flex items-center justify-between">
                <Label htmlFor="listing-price" className="text-lg font-bold flex items-center gap-2">
                    <Coins className="h-5 w-5 text-primary" />
                    Marketplace Listing
                </Label>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 animate-pulse">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Monetization Enabled
                </Badge>
            </div>

            <Card className="glass-card border-primary/20 bg-primary/5 overflow-hidden transition-all hover:bg-primary/10 group">
                <CardContent className="p-0">
                    <div className="grid lg:grid-cols-5 gap-0">
                        {/* Benefits Info */}
                        <div className="lg:col-span-3 p-6 space-y-4 border-r border-primary/10">
                            <div className="space-y-2">
                                <h4 className="font-semibold text-sm flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-primary" />
                                    Why set a price?
                                </h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Setting a price ensures your asset is <span className="text-foreground font-medium">immediately tradable</span> on our marketplace.
                                    This unlocks programmable monetization features and automated licensing rights for your IP.
                                </p>
                            </div>

                            <div className="flex gap-4 pt-2">
                                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                                    <Zap className="h-3 w-3 text-yellow-500" />
                                    Instant Listing
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                                    <ShieldCheck className="h-3 w-3 text-green-500" />
                                    Secure Trade
                                </div>
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="lg:col-span-2 p-6 bg-background/40 flex flex-col justify-center gap-3">
                            <div className="relative group/input">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <DollarSign className="h-5 w-5 text-primary group-focus-within/input:scale-110 transition-transform" />
                                </div>
                                <Input
                                    id="listing-price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    value={formState.listingPrice}
                                    onChange={(e) => {
                                        updateFormField("listingPrice", e.target.value)
                                        // Auto-enable listing when price is entered
                                        if (e.target.value && parseFloat(e.target.value) > 0) {
                                            updateFormField("listOnMarketplace", true)
                                        } else {
                                            updateFormField("listOnMarketplace", false)
                                        }
                                    }}
                                    className="h-14 text-xl font-bold pl-10 pr-16 bg-background border-primary/20 focus:ring-primary/30 transition-shadow shadow-sm"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                    <span className="text-xs font-black text-primary/50 tracking-tighter">USDC</span>
                                </div>
                            </div>

                            <p className="text-[10px] text-center text-muted-foreground italic">
                                * Assets will be listed for 30 days
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {hasPrice && (
                <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20 animate-in fade-in slide-in-from-top-2 duration-500">
                    <Zap className="h-4 w-4 text-green-500" />
                    <span className="text-xs font-medium text-green-600 dark:text-green-400">
                        Ready to launch: Listed for {formState.listingPrice} USDC at mint
                    </span>
                </div>
            )}
        </div>
    )
}
