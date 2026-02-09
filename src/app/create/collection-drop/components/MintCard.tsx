'use client';

import { useState, useEffect } from 'react';
import { useMint } from '@/hooks/useMint';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Minus, Plus, Loader2, Sparkles, CheckCircle2, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { DROP_DATA } from '@/lib/data/drop-data';

export function MintCard() {
    const [quantity, setQuantity] = useState(1);
    const [mounted, setMounted] = useState(false);
    const { status, mint, error, txHash, reset, totalMinted } = useMint();

    const { price, maxSupply, maxPerWallet, currencySymbol, isLive, startDate } = DROP_DATA.mint;

    // Simulate wallet connection for UI utility
    const isConnected = true;
    const userBalance = "12.5 ETH";

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleMint = async () => {
        if (!isConnected) return;
        await mint(quantity);
        if (status === 'success') {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
            toast.success('Mint Successful!', {
                description: `You successfully minted ${quantity} items.`
            });
        }
    };

    const handleQuantityChange = (delta: number) => {
        setQuantity(prev => Math.max(1, Math.min(maxPerWallet, prev + delta)));
    };

    if (!mounted) return null;

    if (status === 'success') {
        return (
            <Card className="w-full max-w-md p-8 bg-black/60 backdrop-blur-xl border-primary/20 flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-2">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Mint Successful!</h3>
                    <p className="text-muted-foreground text-sm mb-4">You are now a holder.</p>
                    <div className="bg-black/40 p-3 rounded-lg border border-white/5 text-xs font-mono break-all">
                        <span className="text-muted-foreground">Tx: </span>
                        <a
                            href={`https://starkscan.co/${txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                        >
                            {txHash}
                        </a>
                    </div>
                </div>
                <Button onClick={reset} variant="outline" className="w-full">
                    Mint Again
                </Button>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md p-0 bg-black/60 backdrop-blur-xl border-white/10 shadow-2xl relative overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-white/5 bg-white/5">
                <div className="flex justify-between items-center mb-1">
                    <h3 className="text-lg font-bold font-mono">Public Sale</h3>
                    {isLive ? (
                        <span className="flex items-center gap-2 text-xs font-medium text-green-400 bg-green-900/20 px-2 py-1 rounded border border-green-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                            Live
                        </span>
                    ) : (
                        <span className="text-xs font-medium text-muted-foreground bg-white/5 px-2 py-1 rounded">
                            Starts {new Date(startDate).toLocaleDateString()}
                        </span>
                    )}
                </div>
                <div className="flex justify-between items-end">
                    <div className="text-sm text-muted-foreground">
                        <p>Total Minted</p>
                        <p className="text-foreground font-mono font-medium">{totalMinted} <span className="text-muted-foreground">/ {maxSupply}</span></p>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                        <p>Price</p>
                        <p className="text-foreground font-mono font-medium">{price} {currencySymbol}</p>
                    </div>
                </div>
                <Progress value={(totalMinted / maxSupply) * 100} className="h-1.5 mt-4 bg-white/10" />
            </div>

            <div className="p-6 space-y-6">

                {/* Wallet Info (Utility addition) */}
                <div className="flex justify-between items-center text-xs p-3 bg-primary/5 border border-primary/10 rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Wallet className="w-3.5 h-3.5" />
                        <span>Wallet: {isConnected ? 'Connected' : 'Not Connected'}</span>
                    </div>
                    {isConnected && <span className="font-mono text-primary">{userBalance}</span>}
                </div>

                {/* Action Area */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Quantity</span>
                        <div className="flex items-center gap-3 bg-black/30 rounded-lg p-1 border border-white/5">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-white/10"
                                onClick={() => handleQuantityChange(-1)}
                                disabled={quantity <= 1}
                            >
                                <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-8 text-center font-bold font-mono">{quantity}</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-white/10"
                                onClick={() => handleQuantityChange(1)}
                                disabled={quantity >= maxPerWallet}
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex justify-between items-center font-bold text-lg pt-2 border-t border-white/5">
                        <span>Total</span>
                        <span className="font-mono">{(price * quantity).toFixed(2)} {currencySymbol}</span>
                    </div>
                </div>

                {error && (
                    <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                        {error}
                    </div>
                )}

                <Button
                    className="w-full h-12 text-base font-bold"
                    disabled={status === 'loading' || !isLive || !isConnected}
                    onClick={handleMint}
                >
                    {status === 'loading' ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Processing...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            Mint {quantity} Item{quantity > 1 ? 's' : ''}
                        </span>
                    )}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                    Max allowed: {maxPerWallet} per wallet
                </p>
            </div>
        </Card>
    );
}
