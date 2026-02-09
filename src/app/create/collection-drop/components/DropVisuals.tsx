'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DROP_DATA } from '@/lib/data/drop-data';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DropVisuals() {
    const [activeIndex, setActiveIndex] = useState(0);
    const images = [DROP_DATA.collection.coverImage, ...DROP_DATA.previewItems.map(item => item.image)];

    const handleNext = () => setActiveIndex((prev) => (prev + 1) % images.length);
    const handlePrev = () => setActiveIndex((prev) => (prev - 1 + images.length) % images.length);

    return (
        <div className="flex flex-col gap-4 h-full">
            {/* Main Visual Frame */}
            <div className="relative aspect-square md:aspect-video lg:aspect-auto lg:h-[600px] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
                {/* Background Blur Effect */}
                <div
                    className="absolute inset-0 bg-cover bg-center blur-3xl opacity-40 scale-110"
                    style={{ backgroundImage: `url(${images[activeIndex]})` }}
                />

                {/* Active Image */}
                <div className="relative h-full w-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <AnimatePresence mode='wait'>
                        <motion.img
                            key={activeIndex}
                            src={images[activeIndex]}
                            alt="Collection Preview"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="max-h-full max-w-full object-contain shadow-2xl rounded-lg"
                        />
                    </AnimatePresence>
                </div>

                {/* Overlays */}
                <div className="absolute top-4 right-4">
                    <div className="glass-vivid px-3 py-1 rounded-full text-xs font-mono text-outrun-cyan border-outrun-cyan/30 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-outrun-cyan animate-pulse" />
                        Live Preview
                    </div>
                </div>

                {/* Controls */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button variant="ghost" size="icon" onClick={handlePrev} className="bg-black/50 hover:bg-black/70 text-white rounded-full h-12 w-12 backdrop-blur-md border border-white/10">
                        <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleNext} className="bg-black/50 hover:bg-black/70 text-white rounded-full h-12 w-12 backdrop-blur-md border border-white/10">
                        <ChevronRight className="w-6 h-6" />
                    </Button>
                </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        className={cn(
                            "relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden flex-shrink-0 transition-all duration-300 border-2",
                            activeIndex === idx
                                ? "border-outrun-cyan shadow-[0_0_15px_rgba(0,255,255,0.4)] scale-105"
                                : "border-transparent opacity-60 hover:opacity-100 hover:border-white/20"
                        )}
                    >
                        <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>
        </div>
    );
}
