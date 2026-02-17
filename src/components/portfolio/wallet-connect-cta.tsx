"use client";

import React from "react";
import { useConnect } from "@starknet-react/core";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Wallet } from "lucide-react";
import { StarknetkitConnector, useStarknetkitConnectModal } from "starknetkit";

interface WalletConnectCTAProps {
    title?: string;
    description?: string;
}

export function WalletConnectCTA({
    title = "Unlock Your Portfolio",
    description = "Connect your wallet to view and manage your digital assets across the Starknet ecosystem."
}: WalletConnectCTAProps) {
    const { connectAsync, connectors } = useConnect();

    const { starknetkitConnectModal } = useStarknetkitConnectModal({
        connectors: connectors as StarknetkitConnector[],
        modalTheme: "dark",
    });

    const handleConnect = async () => {
        try {
            const { connector } = await starknetkitConnectModal();
            if (!connector) return;
            await connectAsync({ connector });
        } catch (err) {
            console.error("Failed to connect wallet", err);
        }
    };

    return (
        <div className="flex items-center justify-center py-12 px-4">
            <Card className="w-full max-w-md border-2 border-dashed border-muted bg-transparent hover:border-muted-foreground/30 transition-colors duration-300">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                        <Wallet className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-2xl font-bold">{title}</CardTitle>
                    <CardDescription className="text-base text-muted-foreground mt-2">
                        {description}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center pb-8 pt-6">
                    <Button
                        size="lg"
                        onClick={handleConnect}
                        className="w-full sm:w-auto px-8 py-6 text-lg rounded-xl transition-all hover:scale-105 active:scale-95"
                    >
                        Connect Wallet
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
