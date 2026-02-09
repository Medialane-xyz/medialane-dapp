'use client';

import { useState, useEffect } from 'react';
import { useMint } from '@/hooks/useMint';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Minus, Plus, Loader2, Wallet, Zap } from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { DROP_DATA } from '@/lib/data/drop-data';
import { cn } from '@/lib/utils';

export function DropControls() {
    const [quantity, setQuantity] = useState(1);
    const [mounted, setMounted] = useState(false);
    const { status, mint, error, txHash, reset, totalMinted } = useMint();
    const { price, maxSupply, maxPerWallet, currencySymbol, isLive, startDate, endDate } = DROP_DATA.mint;

    // Simulate wallet connection
    const isConnected = true;
    const userBalance = "12.5";

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleMint = async () => {
        if (!isConnected) return;
        await mint(quantity);
        if (status === 'success') {
            confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#FF00FF', '#00FFFF', '#FF9900'] });
            toast.success('Mint Successful!', { description: `Secured ${quantity}x ${DROP_DATA.collection.symbol}` });
        }
    };

    const handleQuantityChange = (delta: number) => {
        setQuantity(prev => Math.max(1, Math.min(maxPerWallet, prev + delta)));
    };

    if (!mounted) return null;

    const percentMinted = (totalMinted / maxSupply) * 100;

    return (
        <div className="flex flex-col gap-6 h-full">
            {/* Header / Title Block */}
            <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                    <span className="glass-vivid px-2 py-0.5 rounded text-[10px] uppercase font-bold text-outrun-cyan border border-outrun-cyan/30 tracking-widest">
                        Genesis Drop
                    </span>
                    {isLive && (
                        <span className="glass-vivid px-2 py-0.5 rounded text-[10px] uppercase font-bold text-green-400 border border-green-500/30 tracking-widest animate-pulse">
                            Live Now
                        </span>
                    )}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50">
                    {DROP_DATA.collection.name}
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
                    {DROP_DATA.collection.description}
                </p>
            </div>

            {/* Minting Command Module */}
            <div className="glass-vivid p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-50 pointer-events-none">
                    <Zap className="w-24 h-24 text-white/5 -rotate-12" />
                </div>

                {/* Status Bar */}
                <div className="space-y-4 mb-8 relative z-10">
                    <div className="flex justify-between text-sm font-mono">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-outrun-cyan font-bold">{percentMinted.toFixed(1)}%</span>
                    </div>
                    <div className="h-3 w-full bg-black/50 rounded-full overflow-hidden border border-white/5">
                        <div
                            className="h-full bg-gradient-to-r from-outrun-magenta to-outrun-cyan transition-all duration-1000 ease-out relative"
                            style={{ width: `${percentMinted}%` }}
                        >
                            <div className="absolute inset-0 bg-white/20 animate-shimmer-vivid" />
                        </div>
                    </div>
                    <div className="flex justify-between text-xs font-mono text-muted-foreground">
                        <span>{totalMinted} Minted</span>
                        <span>{maxSupply} Total Supply</span>
                    </div>
                </div>

                {/* Controls Area */}
                <div className="bg-black/40 rounded-xl p-4 border border-white/5 space-y-4 relative z-10">
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground uppercase tracking-widest">Price</span>
                            <span className="text-2xl font-bold font-mono text-white">{price} <span className="text-sm font-normal text-muted-foreground">{currencySymbol}</span></span>
                        </div>

                        <div className="flex items-center gap-1 bg-black/60 rounded-lg p-1 border border-white/10">
                            <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1} className="h-10 w-10 hover:bg-white/10 text-white">
                                <Minus className="w-4 h-4" />
                            </Button>
                            <div className="w-12 text-center font-bold font-mono text-xl">{quantity}</div>
                            <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(1)} disabled={quantity >= maxPerWallet} className="h-10 w-10 hover:bg-white/10 text-white">
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Total & Action */}
                    <div className="pt-4 border-t border-white/5">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm font-medium text-muted-foreground">Total</span>
                            <span className="text-xl font-bold font-mono text-outrun-cyan">{(price * quantity).toFixed(2)} {currencySymbol}</span>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-mono">
                                {error}
                            </div>
                        )}

                        <Button
                            className={cn(
                                "w-full h-14 text-lg font-bold uppercase tracking-wider transition-all duration-300",
                                isConnected ? "gradient-vivid-outrun hover:shadow-[0_0_30px_rgba(255,0,255,0.4)]" : "bg-muted text-muted-foreground"
                            )}
                            disabled={status === 'loading' || !isLive || !isConnected}
                            onClick={handleMint}
                        >
                            {status === 'loading' ? (
                                <span className="flex items-center gap-2"><Loader2 className="animate-spin" /> Processing</span>
                            ) : (
                                <span>Mint Now</span>
                            )}
                        </Button>
                        <p className="text-center text-[10px] text-muted-foreground mt-3 uppercase tracking-wider">
                            Max {maxPerWallet} per wallet • Gas fees apply
                        </p>
                    </div>
                </div>

                {/* Wallet Status */}
                <div className="mt-6 flex items-center justify-between text-xs font-mono text-muted-foreground bg-white/5 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                        <Wallet className={cn("w-4 h-4", isConnected ? "text-green-400" : "text-gray-500")} />
                        <span>{isConnected ? "0x05f9...8a2b" : "Wallet Disconnected"}</span>
                    </div>
                    {isConnected && (
                        <span className="text-white">{userBalance} ETH</span>
                    )}
                </div>
            </div>
        </div>
    );
}
