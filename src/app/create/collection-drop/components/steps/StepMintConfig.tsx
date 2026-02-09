'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useDropForm } from '@/hooks/use-drop-form';

export function StepMintConfig() {
    const { price, supply, maxPerWallet, startDate, endDate, setField } = useDropForm();

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Supply */}
                <div className="grid gap-2">
                    <Label htmlFor="supply">Total Supply</Label>
                    <Input
                        id="supply"
                        type="number"
                        placeholder="1000"
                        value={supply}
                        onChange={(e) => setField('supply', e.target.value)}
                    />
                </div>

                {/* Price */}
                <div className="grid gap-2">
                    <Label htmlFor="price">Mint Price (ETH)</Label>
                    <div className="relative">
                        <Input
                            id="price"
                            type="number"
                            step="0.001"
                            placeholder="0.05"
                            value={price}
                            onChange={(e) => setField('price', e.target.value)}
                            className="pl-8"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Ξ</span>
                    </div>
                </div>

                {/* Max Per Wallet */}
                <div className="grid gap-2">
                    <Label htmlFor="maxPerWallet">Max Per Wallet</Label>
                    <Input
                        id="maxPerWallet"
                        type="number"
                        placeholder="5"
                        value={maxPerWallet}
                        onChange={(e) => setField('maxPerWallet', e.target.value)}
                    />
                </div>

                {/* Date Pickers */}
                <div className="grid gap-2">
                    <Label>Start Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !startDate && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={startDate}
                                onSelect={(d) => setField('startDate', d)}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="grid gap-2">
                    <Label>End Date (Optional)</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !endDate && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={endDate}
                                onSelect={(d) => setField('endDate', d)}
                                initialFocus
                                disabled={(date) => !!startDate && date < startDate}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

            </div>
        </div>
    );
}
