"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prepareOrderForSigning } from "@/lib/hash";
import { useNetwork } from "@starknet-react/core";
import { Check, Copy, Bug } from "lucide-react";

interface DebugSignatureProps {
    orderParams: any;
    isOpen?: boolean;
}

export function DebugSignature({ orderParams }: DebugSignatureProps) {
    const { chain } = useNetwork();
    const [typedData, setTypedData] = useState<any>(null);
    const [copied, setCopied] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (orderParams && chain) {
            try {
                const td = prepareOrderForSigning(orderParams, chain.id.toString());
                // Convert BigInts to string for display/JSON
                const jsonSafe = JSON.parse(JSON.stringify(td, (_, v) =>
                    typeof v === 'bigint' ? v.toString() : v
                ));
                setTypedData(jsonSafe);
            } catch (e) {
                console.error("Failed to prepare typed data for debug", e);
                setTypedData({ error: String(e) });
            }
        }
    }, [orderParams, chain]);

    if (!orderParams) return null;

    const copyToClipboard = () => {
        const text = JSON.stringify({
            orderParams,
            typedData,
            chainId: chain?.id.toString()
        }, null, 2);

        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="mt-4 border-t pt-4">
            <Button
                variant="outline"
                size="sm"
                onClick={() => setIsVisible(!isVisible)}
                className="w-full mb-2 flex items-center justify-between"
            >
                <span className="flex items-center gap-2">
                    <Bug className="h-4 w-4" /> Debug Signing Data
                </span>
                <span className="text-xs text-muted-foreground">{isVisible ? "Hide" : "Show"}</span>
            </Button>

            {isVisible && (
                <Card className="bg-slate-950 border-slate-800 text-xs font-mono">
                    <CardHeader className="py-2 px-4 border-b border-slate-800 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm">SNIP-12 Data Inspector</CardTitle>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyToClipboard}>
                            {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="grid grid-cols-2 divide-x divide-slate-800">
                            <div className="p-3 overflow-auto max-h-[300px]">
                                <h4 className="font-bold text-slate-400 mb-1">Raw Params</h4>
                                <pre>{JSON.stringify(orderParams, (_, v) =>
                                    typeof v === 'bigint' ? v.toString() : v
                                    , 2)}</pre>
                            </div>
                            <div className="p-3 overflow-auto max-h-[300px]">
                                <h4 className="font-bold text-slate-400 mb-1">Typed Data (Message)</h4>
                                <pre>{JSON.stringify(typedData?.message || typedData, null, 2)}</pre>
                            </div>
                        </div>
                        <div className="p-2 border-t border-slate-800 bg-slate-900/50">
                            <p className="text-slate-500">Chain ID: {chain?.id.toString()}</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
