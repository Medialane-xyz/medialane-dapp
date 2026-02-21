"use client"

import { MarketplaceOrder } from "@/hooks/use-marketplace-events"
import { Skeleton } from "@/components/ui/skeleton"
import { normalizeStarknetAddress, getCurrency, formatPrice } from "@/lib/utils"
import { EXPLORER_URL } from "@/lib/constants"
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
  Flag,
  Shield
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useCart } from "@/store/use-cart"
import { useTokenMetadata } from "@/hooks/use-token-metadata"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Asset } from "@/types/asset"
import type { RecentAsset } from "@/hooks/use-recent-assets"

interface AssetCardProps {
  listing?: MarketplaceOrder;
  asset?: Partial<Asset> & Partial<RecentAsset> & { collectionName?: string, nftAddress?: string }; // Allows passing either base data
}

export function AssetCard({ listing, asset }: AssetCardProps) {
  // Resolve identifiers
  const offerToken = listing?.offerToken || asset?.nftAddress || asset?.collectionAddress || (typeof asset?.collection === 'string' ? asset.collection : "") || "";
  const extractedTokenId = asset?.id?.includes('-') ? asset.id.split('-')[1] : asset?.id;
  const offerIdentifier = listing?.offerIdentifier || asset?.tokenId || extractedTokenId || "";

  // Derived ownership / creation
  const creatorAddress = listing?.offerer || asset?.creator || "";
  const collectionName = asset?.collectionName || (typeof asset?.collection === 'object' ? (asset.collection as any).name : asset?.collection) || null;
  const ipType = asset?.ipType || asset?.type || null;

  // Fetch metadata mirroring ListingCard ONLY if asset doesn't provide it
  const shouldFetchMetadata = !asset?.image || !asset?.name;
  const { name: fetchedName, image: fetchedImage, loading: metadataLoading } = useTokenMetadata(
    shouldFetchMetadata ? offerIdentifier : "",
    shouldFetchMetadata ? offerToken : ""
  );

  const [imageError, setImageError] = useState(false);

  // Cart integration
  const { items, addItem, removeItem, setIsOpen } = useCart();
  const isInCart = listing && items.some((i) => i.listing.orderHash === listing.orderHash);

  const handleCartAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!listing || !asset) return;

    if (isInCart) {
      removeItem(listing.orderHash);
    } else {
      addItem({ listing, asset: asset as Asset | RecentAsset });
      setIsOpen(true);
    }
  };

  // Resolve currency details for listings
  const currency = getCurrency(listing?.considerationToken || "");
  const formattedPrice = formatPrice(listing?.considerationAmount || "0", currency.decimals);

  // Final Display Values
  const name = asset?.name || fetchedName || "Unknown Asset";
  const image = asset?.image || fetchedImage;
  const displayImage = imageError || !image ? "/placeholder.svg" : image;
  const assetUrl = `/asset/${offerToken}-${offerIdentifier}`;
  const isLoading = shouldFetchMetadata && metadataLoading;

  return (
    <Card className="overflow-hidden border-border/50 bg-card hover:border-border transition-all duration-200 group flex flex-col h-full relative box-border hover:shadow-md">
      <Link href={assetUrl} className="block relative aspect-square overflow-hidden bg-muted/20">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground/20" />
          </div>
        ) : (
          <Image
            src={displayImage}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
            unoptimized={displayImage.startsWith("htt")}
          />
        )}
      </Link>

      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="pb-3 mb-3 border-b border-border/40">
          <div className="flex items-start justify-between gap-2">
            <Link href={assetUrl} className="block flex-1 min-w-0">
              <h3 className="font-semibold text-base leading-tight truncate group-hover:text-primary transition-colors text-foreground" title={name}>
                {name}
              </h3>
            </Link>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2 max-w-[70%]">
              {creatorAddress ? (
                <>
                  <div className="w-5 h-5 flex-shrink-0 rounded-full bg-muted border border-border/50 flex items-center justify-center overflow-hidden">
                    <span className="text-[8px] font-medium text-muted-foreground uppercase">{creatorAddress.slice(2, 4)}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground/70 font-mono truncate hover:underline" title={creatorAddress}>
                    <Link href={`/creator/${creatorAddress}`}>
                      {creatorAddress.slice(0, 6)}...{creatorAddress.slice(-4)}
                    </Link>
                  </p>
                </>
              ) : (
                <>
                  <div className="w-5 h-5 flex-shrink-0 rounded-full bg-muted border border-border/50 flex items-center justify-center overflow-hidden">
                    <span className="text-[8px] font-medium text-muted-foreground uppercase">{(collectionName || "IP").slice(0, 2)}</span>
                  </div>
                  <Link href={`/collections/${offerToken}`} className="text-[11px] text-muted-foreground/70 truncate hover:underline font-medium">
                    {collectionName || "Unknown Collection"}
                  </Link>
                </>
              )}
            </div>

            <Badge variant="secondary" className="text-[10px] shrink-0 font-normal text-muted-foreground bg-outrun-cyan/10 hover:bg-outrun-cyan/20 border-outrun-cyan/20 ml-auto uppercase tracking-wider">
              {ipType || "IP Asset"}
            </Badge>
          </div>
        </div>

        <div className="flex justify-between items-end mt-auto h-[38px]">
          {listing ? (
            <div>
              <p className="text-[10px] font-medium text-muted-foreground/60 mb-0.5">Price</p>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-semibold text-foreground tracking-tight">
                  {formattedPrice}
                </span>
                <span className="text-[10px] font-medium text-muted-foreground uppercase">{currency.symbol}</span>
              </div>
            </div>
          ) : (
            <div className="mb-0.5">
              <p className="text-[10px] font-medium text-muted-foreground/60 mb-1">Status</p>
              <span className="text-xs font-medium text-muted-foreground/80 px-2 py-0.5 rounded-sm bg-muted/50 border border-border/30">
                Unlisted
              </span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 gap-2 grid grid-cols-[1fr,1fr,auto]">
        {listing ? (
          <Button
            variant={isInCart ? "secondary" : "default"}
            onClick={handleCartAction}
            className="w-full h-9 gap-2 font-medium shadow-sm transition-all active:scale-[0.98]"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            {isInCart ? "In Cart" : "Add to Cart"}
          </Button>
        ) : (
          <Link href={assetUrl} className="w-full">
            <Button
              variant="default"
              className="w-full h-9 gap-1 shadow-sm transition-all font-medium active:scale-[0.98]"
            >
              <Eye className="h-3.5 w-3.5 mr-1" />
              View
            </Button>
          </Link>
        )}

        <Link href={`/create/remix/${offerToken}-${offerIdentifier}`} className="w-full">
          <Button
            variant="secondary"
            className="w-full h-9 gap-2 transition-all font-medium active:scale-[0.98] border border-border/50 bg-secondary/30 hover:bg-secondary/50"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Remix
          </Button>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-9 w-10 border border-border/50 bg-muted/10 hover:bg-muted/30 text-muted-foreground hover:text-foreground shrink-0 rounded-lg transition-colors p-0">
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
            {!listing && (
              <Link href={`/create/remix/${offerToken}-${offerIdentifier}`}>
                <DropdownMenuItem className="focus:bg-primary/5 cursor-pointer py-2.5">
                  <RefreshCw className="mr-3 h-4 w-4 opacity-60" /> Remix Asset
                </DropdownMenuItem>
              </Link>
            )}
            <Link href={`/proof-of-ownership/${offerToken}-${offerIdentifier}`}>
              <DropdownMenuItem className="focus:bg-primary/5 cursor-pointer py-2.5">
                <Shield className="mr-3 h-4 w-4 opacity-60" /> Proof of Ownership
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

export default AssetCard;

export function AssetCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-square w-full" />
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-12" />
        </div>
        <Skeleton className="h-4 w-1/2" />
        <div className="pt-2 flex gap-2">
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </Card>
  )
}
