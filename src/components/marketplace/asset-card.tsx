import { MarketplaceOrder } from "@/hooks/use-marketplace-events"
import { normalizeStarknetAddress } from "@/lib/utils"
import { SUPPORTED_TOKENS, EXPLORER_URL } from "@/lib/constants"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    ExternalLink,
    Loader2,
    ShoppingBag,
    RefreshCw,
    MoreHorizontal,
    Eye,
    Share2,
    FileText,
    Flag
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useTokenMetadata } from "@/hooks/use-token-metadata"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AssetCardProps {
    listing: MarketplaceOrder;
}

export function AssetCard({ listing }: AssetCardProps) {
    const {
        orderHash,
        offerToken, offerIdentifier, offerAmount,
        considerationToken, considerationAmount
    } = listing;

    // Fetch metadata mirroring ListingCard
    const { name, image, loading: metadataLoading } = useTokenMetadata(offerIdentifier, offerToken);
    const [imageError, setImageError] = useState(false);

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

    const currency = getCurrency(considerationToken);

    // Price formatting
    const formatPrice = (amount: string, decimals: number) => {
        try {
            const val = BigInt(amount);
            return (Number(val) / Math.pow(10, decimals)).toFixed(decimals <= 6 ? 2 : 4);
        } catch (e) {
            return "0";
        }
    };

    const formattedPrice = formatPrice(considerationAmount, currency.decimals);
    const displayImage = imageError ? "/placeholder.svg" : (image || "/placeholder.svg");
    const assetUrl = `/asset/${offerToken}-${offerIdentifier}`;

    return (
        <Card className="overflow-hidden border-border/50 bg-card hover:border-border transition-all duration-200 group flex flex-col h-full relative box-border hover:shadow-md">
            <Link href={assetUrl} className="block relative aspect-square overflow-hidden bg-muted/20">
                {metadataLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground/20" />
                    </div>
                ) : (
                    <Image
                        src={displayImage}
                        alt={name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={() => setImageError(true)}
                        unoptimized={displayImage.startsWith("htt")}
                    />
                )}
            </Link>

            <CardContent className="p-4 flex-1 flex flex-col">
                <div className="pb-3 mb-3 border-b border-border/40">
                    <Link href={assetUrl} className="block">
                        <h3 className="font-semibold text-base leading-tight truncate group-hover:text-primary transition-colors text-foreground" title={name}>
                            {name}
                        </h3>
                    </Link>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="w-5 h-5 rounded-full bg-muted border border-border/50 flex items-center justify-center overflow-hidden">
                            <span className="text-[8px] font-medium text-muted-foreground uppercase">{listing.offerer.slice(2, 4)}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground/70 font-mono truncate" title={listing.offerer}>
                            {listing.offerer.slice(0, 6)}...{listing.offerer.slice(-4)}
                        </p>
                    </div>
                </div>

                <div className="flex justify-between items-end mt-auto">
                    <div>
                        <p className="text-[10px] font-medium text-muted-foreground/60 mb-0.5">Price</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-lg font-semibold text-foreground tracking-tight">
                                {formattedPrice}
                            </span>
                            <span className="text-[10px] font-medium text-muted-foreground uppercase">{currency.symbol}</span>
                        </div>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 grid grid-cols-[1fr,1fr,auto] gap-2">
                <Link href={assetUrl} className="w-full">
                    <Button
                        variant="default"
                        className="w-full h-9 gap-2 font-medium shadow-sm transition-all active:scale-[0.98]"
                    >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        Buy
                    </Button>
                </Link>

                <Link href={`/create/remix/${offerToken}-${offerIdentifier}`} className="w-full">
                    <Button
                        variant="secondary"
                        className="w-full h-9 gap-2 transition-all font-medium active:scale-[0.98] border border-border/50"
                    >
                        <RefreshCw className="h-3.5 w-3.5" />
                        Remix
                    </Button>
                </Link>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-10 w-10 border border-border/50 bg-muted/10 hover:bg-muted/30 text-muted-foreground hover:text-foreground shrink-0 rounded-lg transition-colors">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More actions</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-background/95 backdrop-blur-xl border-border text-foreground shadow-xl">
                        <Link href={assetUrl}>
                            <DropdownMenuItem className="focus:bg-primary/5 cursor-pointer py-2.5">
                                <Eye className="mr-3 h-4 w-4 opacity-60" /> View Details
                            </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem className="focus:bg-primary/5 cursor-pointer py-2.5">
                            <Share2 className="mr-3 h-4 w-4 opacity-60" /> Transfer Asset
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-primary/5 cursor-pointer py-2.5">
                            <FileText className="mr-3 h-4 w-4 opacity-60" /> View Provenance
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border/50" />
                        <div onClick={() => window.open(`${EXPLORER_URL}/contract/${offerToken}`, '_blank')}>
                            <DropdownMenuItem className="focus:bg-primary/5 cursor-pointer py-2.5">
                                <ExternalLink className="mr-3 h-4 w-4 opacity-60" /> View on Explorer
                            </DropdownMenuItem>
                        </div>
                        <DropdownMenuItem className="focus:bg-destructive/5 text-destructive focus:text-destructive cursor-pointer py-2.5 mt-1 border-t border-border/10">
                            <Flag className="mr-3 h-4 w-4 opacity-60" /> Report Asset
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardFooter>
        </Card>
    );
}
