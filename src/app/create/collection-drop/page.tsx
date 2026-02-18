'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useDropForm } from '@/hooks/use-drop-form';
import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Rocket, Loader, Image as ImageIcon, ArrowLeft, Shield, Briefcase, Crown,
    Globe, Users, Lock, CalendarIcon, Info, Upload, X, FileText
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useDropzone } from 'react-dropzone';
import { licenseTypes, geographicScopes } from '@/types/asset';
import { PageHeader } from "@/components/page-header"

export default function CreateDropPage() {
    const {
        // Basic Info
        name, setName, symbol, setSymbol, description, setDescription,
        // Mint Config
        price, supply, maxPerWallet, startDate, enableWhitelist, whitelistFile,
        setSupply, setPrice, setStartDate, setMaxPerWallet, setEnableWhitelist, setWhitelistFile,
        // Visuals
        coverImage, setCoverImage, revealType, setRevealType, placeholderImage, setPlaceholderImage,
        // Licensing
        licenseType, setLicenseType, customLicense, setCustomLicense,
        geographicScope, setGeographicScope, territory, setTerritory,
        licenseDuration, setLicenseDuration, fieldOfUse, setFieldOfUse,
        aiRights, setAiRights,
        // Economics
        royaltyPercentage, setRoyaltyPercentage, payoutAddress, setPayoutAddress,
        // Validation
        canSubmit
    } = useDropForm();

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Dropzone Callbacks
    const onDropCover = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) setCoverImage(acceptedFiles[0]);
    }, [setCoverImage]);

    const onDropPlaceholder = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) setPlaceholderImage(acceptedFiles[0]);
    }, [setPlaceholderImage]);

    const { getRootProps: getCoverProps, getInputProps: getCoverInputProps, isDragActive: isCoverDrag } = useDropzone({
        onDrop: onDropCover,
        maxFiles: 1,
        accept: { 'image/*': [] }
    });

    const { getRootProps: getPlaceholderProps, getInputProps: getPlaceholderInputProps, isDragActive: isPlaceholderDrag } = useDropzone({
        onDrop: onDropPlaceholder,
        maxFiles: 1,
        accept: { 'image/*': [] }
    });

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsSubmitting(false);
        toast.success("Collection Drop Created!", { description: "Your drop is now live on the testnet." });
    };

    const getLicenseIcon = () => {
        switch (licenseType) {
            case 'commercial': return <Briefcase className="w-3 h-3" />;
            case 'exclusive': return <Crown className="w-3 h-3" />;
            default: return <Shield className="w-3 h-3" />;
        }
    };

    const getLicenseLabel = () => {
        switch (licenseType) {
            case 'commercial': return 'Commercial Rights';
            case 'exclusive': return 'Exclusive Rights';
            case 'custom': return 'Custom License';
            default: return 'Personal License';
        }
    };

    const selectedLicense = licenseTypes.find((license) => license.id === licenseType) || licenseTypes[0];

    return (
        <div className="min-h-screen text-foreground py-10 relative overflow-hidden">




            <main className="container mx-auto px-4 py-8 relative z-10">
                <PageHeader
                    title="Create Collection Drop"
                    description="Launch a high-quality NFT collection with built-in scarcity, reveal mechanics, and programmable IP rights."
                    className="mb-8"
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Unified Form */}
                    <div className="lg:col-span-2 space-y-8">

                        <Card className="glass-card">
                            <CardContent className="p-8 space-y-12">

                                {/* Section 1: Collection Identity */}
                                <section className="space-y-6">
                                    <div className="flex items-center gap-3 pb-2 border-b border-border/40">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold border border-primary/20">1</div>
                                        <h2 className="text-xl font-semibold">Collection Identity</h2>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Collection Name</Label>
                                            <Input
                                                id="name"
                                                placeholder="e.g. Cosmic Horizons"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="bg-background"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="symbol">Symbol</Label>
                                            <Input
                                                id="symbol"
                                                placeholder="e.g. COSMIC"
                                                value={symbol}
                                                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                                                maxLength={10}
                                                className="bg-background uppercase"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                The ticker symbol for your collection (max 10 chars).
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="description">Description</Label>
                                            <Textarea
                                                id="description"
                                                placeholder="Tell the story behind your collection..."
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                className="min-h-[120px] bg-background resize-none"
                                            />
                                        </div>
                                    </div>
                                </section>

                                {/* Section 2: Assets & Reveal */}
                                <section className="space-y-6">
                                    <div className="flex items-center gap-3 pb-2 border-b border-border/40">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold border border-primary/20">2</div>
                                        <h2 className="text-xl font-semibold">Assets & Reveal</h2>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Reveal Strategy Selection */}
                                        <div className="space-y-3">
                                            <Label className="text-base">Reveal Strategy</Label>
                                            <div className="grid grid-cols-2 gap-4 bg-muted/20 p-1 rounded-lg">
                                                <button
                                                    onClick={() => setRevealType('instant')}
                                                    className={cn(
                                                        "py-2 px-4 rounded-md text-sm font-medium transition-all",
                                                        revealType === 'instant' ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted/40"
                                                    )}
                                                >
                                                    Instant Reveal
                                                </button>
                                                <button
                                                    onClick={() => setRevealType('delayed')}
                                                    className={cn(
                                                        "py-2 px-4 rounded-md text-sm font-medium transition-all",
                                                        revealType === 'delayed' ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted/40"
                                                    )}
                                                >
                                                    Delayed Reveal
                                                </button>
                                            </div>
                                        </div>

                                        {/* Cover Image Upload */}
                                        <div className="space-y-3">
                                            <Label className="text-base">Cover Image</Label>
                                            <div
                                                {...getCoverProps()}
                                                className={cn(
                                                    "border-2 border-dashed rounded-xl p-8 transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[200px] gap-3",
                                                    isCoverDrag ? "border-primary bg-primary/10" : "border-border hover:bg-muted/10",
                                                    coverImage ? "border-solid border-primary/50" : ""
                                                )}
                                            >
                                                <input {...getCoverInputProps()} />
                                                {coverImage ? (
                                                    <div className="relative w-full h-full flex flex-col items-center">
                                                        <img
                                                            src={URL.createObjectURL(coverImage)}
                                                            alt="Cover"
                                                            className="max-h-[180px] rounded-lg object-contain shadow-md"
                                                        />
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setCoverImage(null);
                                                            }}
                                                            className="absolute -top-2 -right-2 bg-destructive text-white p-1 rounded-full shadow-lg hover:bg-destructive/90"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                        <p className="mt-2 text-sm text-green-500 font-medium">Image Selected</p>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="bg-primary/10 p-4 rounded-full">
                                                            <Upload className="w-6 h-6 text-primary" />
                                                        </div>
                                                        <div className="text-center space-y-1">
                                                            <p className="font-medium text-sm">Click to upload or drag and drop</p>
                                                            <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Placeholder Image for Delayed Reveal */}
                                        {revealType === 'delayed' && (
                                            <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                                <Label className="text-base">Placeholder Image (Hidden State)</Label>
                                                <div
                                                    {...getPlaceholderProps()}
                                                    className={cn(
                                                        "border-2 border-dashed rounded-xl p-8 transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[200px] gap-3",
                                                        isPlaceholderDrag ? "border-primary bg-primary/10" : "border-border hover:bg-muted/10",
                                                        placeholderImage ? "border-solid border-primary/50" : ""
                                                    )}
                                                >
                                                    <input {...getPlaceholderInputProps()} />
                                                    {placeholderImage ? (
                                                        <div className="relative w-full h-full flex flex-col items-center">
                                                            <img
                                                                src={URL.createObjectURL(placeholderImage)}
                                                                alt="Placeholder"
                                                                className="max-h-[180px] rounded-lg object-contain shadow-md"
                                                            />
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setPlaceholderImage(null);
                                                                }}
                                                                className="absolute -top-2 -right-2 bg-destructive text-white p-1 rounded-full shadow-lg hover:bg-destructive/90"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div className="bg-primary/10 p-4 rounded-full">
                                                                <Upload className="w-6 h-6 text-primary" />
                                                            </div>
                                                            <div className="text-center space-y-1">
                                                                <p className="font-medium text-sm">Upload Unrevealed Image</p>
                                                                <p className="text-xs text-muted-foreground">Shown before metadata reveal</p>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </section>

                                {/* Section 3: Licensing Model */}
                                <section className="space-y-6">
                                    <div className="flex items-center gap-3 pb-2 border-b border-border/40">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold border border-primary/20">3</div>
                                        <h2 className="text-xl font-semibold">Licensing Model</h2>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <Label className="text-base font-medium">License Type</Label>
                                            <Select
                                                value={licenseType}
                                                onValueChange={(val: any) => setLicenseType(val)}
                                            >
                                                <SelectTrigger className="h-12 bg-background">
                                                    <SelectValue placeholder="Select license type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {licenseTypes.map((license) => {
                                                        const IconComponent = license.icon;
                                                        return (
                                                            <SelectItem key={license.id} value={license.id} className="py-3">
                                                                <div className="flex items-center gap-2 text-left">
                                                                    <IconComponent className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                                    <div className="flex flex-col gap-0.5">
                                                                        <span className="font-medium flex items-center gap-2">
                                                                            {license.name}
                                                                            {license.recommended && (
                                                                                <Badge variant="secondary" className="text-[10px] h-4 px-1">
                                                                                    Recommended
                                                                                </Badge>
                                                                            )}
                                                                        </span>
                                                                        <span className="text-xs text-muted-foreground line-clamp-1">
                                                                            {license.description}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </SelectItem>
                                                        );
                                                    })}
                                                </SelectContent>
                                            </Select>

                                            <div className="text-sm text-muted-foreground mt-2 p-3 bg-muted/30 rounded-md border flex gap-3 items-start">
                                                <selectedLicense.icon className="h-5 w-5 mt-0.5 text-primary" />
                                                <div>
                                                    <p className="font-medium text-foreground">{selectedLicense.name}</p>
                                                    <p>{selectedLicense.description}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Custom License Terms */}
                                        {licenseType === "custom" && (
                                            <div className="space-y-2">
                                                <Label htmlFor="customLicense" className="text-base font-medium">
                                                    Custom License Terms
                                                </Label>
                                                <Textarea
                                                    id="customLicense"
                                                    placeholder="Define your custom licensing terms and conditions..."
                                                    value={customLicense || ""}
                                                    onChange={(e) => setCustomLicense(e.target.value)}
                                                    rows={4}
                                                    className="resize-none bg-background"
                                                />
                                            </div>
                                        )}

                                        {/* Advanced Licensing Settings */}
                                        <div className="space-y-4 pt-4 border-t border-border/30">
                                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Advanced Rights</h3>

                                            <div className="space-y-2">
                                                <Label className="text-base font-medium flex items-center gap-2">
                                                    <Globe className="h-4 w-4" />
                                                    Geographic Protection Scope
                                                </Label>
                                                <Select
                                                    value={geographicScope}
                                                    onValueChange={(val: any) => setGeographicScope(val)}
                                                >
                                                    <SelectTrigger className="h-12 bg-background">
                                                        <SelectValue placeholder="Select geographic scope" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {geographicScopes.map((scope) => (
                                                            <SelectItem key={scope.value} value={scope.value}>
                                                                {scope.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="licenseDuration" className="text-base font-medium">License Duration</Label>
                                                    <Input
                                                        id="licenseDuration"
                                                        placeholder="e.g. Perpetual, 5 years..."
                                                        value={licenseDuration || ""}
                                                        onChange={(e) => setLicenseDuration(e.target.value)}
                                                        className="bg-background"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="fieldOfUse" className="text-base font-medium">Field of Use</Label>
                                                    <Input
                                                        id="fieldOfUse"
                                                        placeholder="e.g. All Media, Digital Only..."
                                                        value={fieldOfUse || ""}
                                                        onChange={(e) => setFieldOfUse(e.target.value)}
                                                        className="bg-background"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="aiRights" className="text-base font-medium">AI & Data Mining Policy</Label>
                                                <Input
                                                    id="aiRights"
                                                    placeholder="e.g. No AI Training allowed..."
                                                    value={aiRights || ""}
                                                    onChange={(e) => setAiRights(e.target.value)}
                                                    className="bg-background"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Section 4: Mint Schedule */}
                                <section className="space-y-6">
                                    <div className="flex items-center gap-3 pb-2 border-b border-border/40">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold border border-primary/20">4</div>
                                        <h2 className="text-xl font-semibold">Mint Schedule</h2>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Total Supply */}
                                        <div className="grid gap-2">
                                            <Label htmlFor="supply">Total Supply</Label>
                                            <Input
                                                id="supply"
                                                type="number"
                                                placeholder="10000"
                                                value={supply}
                                                onChange={(e) => setSupply(e.target.value)}
                                                className="bg-background"
                                            />
                                            <p className="text-xs text-muted-foreground">Fixed amount of tokens to mint.</p>
                                        </div>

                                        {/* Public Stage Settings */}
                                        <div className="space-y-4 pt-4 border-t border-border/30">
                                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Public Sale</h3>

                                            <div className="grid gap-2">
                                                <Label htmlFor="price">Mint Price (USDC)</Label>
                                                <div className="relative">
                                                    <Input
                                                        id="price"
                                                        type="number"
                                                        step="1"
                                                        placeholder="50"
                                                        value={price}
                                                        onChange={(e) => setPrice(e.target.value)}
                                                        className="pl-8 bg-background"
                                                    />
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                                                </div>
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="maxPerWallet">Max Per Wallet</Label>
                                                <Input
                                                    id="maxPerWallet"
                                                    type="number"
                                                    placeholder="5"
                                                    value={maxPerWallet}
                                                    onChange={(e) => setMaxPerWallet(e.target.value)}
                                                    className="bg-background"
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label>Start Date</Label>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full justify-start text-left font-normal bg-background",
                                                                !startDate && "text-muted-foreground"
                                                            )}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {startDate ? format(startDate, "PPP") : <span>Pick to start</span>}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={startDate}
                                                            onSelect={(d) => setStartDate(d)}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                        </div>

                                        {/* Whitelist Settings */}
                                        <div className="space-y-4 pt-4 border-t border-border/30">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                                    <Lock className="w-4 h-4" /> Whitelist Stage
                                                </h3>
                                                <Switch
                                                    checked={enableWhitelist}
                                                    onCheckedChange={(checked) => setEnableWhitelist(checked)}
                                                />
                                            </div>

                                            {enableWhitelist && (
                                                <div className="p-4 rounded-xl border border-dashed border-border bg-muted/20 animate-in fade-in slide-in-from-top-2">
                                                    <div className="space-y-4">
                                                        <Label>Whitelist Configuration</Label>
                                                        <div className="border border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:bg-background/50 transition-colors cursor-pointer" onClick={() => document.getElementById('whitelist-upload')?.click()}>
                                                            <div className="flex flex-col items-center gap-2">
                                                                <Users className="w-8 h-8 text-muted-foreground" />
                                                                <p className="text-sm font-medium">Upload CSV or JSON</p>
                                                                <Input
                                                                    type="file"
                                                                    className="hidden"
                                                                    id="whitelist-upload"
                                                                    onChange={(e) => {
                                                                        if (e.target.files?.[0]) setWhitelistFile(e.target.files[0]);
                                                                    }}
                                                                />
                                                                <Button variant="secondary" size="sm" type="button">
                                                                    {whitelistFile ? whitelistFile.name : "Select File"}
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">
                                                            Supported formats: .csv, .json (Array of strings).
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </section>

                                {/* Section 5: Economics */}
                                <section className="space-y-6">
                                    <div className="flex items-center gap-3 pb-2 border-b border-border/40">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold border border-primary/20">5</div>
                                        <h2 className="text-xl font-semibold">Economics</h2>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="grid gap-2">
                                            <Label htmlFor="royalty">Percentage (%)</Label>
                                            <div className="relative">
                                                <Input
                                                    id="royalty"
                                                    type="number"
                                                    placeholder="5"
                                                    min="0"
                                                    max="10"
                                                    step="0.5"
                                                    value={royaltyPercentage}
                                                    onChange={(e) => setRoyaltyPercentage(e.target.value)}
                                                    className="bg-background pl-4 pr-8"
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Info className="w-3 h-3" /> Recommended: 2.5% - 7.5%
                                            </p>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="payout">Payout Address</Label>
                                            <Input
                                                id="payout"
                                                placeholder="0x..."
                                                value={payoutAddress}
                                                onChange={(e) => setPayoutAddress(e.target.value)}
                                                className="bg-background font-mono"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Wallet address to receive secondary sales royalties.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                            </CardContent>
                        </Card>

                        {/* Action Bar */}
                        <div className="pt-4">
                            {isSubmitting ? (
                                <Button disabled className="w-full h-14 rounded-xl text-lg">
                                    <Loader className="animate-spin mr-2" /> Deploying Drop...
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={!canSubmit()}
                                    className="w-full h-14 rounded-xl text-lg font-bold"
                                >
                                    Deploy Drop <Rocket className="ml-2 w-5 h-5" />
                                </Button>
                            )}
                            <p className="text-center text-xs text-muted-foreground mt-4">
                                Deployment requires approx. 0.02 ETH. Your collection will be minted on Starknet.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Sticky Sidebar / Preview */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">

                            {/* Live Preview Card */}
                            <div className="rounded-2xl overflow-hidden border border-border/50 bg-card shadow-2xl">
                                {/* Header / Status Bar */}
                                <div className="bg-muted/30 px-4 py-3 border-b border-border/50 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Preview</span>
                                    </div>
                                    <Badge variant="outline" className="text-[10px] font-mono opacity-70">
                                        ERC-721
                                    </Badge>
                                </div>

                                {/* Main Visual */}
                                <div className="aspect-square relative group bg-black/5">
                                    {coverImage ? (
                                        <img src={URL.createObjectURL(coverImage)} className="w-full h-full object-cover" alt="Preview" />
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/30">
                                            <ImageIcon className="h-16 w-16 mb-4" />
                                            <span className="text-sm font-medium uppercase tracking-widest">Cover Image</span>
                                        </div>
                                    )}

                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

                                    {/* Floating Details */}
                                    <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                                        <Badge className={cn("mb-2 backdrop-blur-md border-white/20 text-white gap-1.5 pl-1.5",
                                            licenseType === 'personal' ? 'bg-blue-500/80' :
                                                licenseType === 'commercial' ? 'bg-green-500/80' :
                                                    'bg-amber-500/80'
                                        )}>
                                            <div className="bg-white/20 p-0.5 rounded-full">
                                                {getLicenseIcon()}
                                            </div>
                                            {getLicenseLabel()}
                                        </Badge>
                                        <div>
                                            <h3 className="font-bold text-2xl tracking-tight leading-none truncate">
                                                {name || "Collection Name"}
                                            </h3>
                                            <p className="text-white/80 font-medium text-sm mt-1 truncate">
                                                {symbol ? `$${symbol}` : '---'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Preview Stats */}
                                <div className="p-4 grid grid-cols-2 gap-4 bg-card text-sm">
                                    <div>
                                        <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Price</p>
                                        <p className="font-semibold text-lg">{price ? `${price} USDC` : '0.00 USDC'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Supply</p>
                                        <p className="font-semibold text-lg font-mono">{supply ? parseInt(supply).toLocaleString() : '---'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Guide */}
                            <Card className="glass-card">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg">Quick Guide</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-xs font-medium text-primary">1</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Define Identity</p>
                                            <p className="text-xs text-muted-foreground">Name and describe your collection.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-xs font-medium text-primary">2</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Upload Assets</p>
                                            <p className="text-xs text-muted-foreground">Set cover image and reveal strategy.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-xs font-medium text-primary">3</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Set Licensing</p>
                                            <p className="text-xs text-muted-foreground">Choose legal rights for holders.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-xs font-medium text-primary">4</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Deploy</p>
                                            <p className="text-xs text-muted-foreground">Launch onchain and start minting.</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
