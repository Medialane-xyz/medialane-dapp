"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSubmitLicenseOffer } from "./licensingService";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface LicenseOfferModalProps {
    assetId: string;
    collectionAddress: string;
    tokenId: string; // Separated for clarity in service
    ownerAddress: string;
    controlledOpen?: boolean;
    onControlledClose?: () => void;
}

export function LicenseOfferModal({
    assetId,
    collectionAddress,
    tokenId,
    ownerAddress,
    controlledOpen,
    onControlledClose
}: LicenseOfferModalProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const [usage, setUsage] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [royalty, setRoyalty] = useState<string>("");
    const [duration, setDuration] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    // Use controlled state if provided, otherwise internal
    const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
    const setIsOpen = (open: boolean) => {
        if (onControlledClose && !open) {
            onControlledClose();
        }
        if (controlledOpen === undefined) {
            setInternalOpen(open);
        }
    };

    const { submitOnChainOffer } = useSubmitLicenseOffer();
    const { toast } = useToast();

    const handleSubmit = async () => {
        if (!usage || !price || !royalty || !duration) {
            toast({
                title: "Missing Fields",
                description: "Please fill in all fields.",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);
        try {
            await submitOnChainOffer({
                assetId,
                collectionAddress,
                tokenId,
                ownerAddress,
                terms: {
                    usage,
                    price, // Ensure this is converted to BigInt string if needed by service, but service accepts string
                    royalty: parseFloat(royalty),
                    duration: parseInt(duration) * 86400, // Convert days to seconds
                    licenseType: "custom",
                    geographicScope: "worldwide"
                }
            });

            toast({
                title: "Offer Submitted",
                description: "Your license offer has been posted on-chain.",
            });
            setIsOpen(false);
        } catch (error: any) {
            console.error("Error submitting offer:", error);
            toast({
                title: "Error",
                description: error.message || "Failed to submit offer.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full">Make Bespoke Offer</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-background text-foreground border-border">
                <DialogHeader>
                    <DialogTitle>Create License Offer</DialogTitle>
                    <DialogDescription>
                        Propose terms to the owner for specific usage rights.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="usage" className="text-right">
                            Usage
                        </Label>
                        <Select onValueChange={setUsage} value={usage}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select usage type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Soundtrack">Soundtrack</SelectItem>
                                <SelectItem value="Commercial Adaptation">Commercial Adaptation</SelectItem>
                                <SelectItem value="Digital Merch">Digital Merch</SelectItem>
                                <SelectItem value="Public Performance">Public Performance</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">
                            Price ($STRK)
                        </Label>
                        <Input
                            id="price"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="col-span-3"
                            placeholder="e.g. 100"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="royalty" className="text-right">
                            Royalty (%)
                        </Label>
                        <Input
                            id="royalty"
                            type="number"
                            value={royalty}
                            onChange={(e) => setRoyalty(e.target.value)}
                            className="col-span-3"
                            placeholder="e.g. 5"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="duration" className="text-right">
                            Duration (Days)
                        </Label>
                        <Input
                            id="duration"
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="col-span-3"
                            placeholder="e.g. 365"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting Offer to Blockchain...
                            </>
                        ) : (
                            "Sign & Post to Chain"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
