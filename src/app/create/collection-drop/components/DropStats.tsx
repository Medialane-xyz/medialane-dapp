'use client';

import { DROP_DATA } from '@/lib/data/drop-data';
import { cn } from '@/lib/utils';
import { TrendingUp, Users, Activity, Layers } from 'lucide-react';

export function DropStats() {
    const { totalMinted } = DROP_DATA.live;
    const stats = [
        {
            label: "Total Vol",
            value: DROP_DATA.creator.stats.volume,
            icon: Activity,
            color: "text-outrun-cyan"
        },
        {
            label: "Owners",
            value: "1.2k",
            icon: Users,
            color: "text-outrun-magenta"
        },
        {
            label: "Floor Price",
            value: "0.12 ETH",
            icon: TrendingUp,
            color: "text-outrun-orange"
        },
        {
            label: "Collection Size",
            value: DROP_DATA.mint.maxSupply.toString(),
            icon: Layers,
            color: "text-outrun-purple"
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {stats.map((stat, idx) => (
                <div key={idx} className="glass-card p-4 flex flex-col items-center justify-center text-center gap-2 group hover:bg-white/5 transition-all duration-300">
                    <stat.icon className={cn("w-5 h-5 mb-1 opacity-70 group-hover:opacity-100 transition-opacity", stat.color)} />
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-mono">{stat.label}</span>
                    <span className={cn("text-xl md:text-2xl font-bold font-mono", stat.color, "drop-shadow-lg")}>
                        {stat.value}
                    </span>
                </div>
            ))}
        </div>
    );
}
