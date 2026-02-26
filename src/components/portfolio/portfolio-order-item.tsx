"use client";

import { MarketplaceOrder } from "@/hooks/use-marketplace-events";
import { normalizeStarknetAddress } from "@/lib/utils";
import { SUPPORTED_TOKENS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTokenMetadata } from "@/hooks/use-token-metadata";
import { formatDistanceToNow } from "date-fns";

interface PortfolioOrderItemProps {
    listing: MarketplaceOrder;
    onCancel?: (hash: string) => void;
}

export function PortfolioOrderItem({ listing, onCancel }: PortfolioOrderItemProps) {
    const {
        orderHash,
        offerToken, offerIdentifier, offerAmount, offerType,
        considerationToken, considerationIdentifier, considerationAmount, considerationType,
        startTime, status
    } = listing;

    // Detect Order Type
    const isListing = offerType === "ERC721" || offerType === "ERC1155";
    const isBid = considerationType === "ERC721" || considerationType === "ERC1155";

    // Display Data
    const displayToken = isListing ? offerToken : considerationToken;
    const displayIdentifier = isListing ? offerIdentifier : considerationIdentifier;
    const paymentToken = isListing ? considerationToken : offerToken;
    const paymentAmount = isListing ? considerationAmount : offerAmount;

    // Fetch metadata
    const { name, image, loading: metadataLoading } = useTokenMetadata(displayIdentifier, displayToken);

    // Resolve currency details
    const getCurrency = (tokenAddress: string) => {
        const normalized = normalizeStarknetAddress(tokenAddress).toLowerCase();
        for (const token of SUPPORTED_TOKENS) {
            const tokenNormalized = normalizeStarknetAddress(token.address).toLowerCase();
            if (tokenNormalized === normalized) {
                return { symbol: token.symbol, decimals: token.decimals };
            }
        }
        return { symbol: "TOKEN", decimals: 18 };
    };

    const currency = getCurrency(paymentToken);

    const formatPrice = (amount: string, decimals: number) => {
        try {
            const val = BigInt(amount);
            return (Number(val) / Math.pow(10, decimals)).toFixed(decimals <= 6 ? 2 : 4);
        } catch (e) {
            return "0";
        }
    };

    const formattedPrice = formatPrice(paymentAmount, currency.decimals);

    // Collection Offer routing
    const isCollectionOffer = isBid && displayIdentifier === "0";
    const assetUrl = isCollectionOffer ? `/collections/${displayToken}` : `/asset/${displayToken}-${displayIdentifier}`;
    const displayName = isCollectionOffer ? "Collection Offer (Any)" : (name || `Asset #${displayIdentifier}`);

    const timeText = startTime > 0 ? formatDistanceToNow(startTime * 1000, { addSuffix: true }) : "Recently";

    return (
        <div className="group grid grid-cols-1 md:grid-cols-[2.5fr_1fr_1.5fr_1.5fr_1fr_auto] items-center gap-4 p-4 rounded-xl border border-border/40 bg-card/5 hover:bg-card/20 transition-all duration-300">
            {/* Mobile Row 1 / Desktop Cols 1 & 5: Item Info & Status */}
            <div className="flex justify-between items-start md:contents">
                <Link href={assetUrl} className="flex items-center gap-3 min-w-0">
                    <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted/30 shrink-0 border border-border/20">
                        {!metadataLoading && image && (
                            <Image
                                src={image}
                                alt={name}
                                fill
                                className="object-cover"
                            />
                        )}
                    </div>
                    <div className="min-w-0 pr-4 block md:hidden">
                        <h4 className="text-sm font-bold truncate text-foreground group-hover:text-primary transition-colors">
                            {displayName}
                        </h4>
                        <p className="text-[10px] text-muted-foreground/70 font-mono truncate">
                            {displayToken.slice(0, 6)}...{displayToken.slice(-4)}
                        </p>
                    </div>
                    <div className="min-w-0 hidden md:block">
                        <h4 className="text-sm font-bold truncate text-foreground group-hover:text-primary transition-colors">
                            {displayName}
                        </h4>
                        <p className="text-[10px] text-muted-foreground font-mono truncate">
                            {displayToken.slice(0, 6)}...{displayToken.slice(-4)}
                        </p>
                    </div>
                </Link>

                <div className="md:order-4 self-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${status === 'active' ? 'bg-green-500/10 text-green-500 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]' :
                        status === 'fulfilled' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                            'bg-muted/10 text-muted-foreground border-border/20'
                        }`}>
                        {status}
                    </span>
                </div>
            </div>

            {/* Mobile Data Row / Desktop Cols 2 & 3: Type & Price */}
            <div className="flex justify-between items-center py-2 md:py-0 border-y border-border/10 md:border-y-0 md:contents">
                <div className="text-xs font-medium text-muted-foreground md:order-1">
                    <span className={`${isListing ? 'text-primary' : 'text-orange-500'} opacity-70 block md:hidden mb-1 uppercase tracking-wider text-[10px]`}>
                        Type
                    </span>
                    <span className={`${isListing ? 'text-primary' : 'text-orange-500'} font-semibold md:font-medium md:opacity-70`}>
                        {isListing ? 'Sale Listing' : 'Buy Offer'}
                    </span>
                </div>

                <div className="flex flex-col items-end md:items-start md:order-2">
                    <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider block md:hidden mb-1">Price</span>
                    <div className="flex items-center gap-1.5">
                        <span className="text-sm font-black text-foreground">{formattedPrice}</span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">{currency.symbol}</span>
                    </div>
                </div>
            </div>

            {/* Mobile Footer Row / Desktop Cols 4 & 6: Time & Actions */}
            <div className="flex justify-between items-center pt-1 md:pt-0 md:contents">
                <div className="text-xs text-muted-foreground md:order-3 flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground/50 block md:hidden">Listed:</span>
                    {timeText}
                </div>

                <div className="flex justify-end gap-2 md:order-5">
                    <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 md:w-8 md:p-0 px-3 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors text-xs font-semibold"
                        asChild
                    >
                        <Link href={assetUrl}>
                            <span className="block md:hidden mr-1">View</span>
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>

                    {status === 'active' && (
                        <Button
                            variant="destructive"
                            size="sm"
                            className="h-8 md:w-8 md:p-0 px-3 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-colors text-xs font-semibold md:bg-transparent md:hover:bg-destructive/10 md:hover:text-destructive"
                            onClick={() => onCancel?.(orderHash)}
                            title="Cancel Order"
                        >
                            <span className="block md:hidden mr-1">Cancel</span>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
