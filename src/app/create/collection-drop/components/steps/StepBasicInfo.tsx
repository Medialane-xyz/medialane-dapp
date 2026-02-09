'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useDropForm } from '@/hooks/use-drop-form';

export function StepBasicInfo() {
    const { name, symbol, description, setField } = useDropForm();

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="name">Collection Name</Label>
                    <Input
                        id="name"
                        placeholder="e.g. Cosmic Explorers"
                        value={name}
                        onChange={(e) => setField('name', e.target.value)}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="symbol">Symbol</Label>
                    <Input
                        id="symbol"
                        placeholder="e.g. CSMX"
                        value={symbol}
                        onChange={(e) => setField('symbol', e.target.value.toUpperCase())}
                        maxLength={6}
                        className="uppercase"
                    />
                    <p className="text-xs text-muted-foreground">Max 6 characters.</p>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        placeholder="Tell the story behind your collection..."
                        value={description}
                        onChange={(e) => setField('description', e.target.value)}
                        className="min-h-[120px] resize-none"
                    />
                </div>
            </div>
        </div>
    );
}
