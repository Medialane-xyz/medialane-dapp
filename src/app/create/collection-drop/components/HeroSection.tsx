'use client';

import { MintCard } from './MintCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { DROP_DATA } from '@/lib/data/drop-data';

export function HeroSection() {
    const { collection, mint } = DROP_DATA;

    return (
        <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-background">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px]" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.15]" />
            </div>

            <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center px-4 py-20">

                {/* Left Column: Content */}
                <div className="space-y-8">
                    <Badge variant="outline" className="px-4 py-1.5 border-primary/50 text-primary bg-primary/10 rounded-full backdrop-blur-md">
                        {collection.name} Drop
                    </Badge>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 leading-tight">
                        Unlock the <br />
                        <span className="text-primary">Digital Future</span>
                    </h1>

                    <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
                        {collection.description}
                    </p>


                    <div className="flex flex-col gap-4 pt-4">
                        <div className="flex items-center gap-4 text-sm text-foreground/80 font-mono bg-white/5 w-fit px-4 py-2 rounded-lg border border-white/10">
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                Live: {new Date(mint.startDate).toLocaleDateString()} - {new Date(mint.endDate).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Mint Card & Visuals */}
                <div className="relative flex justify-center lg:justify-end">
                    {/* 3D Float Effect Wrapper */}
                    <div className="relative w-full max-w-md">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-30 animate-pulse" />
                        <MintCard />
                    </div>
                </div>
            </div>
        </div>
    );
}
