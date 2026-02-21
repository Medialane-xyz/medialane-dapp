"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { CollectionAsset } from "@/hooks/use-collection-assets";
import { Asset } from "@/types/asset";
import AssetCardGlobal from "@/components/asset-card";

interface ProgressiveAssetGridProps {
  assets: CollectionAsset[];
  loading: boolean;
  loadedCount: number;
  totalCount: number;
  error?: string | null;
}

export function ProgressiveAssetGrid({
  assets,
  loading,
  totalCount,
  error
}: ProgressiveAssetGridProps) {
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="mb-2">Unable to load collection assets</p>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (assets.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No assets found in this collection.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with progress */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">
          Collection Assets ({assets.length})
          {loading && assets.length > 0 && (
            <span className="text-sm text-muted-foreground ml-2">Loading more…</span>
          )}
        </h3>
        {loading && assets.length === 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading items…</span>
          </div>
        )}
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {assets.map((asset) => (
          <AssetCardGlobal
            key={asset.id}
            asset={{
              id: asset.id,
              name: asset.name,
              description: "",
              image: asset.image || "",
              collection: asset.id.split('-')[0] || "",
              creator: "",
              type: "NFT",
              licenseType: "all-rights-reserved",
            }}
          />
        ))}

        {/* Render loading skeletons for remaining items */}
        {loading && Array.from({ length: Math.max(0, totalCount - assets.length) }).map((_, index) => (
          <AssetSkeleton key={`loading-${index}`} />
        ))}
      </div>

      {/* Loading indicator */}
      {loading && assets.length > 0 && (
        <div className="text-center py-4 text-sm text-muted-foreground">Loading more…</div>
      )}
    </div>
  );
}



function AssetSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-square overflow-hidden">
        <Skeleton className="h-full w-full" />
      </div>
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-8" />
        </div>
      </CardContent>
    </Card>
  );
}
