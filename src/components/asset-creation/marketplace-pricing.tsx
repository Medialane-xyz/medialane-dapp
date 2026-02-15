"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DollarSign, TrendingUp, Zap } from "lucide-react"
import type { AssetFormState } from "@/hooks/use-asset-form"

interface MarketplacePricingProps {
    formState: AssetFormState
    updateFormField: (field: string, value: unknown) => void
}

export function MarketplacePricing({ formState, updateFormField }: MarketplacePricingProps) {
    const hasPrice = formState.listingPrice && parseFloat(formState.listingPrice) > 0

    return (
        <div className="space-y-3">
            <Label htmlFor="listing-price" className="text-base font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                Price
            </Label>

            <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                    className="h-12 text-base pl-9 pr-20"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                    USDC
                </span>
            </div>

            {hasPrice ? (
                <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                    <Zap className="h-3 w-3" />
                    <span>Listed for {formState.listingPrice} USDC after minting · 30-day duration</span>
                </div>
            ) : (
                <p className="text-xs text-muted-foreground">
                    Set a price to list your asset on the marketplace immediately after minting. Leave empty to mint without listing.
                </p>
            )}
        </div>
    )
}
