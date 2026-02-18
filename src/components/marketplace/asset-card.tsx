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
        <Card className="overflow-hidden border border-white/10 bg-black/20 backdrop-blur-sm hover:border-outrun-cyan/30 hover:bg-black/30 transition-all duration-500 group flex flex-col h-full hover:shadow-[0_0_30px_rgba(0,255,255,0.15)] relative">
            <Link href={assetUrl} className="block relative aspect-square overflow-hidden bg-muted/20">
                {metadataLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground/30" />
                    </div>
                ) : (
                    <Image
                        src={displayImage}
                        alt={name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={() => setImageError(true)}
                        unoptimized={displayImage.startsWith("htt")}
                    />
                )}

                {/* Status Badges */}
                <div className="absolute top-2 left-2 flex gap-2">
                    <Badge variant="secondary" className="bg-black/50 backdrop-blur text-xs font-normal border border-white/10">
                        ACTIVE
                    </Badge>
                    <Badge className="bg-outrun-cyan/80 text-black backdrop-blur text-xs font-bold border-none">
                        SALE
                    </Badge>
                </div>
            </Link>

            <CardContent className="p-4 flex-1">
                <div className="flex justify-between items-start gap-2 mb-2">
                    <div className="min-w-0 w-full">
                        <Link href={assetUrl} className="hover:underline">
                            <h3 className="font-semibold text-lg truncate" title={name}>{name}</h3>
                        </Link>
                        <div className="flex justify-between items-end mt-1">
                            <p className="text-sm text-muted-foreground truncate font-mono" title={listing.offerer}>
                                {listing.offerer.slice(0, 6)}...{listing.offerer.slice(-4)}
                            </p>

                            <div className="text-right">
                                <p className="font-bold text-outrun-cyan">
                                    {formattedPrice} <span className="text-xs text-muted-foreground">{currency.symbol}</span>
                                </p>
                                <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest leading-none mt-0.5">List Price</p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 grid grid-cols-[1fr,1fr,auto] gap-2">
                <Link href={assetUrl} className="w-full">
                    <Button
                        className="w-full border-none gap-2 font-semibold px-2 transition-all gradient-vivid-outrun text-white hover:brightness-110"
                    >
                        <ShoppingBag className="h-4 w-4" />
                        <span className="hidden sm:inline">Buy</span>
                    </Button>
                </Link>

                <Link href={`/create/remix/${offerToken}-${offerIdentifier}`} className="w-full">
                    <Button className="w-full bg-primary/90 hover:bg-primary text-primary-foreground shadow-lg shadow-primary/20 gap-2 group-hover:shadow-primary/30 transition-all font-semibold px-2">
                        <RefreshCw className="h-4 w-4" />
                        <span className="hidden sm:inline">Remix</span>
                    </Button>
                </Link>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="border-white/10 hover:bg-white/5 hover:text-white shrink-0">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More actions</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-black/90 backdrop-blur-xl border-white/10 text-white">
                        <Link href={assetUrl}>
                            <DropdownMenuItem className="focus:bg-white/10 cursor-pointer">
                                <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem className="focus:bg-white/10 cursor-pointer">
                            <Share2 className="mr-2 h-4 w-4" /> Transfer Asset
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-white/10 cursor-pointer">
                            <FileText className="mr-2 h-4 w-4" /> View Provenance
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <div onClick={() => window.open(`${EXPLORER_URL}/contract/${offerToken}`, '_blank')}>
                            <DropdownMenuItem className="focus:bg-white/10 cursor-pointer">
                                <ExternalLink className="mr-2 h-4 w-4" /> View on Explorer
                            </DropdownMenuItem>
                        </div>
                        <DropdownMenuItem className="focus:bg-white/10 text-red-400 focus:text-red-400 focus:bg-red-900/10 cursor-pointer">
                            <Flag className="mr-2 h-4 w-4" /> Report Asset
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardFooter>
        </Card>
    );
}
