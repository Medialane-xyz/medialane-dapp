'use client';

import { useState } from 'react';
import { useDropForm } from '@/hooks/use-drop-form';
import { Button } from '@/components/ui/button';
import { StepBasicInfo } from './components/steps/StepBasicInfo';
import { StepMintConfig } from './components/steps/StepMintConfig';
import { StepUploads } from './components/steps/StepUploads';
import { Rocket, FileText, Settings2, Image as ImageIcon, Loader } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { toast } from 'sonner';

export default function CreateDropPage() {
    const { canSubmit, name, price, supply, coverImage } = useDropForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsSubmitting(false);
        toast.success("Collection Drop Created!", { description: "Your drop is now live on the testnet." });
    };

    return (
        <div className="min-h-screen py-20">
            <main className="container mx-auto px-4 max-w-7xl">
                <h1 className="text-3xl mb-8">Create Collection Drop</h1>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                    {/* Main Content: Accordion Form */}
                    <div className="lg:col-span-3 space-y-8">

                        <Accordion type="multiple" defaultValue={["basic-info"]} className="w-full space-y-4">

                            {/* 1. Basic Info */}
                            <AccordionItem value="basic-info" className="glass">
                                <AccordionTrigger className="hover:no-underline px-4 py-4 text-xl font-semibold">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-primary" />
                                        <span>Basic Info</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-4 pb-6 pt-2">
                                    <StepBasicInfo />
                                </AccordionContent>
                            </AccordionItem>

                            {/* 2. Mint Configuration */}
                            <AccordionItem value="mint-config" className="glass">
                                <AccordionTrigger className="hover:no-underline px-4 py-4 text-xl font-semibold">
                                    <div className="flex items-center gap-2">
                                        <Settings2 className="h-5 w-5 text-primary" />
                                        <span>Mint Configuration</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-4 pb-6 pt-2">
                                    <StepMintConfig />
                                </AccordionContent>
                            </AccordionItem>

                            {/* 3. Visuals */}
                            <AccordionItem value="visuals" className="glass">
                                <AccordionTrigger className="hover:no-underline px-4 py-4 text-xl font-semibold">
                                    <div className="flex items-center gap-2">
                                        <ImageIcon className="h-5 w-5 text-primary" />
                                        <span>Visual Assets</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-4 pb-6 pt-2">
                                    <StepUploads />
                                </AccordionContent>
                            </AccordionItem>

                        </Accordion>


                        {/* Submit Action */}
                        <div className="flex justify-end pt-2">
                            <Button
                                onClick={handleSubmit}
                                disabled={!canSubmit() || isSubmitting}
                                size="lg"
                                className="px-10 h-12 text-lg shadow-lg hover:shadow-xl transition-all rounded-full"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader className="animate-spin h-5 w-5 mr-2" /> Processing...
                                    </>
                                ) : (
                                    <>
                                        Deploy Drop <Rocket className="ml-2 h-5 w-5" />
                                    </>
                                )}
                            </Button>
                        </div>

                    </div>

                    {/* Right Column: Live Preview Card */}
                    <div className="hidden lg:block lg:col-span-1">
                        <div className="sticky top-24 space-y-4">
                            <h3 className="text-lg font-medium">Live Preview</h3>

                            {/* Preview Card Mockup */}
                            <div className="rounded-xl overflow-hidden border border-border shadow-md bg-card">
                                {/* Cover Aspect */}
                                <div className="aspect-[4/3] bg-muted relative">
                                    {coverImage ? (
                                        <img src={URL.createObjectURL(coverImage)} className="w-full h-full object-cover" alt="Preview" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary/20">
                                            Cover Image
                                        </div>
                                    )}

                                    <div className="absolute top-2 right-2">
                                        <div className="bg-black/70 backdrop-blur px-2 py-1 rounded text-xs font-bold text-white">
                                            {supply ? `${supply} Items` : 'Supply'}
                                        </div>
                                    </div>
                                </div>

                                {/* Content Aspect */}
                                <div className="p-4 space-y-3">
                                    <div>
                                        <h3 className="font-bold text-lg mb-1 line-clamp-1">
                                            {name || "Collection Name"}
                                        </h3>
                                        <p className="text-sm text-muted-foreground font-mono">
                                            Price: {price || "0.00"} ETH
                                        </p>
                                    </div>

                                    <Button size="sm" variant="outline" className="w-full" disabled>
                                        Mint Now
                                    </Button>
                                </div>
                            </div>

                            <Card className="glass-card">
                                <CardContent className="p-4">
                                    <h4 className="font-medium mb-2 flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        Drop Guide
                                    </h4>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        Ready to launch? Ensure your mint configuration is correct, as it cannot be changed after deployment.
                                    </p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full bg-transparent"
                                    >
                                        View Guide
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
