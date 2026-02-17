"use client";

import React, { useState } from "react";
import { useConnect, useAccount, useDisconnect } from "@starknet-react/core";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Wallet,
  LogOut,
  AlertCircle
} from "lucide-react";
import { useNetwork } from "@/components/starknet-provider";
import { StarknetkitConnector, useStarknetkitConnectModal } from "starknetkit";
import { Badge } from "../ui/badge";

export function WalletConnect() {
  const { connectAsync, connectors } = useConnect();
  const { address, isConnected, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  const [open, setOpen] = useState(false);
  const { currentNetwork, networkConfig } = useNetwork();

  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: connectors as StarknetkitConnector[],
    modalTheme: "dark",
  });

  // Handle wallet connection
  const handleConnect = async () => {
    try {
      const { connector } = await starknetkitConnectModal();
      if (!connector) {
        return;
      }
      await connectAsync({ connector });
    } catch (err) {
      console.error("Failed to connect wallet", err);
    }
  };

  // Handle disconnect
  const handleDisconnect = async () => {
    disconnect();
    setOpen(false);
  };

  // Determine display address
  const displayAddress = address;

  // Network check
  const isWrongNetwork = isConnected && chainId && BigInt(chainId).toString() !== networkConfig.chainId;

  if (isConnected) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`relative rounded-full h-9 w-9 transition-all duration-300
              ${isWrongNetwork
                ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/30"
                : "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/5 dark:border-white/5 text-foreground shadow-[0_0_15px_rgba(16,185,129,0.05)] dark:shadow-[0_0_20px_rgba(16,185,129,0.1)]"}`}
          >
            <Wallet className="h-4 w-4" />
            <span
              className={`absolute top-2 right-2 h-2 w-2 rounded-full border border-background
                ${isWrongNetwork ? "bg-red-500" : "bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"}`}
            />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">Account</DialogTitle>
            <DialogDescription className="text-sm text-foreground">
              Connected: {displayAddress?.slice(0, 6)}...{displayAddress?.slice(-4)} on {networkConfig.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            {isWrongNetwork && (
              <div className="alert alert-error bg-red-900/20 border-red-900 text-red-200">
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm font-semibold">
                  Wrong Network Detected
                </p>
                <p className="text-xs">
                  Please switch your wallet to <span className="font-bold">{networkConfig.name}</span> to continue using the app.
                </p>
              </div>
            )}
            <div className="flex gap-4 items-center justify-between">
              <Button
                variant="destructive"
                onClick={handleDisconnect}
                className="flex items-center w-full"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Disconnect
              </Button>
            </div>
            <div className="alert alert-warning">
              <Badge variant="secondary" className="text-sm">
                @ Starknet {process.env.NEXT_PUBLIC_STARKNET_NETWORK}
              </Badge>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full h-9 w-9 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/5 dark:border-white/5 transition-all text-foreground"
      onClick={handleConnect}
    >
      <Wallet className="h-4 w-4" />
    </Button>
  );
}
