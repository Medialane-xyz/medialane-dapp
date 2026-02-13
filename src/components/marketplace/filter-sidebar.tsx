
"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { RotateCcw, Grid3X3, TrendingUp, Clock, Layers, ExternalLink } from "lucide-react"
import Link from "next/link"

export function FilterSidebar() {
    return (
        <div className="space-y-6">
            {/* Header with subtle gradient accent */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h3 className="font-semibold text-lg text-gradient-vivid">Filters</h3>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-1.5 gap-1.5 text-muted-foreground hover:text-outrun-cyan hover:shadow-[0_0_10px_rgba(0,255,255,0.2)] transition-all duration-200 text-xs"
                >
                    <RotateCcw className="h-3 w-3" />
                    Reset
                </Button>
            </div>

            <Accordion type="multiple" defaultValue={["view", "category", "status"]} className="w-full space-y-1">
                {/* View Options */}
                <AccordionItem value="view" className="border-b border-white/10">
                    <AccordionTrigger className="hover:no-underline py-3">View</AccordionTrigger>
                    <AccordionContent>
                        <RadioGroup defaultValue="all" className="space-y-2 pt-1">
                            <div className="flex items-center space-x-3">
                                <RadioGroupItem value="all" id="view-all" />
                                <Label htmlFor="view-all" className="flex items-center gap-2 cursor-pointer">
                                    <Grid3X3 className="h-4 w-4 text-muted-foreground" />
                                    All Assets
                                </Label>
                            </div>
                            <div className="flex items-center space-x-3">
                                <RadioGroupItem value="trending" id="view-trending" />
                                <Label htmlFor="view-trending" className="flex items-center gap-2 cursor-pointer">
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                    Trending
                                </Label>
                            </div>
                            <div className="flex items-center space-x-3">
                                <RadioGroupItem value="recent" id="view-recent" />
                                <Label htmlFor="view-recent" className="flex items-center gap-2 cursor-pointer">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    Recent
                                </Label>
                            </div>
                            <div className="flex items-center space-x-3">
                                <RadioGroupItem value="collections" id="view-collections" />
                                <Link href="/collections" className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors group">
                                    <span className="text-sm font-medium">Collections</span>
                                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                                </Link>
                            </div>
                        </RadioGroup>
                    </AccordionContent>
                </AccordionItem>

                {/* Status */}
                <AccordionItem value="status" className="border-b border-white/10">
                    <AccordionTrigger className="hover:no-underline py-3">Status</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2 pt-1">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="status-buy-now" />
                                <Label htmlFor="status-buy-now" className="cursor-pointer">Buy Now</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="status-auction" />
                                <Label htmlFor="status-auction" className="cursor-pointer">On Auction</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="status-new" />
                                <Label htmlFor="status-new" className="cursor-pointer">New</Label>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Categories */}
                <AccordionItem value="category" className="border-b border-white/10">
                    <AccordionTrigger className="hover:no-underline py-3">Category</AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-wrap gap-2 pt-1">
                            {["Art", "Music", "Video", "Photography", "Domain", "Gaming", "Meme"].map((cat) => (
                                <Badge
                                    key={cat}
                                    variant="outline"
                                    className="cursor-pointer hover:bg-outrun-cyan/20 hover:text-outrun-cyan hover:border-outrun-cyan/50 hover:shadow-[0_0_8px_rgba(0,255,255,0.2)] transition-all duration-200 py-1.5 px-3"
                                >
                                    {cat}
                                </Badge>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Price Range */}
                <AccordionItem value="price" className="border-b border-white/10">
                    <AccordionTrigger className="hover:no-underline py-3">Price (STRK)</AccordionTrigger>
                    <AccordionContent>
                        <div className="pt-4 px-1 space-y-4">
                            <Slider defaultValue={[0, 100]} max={100} step={1} className="[&_[role=slider]]:bg-outrun-cyan [&_[role=slider]]:border-outrun-cyan [&_.range]:bg-gradient-to-r [&_.range]:from-outrun-magenta [&_.range]:to-outrun-cyan" />
                            <div className="flex items-center gap-3">
                                <input className="flex-1 bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm text-center focus:border-outrun-cyan/50 focus:shadow-[0_0_8px_rgba(0,255,255,0.15)] transition-all duration-200" placeholder="Min" />
                                <span className="text-muted-foreground">—</span>
                                <input className="flex-1 bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm text-center focus:border-outrun-cyan/50 focus:shadow-[0_0_8px_rgba(0,255,255,0.15)] transition-all duration-200" placeholder="Max" />
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}

