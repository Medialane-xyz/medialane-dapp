"use client";

import { useCart } from "@/store/use-cart";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingBag, X, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { getCurrency, formatPrice } from "@/lib/utils";
import { useMemo } from "react";
import { useMarketplace } from "@/hooks/use-marketplace";

export function CartDrawer() {
    const { items, isOpen, setIsOpen, removeItem, clearCart } = useCart();

    // Calculate totals per currency
    const totals = useMemo(() => {
        const map = new Map<string, { amount: bigint; decimals: number }>();
        items.forEach((item) => {
            const currency = getCurrency(item.listing.considerationToken);
            const symbol = currency.symbol;
            const amount = BigInt(item.listing.considerationAmount);

            if (map.has(symbol)) {
                const current = map.get(symbol)!;
                map.set(symbol, { amount: current.amount + amount, decimals: currency.decimals });
            } else {
                map.set(symbol, { amount, decimals: currency.decimals });
            }
        });
        return Array.from(map.entries()).map(([symbol, data]) => ({
            symbol,
            formatted: formatPrice(data.amount.toString(), data.decimals),
        }));
    }, [items]);

    const { checkoutCart, isProcessing } = useMarketplace();

    const handleCheckout = async () => {
        if (items.length === 0) return;

        const orders = items.map((i) => i.listing);
        const txHash = await checkoutCart(orders);

        if (txHash) {
            clearCart();
            setIsOpen(false);
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent className="w-full sm:max-w-md flex flex-col bg-background/95 backdrop-blur-xl border-border p-0">
                <SheetHeader className="p-6 border-b border-border/40">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="flex items-center gap-2 text-xl">
                            <ShoppingBag className="w-5 h-5 text-outrun-cyan" />
                            Your Cart
                            <span className="text-sm font-normal text-muted-foreground ml-2">
                                ({items.length} items)
                            </span>
                        </SheetTitle>
                    </div>
                </SheetHeader>

                <div className="flex-1 overflow-hidden">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
                            <ShoppingBag className="w-12 h-12 opacity-20" />
                            <p>Your cart is empty</p>
                            <Button
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                                className="mt-4"
                            >
                                Continue Shopping
                            </Button>
                        </div>
                    ) : (
                        <ScrollArea className="h-full p-6">
                            <div className="space-y-4">
                                {items.map((item) => {
                                    const name = item.asset.name || "Unknown Asset";
                                    const image = item.asset.image || "/placeholder.svg";
                                    const currency = getCurrency(item.listing.considerationToken);
                                    const price = formatPrice(
                                        item.listing.considerationAmount,
                                        currency.decimals
                                    );

                                    return (
                                        <div
                                            key={item.listing.orderHash}
                                            className="flex items-start gap-4 p-3 rounded-lg border border-border/50 bg-muted/20"
                                        >
                                            <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                                                <Image
                                                    src={image}
                                                    alt={name}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized={image.startsWith("http")}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0 pr-2">
                                                <h4 className="font-semibold text-sm truncate" title={name}>
                                                    {name}
                                                </h4>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {(item.asset as any).collectionName || (typeof (item.asset as any).collection === 'object' ? (item.asset as any).collection.name : (item.asset as any).collection) || "IP Asset"}
                                                </p>
                                                <div className="flex items-baseline gap-1 mt-2">
                                                    <span className="font-medium text-foreground">{price}</span>
                                                    <span className="text-[10px] text-muted-foreground uppercase">
                                                        {currency.symbol}
                                                    </span>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0 mt-2"
                                                onClick={() => removeItem(item.listing.orderHash)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        </ScrollArea>
                    )}
                </div>

                {items.length > 0 && (
                    <div className="p-6 border-t border-border/40 bg-card mt-auto space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm font-medium text-muted-foreground mb-1">
                                <span>Total</span>
                            </div>
                            {totals.map((total) => (
                                <div key={total.symbol} className="flex justify-between items-end">
                                    <span className="text-xs text-muted-foreground uppercase">{total.symbol}</span>
                                    <span className="text-xl font-bold tracking-tight">
                                        {total.formatted} <span className="text-sm font-normal text-muted-foreground">{total.symbol}</span>
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-2 pt-2">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={clearCart}
                            >
                                Clear
                            </Button>
                            <Button
                                className="flex-[2] bg-outrun-cyan text-black hover:bg-outrun-cyan/90 transition-all font-semibold"
                                onClick={handleCheckout}
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    "Checkout"
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
