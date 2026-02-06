
"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function FilterSidebar() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Filters</h3>
                <Button variant="link" size="sm" className="h-auto p-0 text-muted-foreground hover:text-primary">
                    Reset
                </Button>
            </div>

            <Accordion type="multiple" defaultValue={["category", "price", "status"]} className="w-full">
                {/* Status */}
                <AccordionItem value="status" className="border-b border-white/10">
                    <AccordionTrigger className="hover:no-underline">Status</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-3 pt-1">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="status-buy-now" />
                                <Label htmlFor="status-buy-now" className="flex-1 cursor-pointer">Buy Now</Label>
                                <span className="text-xs text-muted-foreground">142</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="status-auction" />
                                <Label htmlFor="status-auction" className="flex-1 cursor-pointer">On Auction</Label>
                                <span className="text-xs text-muted-foreground">24</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="status-new" />
                                <Label htmlFor="status-new" className="flex-1 cursor-pointer">New</Label>
                                <span className="text-xs text-muted-foreground">56</span>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Categories */}
                <AccordionItem value="category" className="border-b border-white/10">
                    <AccordionTrigger className="hover:no-underline">Category</AccordionTrigger>
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
                    <AccordionTrigger className="hover:no-underline">Price (STRK)</AccordionTrigger>
                    <AccordionContent>
                        <div className="pt-4 px-1 space-y-4">
                            <Slider defaultValue={[0, 100]} max={100} step={1} />
                            <div className="flex items-center gap-4">
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">Min</span>
                                    <input className="w-full bg-black/20 border border-white/10 rounded-md py-1.5 pl-8 pr-2 text-sm text-center" placeholder="0" />
                                </div>
                                <span className="text-muted-foreground">-</span>
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">Max</span>
                                    <input className="w-full bg-black/20 border border-white/10 rounded-md py-1.5 pl-8 pr-2 text-sm text-center" placeholder="100+" />
                                </div>
                            </div>
                            <Button variant="secondary" size="sm" className="w-full">Apply</Button>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Collections */}
                <AccordionItem value="collections" className="border-b border-white/10">
                    <AccordionTrigger className="hover:no-underline">Collections</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-3 pt-1">
                            {["Cyber Punks", "Stark Apes", "Loot Realms", "Briq", "Everai"].map((col) => (
                                <div key={col} className="flex items-center space-x-2">
                                    <Checkbox id={`col-${col}`} />
                                    <Label htmlFor={`col-${col}`} className="flex-1 cursor-pointer">{col}</Label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}
