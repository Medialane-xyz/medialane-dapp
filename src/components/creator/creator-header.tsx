"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, CheckCircle2, Twitter, Instagram, Globe } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreatorData } from "@/components/creator/creator-data-context";

export function CreatorHeader() {
    const {
        headerImage,
        avatarImage,
        creatorInfo,
        collectionsLoading,
        assetsLoading,
        collections,
        standardTokens,
    } = useCreatorData();

    const isLoading = collectionsLoading;

    const handleShare = () => {
        if (typeof navigator !== 'undefined') {
            if (navigator.share) {
                navigator.share({
                    title: `Creator ${creatorInfo.name}`,
                    url: window.location.href,
                }).catch(() => { });
            } else {
                navigator.clipboard.writeText(window.location.href);
            }
        }
    };

    if (isLoading) {
        return <HeaderSkeleton />;
    }

    return (
        <div className="relative overflow-hidden -mt-[88px] pt-[150px] pb-24 min-h-[400px] flex flex-col justify-center bg-background">

            {/* --- Background Layer --- */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-background" />

                {headerImage ? (
                    <Image
                        src={headerImage}
                        alt="Background"
                        fill
                        className="object-cover opacity-50 blur-[60px] scale-110 saturate-150"
                        priority
                        sizes="100vw"
                    />
                ) : (
                    <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-outrun-magenta/30 via-neon-cyan/20 to-transparent blur-3xl" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            </div>

            {/* --- Content Layer --- */}
            <div className="relative z-10 container mx-auto px-4 max-w-7xl">
                <div className="flex flex-col items-center justify-center gap-8 text-center pt-8">

                    {/* Avatar */}
                    <div className="relative group">
                        <div className={`absolute -inset-4 rounded-full blur-2xl opacity-60 transition-opacity duration-1000 ${avatarImage ? "bg-outrun-magenta/50" : "bg-gradient-to-r from-outrun-magenta via-outrun-purple to-neon-cyan"}`} />

                        <div className="relative h-64 w-64 rounded-full overflow-hidden shadow-neon-magenta/30 backdrop-blur-xl bg-background/50 border-4 border-white/20 dark:border-white/10">
                            {avatarImage ? (
                                <Image
                                    src={avatarImage}
                                    alt={creatorInfo.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    priority
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-tr from-outrun-magenta/20 via-outrun-purple/10 to-neon-cyan/20 flex items-center justify-center">
                                    <div className="w-full h-full absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent opacity-50" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-3 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-backwards glass-panel p-8 rounded-3xl mt-4">

                        {/* Name + Verified Badge */}
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-bold tracking-tight text-foreground drop-shadow-sm font-sans">
                                {creatorInfo.name}
                            </h1>
                            {creatorInfo.verified && (
                                <Badge variant="secondary" className="flex items-center gap-1 px-2 py-0.5 bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan shadow-glow-sm shadow-neon-cyan/20">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-neon-cyan" />
                                    <span className="text-xs">Verified</span>
                                </Badge>
                            )}
                        </div>

                        {/* Bio */}
                        {creatorInfo.bio && (
                            <p className="text-muted-foreground/80 max-w-md text-sm">{creatorInfo.bio}</p>
                        )}

                        {/* Stats Row */}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>
                                <span className="font-semibold text-foreground">
                                    {collectionsLoading ? "—" : collections.length}
                                </span>{" "}
                                Collections
                            </span>
                            <span className="text-muted-foreground/40">·</span>
                            <span>
                                <span className="font-semibold text-foreground">
                                    {assetsLoading ? "—" : standardTokens.length}
                                </span>{" "}
                                Assets
                            </span>
                        </div>

                        {/* Social Links */}
                        {(creatorInfo.twitter || creatorInfo.instagram || creatorInfo.website) && (
                            <div className="flex items-center gap-2">
                                {creatorInfo.twitter && (
                                    <a
                                        href={creatorInfo.twitter}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-full bg-white/5 backdrop-blur-md hover:bg-outrun-cyan/20 text-muted-foreground hover:text-outrun-cyan hover:shadow-glow-sm hover:shadow-neon-cyan/30 transition-all duration-300"
                                    >
                                        <Twitter className="h-4 w-4" />
                                    </a>
                                )}
                                {creatorInfo.instagram && (
                                    <a
                                        href={creatorInfo.instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-full bg-white/5 backdrop-blur-md hover:bg-outrun-magenta/20 text-muted-foreground hover:text-outrun-magenta hover:shadow-glow-sm hover:shadow-neon-magenta/30 transition-all duration-300"
                                    >
                                        <Instagram className="h-4 w-4" />
                                    </a>
                                )}
                                {creatorInfo.website && (
                                    <a
                                        href={creatorInfo.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-full bg-white/5 backdrop-blur-md hover:bg-neon-cyan/20 text-muted-foreground hover:text-neon-cyan hover:shadow-glow-sm hover:shadow-neon-cyan/30 transition-all duration-300"
                                    >
                                        <Globe className="h-4 w-4" />
                                    </a>
                                )}
                            </div>
                        )}

                        {/* Share Button */}
                        <div className="mt-2">
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={handleShare}
                                className="h-11 px-8 border-white/20 hover:bg-white/10 hover:border-white/30 hover:text-outrun-magenta transition-all duration-300 rounded-full glass-panel active:scale-95"
                            >
                                <Share2 className="mr-2 h-4 w-4" />
                                Share Profile
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

function HeaderSkeleton() {
    return (
        <div className="relative overflow-hidden -mt-[88px] pt-[150px] pb-24 min-h-[400px] flex flex-col justify-center bg-background">
            <div className="relative z-10 container mx-auto px-4 max-w-7xl">
                <div className="flex flex-col items-center justify-center gap-8">
                    <Skeleton className="h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-background" />
                    <div className="flex flex-col items-center gap-4 w-full max-w-md">
                        <Skeleton className="h-10 w-64 rounded-xl" />
                        <Skeleton className="h-8 w-40 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}
