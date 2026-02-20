"use client";

import { PageHeader } from "@/components/page-header";
import { LicensingExplorer } from "./LicensingExplorer";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Sparkles, Handshake, Landmark } from "lucide-react";
import { motion } from "framer-motion";

export default function LicensingPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-[1400px]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden rounded-3xl glass border border-white/10 p-8 md:p-12 mb-10 bg-gradient-to-br from-primary/10 via-background to-background"
            >
                <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                    <ShieldCheck className="w-64 h-64" />
                </div>

                <div className="relative z-10 max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
                        <Sparkles className="w-4 h-4" />
                        <span>Programmable IP Licensing</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-balance">
                        Monetize and Acquire True Digital Assets
                    </h1>

                    <p className="text-lg text-muted-foreground mb-10 max-w-2xl text-pretty leading-relaxed">
                        Transform your intellectual property into programmable assets. Set your terms, manage global rights, and automate revenue sharing seamlessly on-chain.
                    </p>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <Card className="bg-white/5 border-white/10">
                            <CardContent className="p-4 flex items-start gap-4">
                                <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
                                    <Landmark className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm mb-1">For Creators</h3>
                                    <p className="text-xs text-muted-foreground leading-snug">Define bespoke licensing terms, manage adaptations, and secure your creative rights.</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/5 border-white/10">
                            <CardContent className="p-4 flex items-start gap-4">
                                <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-500 shrink-0">
                                    <Handshake className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm mb-1">For Businesses</h3>
                                    <p className="text-xs text-muted-foreground leading-snug">Discover ready-to-license IP, make offers, and secure usage rights instantly.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </motion.div>

            <LicensingExplorer />
        </div>
    );
}
