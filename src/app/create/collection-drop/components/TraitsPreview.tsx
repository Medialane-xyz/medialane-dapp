'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { DROP_DATA } from '@/lib/data/drop-data';

export function TraitsPreview() {
    const { previewItems } = DROP_DATA;

    return (
        <div className="py-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/0 to-background/90 z-10 pointer-events-none" />
            <div className="container mx-auto px-4 relative z-20">
                <h2 className="text-2xl font-bold mb-6 text-foreground/90 font-mono">Collection Preview</h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {previewItems.map((trait, index) => (
                        <motion.div
                            key={trait.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Card className="overflow-hidden border-border/50 bg-black/40 backdrop-blur-xl hover:border-primary/50 transition-colors group">
                                <div className="relative aspect-square overflow-hidden">
                                    <Image
                                        src={trait.image}
                                        alt={trait.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                        <div>
                                            <p className="text-white font-bold">{trait.name}</p>
                                            <p className="text-primary text-xs">{trait.rarity}</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
