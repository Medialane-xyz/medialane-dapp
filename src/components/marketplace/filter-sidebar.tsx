
"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { RotateCcw, Grid3X3, TrendingUp, Clock, Layers } from "lucide-react"

export function FilterSidebar() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Filters</h3>
                <Button variant="ghost" size="sm" className="h-auto p-1.5 gap-1.5 text-muted-foreground hover:text-primary text-xs">
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
                                <Label htmlFor="view-collections" className="flex items-center gap-2 cursor-pointer">
                                    <Layers className="h-4 w-4 text-muted-foreground" />
                                    Collections
                                </Label>
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
                                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors py-1.5 px-3"
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
                            <Slider defaultValue={[0, 100]} max={100} step={1} />
                            <div className="flex items-center gap-3">
                                <input className="flex-1 bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm text-center" placeholder="Min" />
                                <span className="text-muted-foreground">—</span>
                                <input className="flex-1 bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm text-center" placeholder="Max" />
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}

