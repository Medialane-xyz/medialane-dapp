import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    RotateCcw,
    Grid3X3,
    TrendingUp,
    Clock,
    Search,
    Tag,
    DollarSign,
    Filter,
    Music,
    Image as ImageIcon,
    FileText,
    Video,
    Shield,
    Terminal,
    Box
} from "lucide-react"

export function FilterSidebar() {
    return (
        <div className="space-y-6 glass-panel p-6 rounded-2xl">
            {/* Header with subtle accent */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg text-foreground">Filters</h3>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 gap-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 text-xs font-medium"
                >
                    <RotateCcw className="h-3 w-3" />
                    Reset
                </Button>
            </div>

            <Accordion type="multiple" defaultValue={["view", "category", "price"]} className="w-full">
                {/* View Options */}
                <AccordionItem value="view" className="border-b border-border/10">
                    <AccordionTrigger className="text-sm font-medium py-4">
                        View
                    </AccordionTrigger>
                    <AccordionContent>
                        <RadioGroup defaultValue="all" className="space-y-3 pb-2 pt-1">
                            {[
                                { id: "view-all", label: "All Assets", value: "all" },
                                { id: "view-trending", label: "Trending", value: "trending" },
                                { id: "view-recent", label: "Recent", value: "recent" },
                            ].map((item) => (
                                <div key={item.id} className="flex items-center space-x-2 group cursor-pointer">
                                    <RadioGroupItem value={item.value} id={item.id} />
                                    <Label htmlFor={item.id} className="cursor-pointer text-sm font-normal text-muted-foreground group-hover:text-foreground transition-colors">
                                        {item.label}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </AccordionContent>
                </AccordionItem>

                {/* Categories */}
                <AccordionItem value="category" className="border-b border-border/10">
                    <AccordionTrigger className="text-sm font-medium py-4">
                        Category
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-wrap gap-2 pb-2 pt-1">
                            {[
                                "Music", "Art", "Docs", "NFT", "Video", "Patents", "Code"
                            ].map((name) => (
                                <Badge
                                    key={name}
                                    variant="outline"
                                    className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors py-1 px-2.5 font-normal text-xs"
                                >
                                    {name}
                                </Badge>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Price Range */}
                <AccordionItem value="price" className="border-none">
                    <AccordionTrigger className="text-sm font-medium py-4">
                        Price Range
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-4 pb-2 pt-1">
                            <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">Min</span>
                                    <input className="w-full bg-accent/20 border border-border rounded-md h-9 pl-10 pr-3 text-sm focus:ring-1 focus:ring-primary/20 outline-none" placeholder="0" />
                                </div>
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">Max</span>
                                    <input className="w-full bg-accent/20 border border-border rounded-md h-9 pl-10 pr-3 text-sm focus:ring-1 focus:ring-primary/20 outline-none" placeholder="Max" />
                                </div>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {/* Simple Help Note */}
            <div className="rounded-lg border border-outrun-cyan/20 bg-outrun-cyan/5 p-4 mt-8 shadow-glow-sm shadow-neon-cyan/10">
                <p className="text-[11px] text-neon-cyan/80 leading-relaxed font-medium">
                    Verified assets feature immutable on-chain records for total provenance.
                </p>
            </div>
        </div>
    );
}
