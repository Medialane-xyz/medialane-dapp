"use client"

import { Shield, RefreshCw, Coins, Zap, Layers, Globe } from "lucide-react"
import { motion } from "framer-motion"

const features = [
    {
        title: "Perpetual Royalties",
        description: "Set your terms once. Earn automatically every time your asset is traded or licensed.",
        icon: Coins,
        color: "text-amber-400",
        gradient: "from-amber-500/20 to-orange-500/20",
    },
    {
        title: "Remixable IP",
        description: "Allow others to build on your work while maintaining attribution and revenue flow.",
        icon: RefreshCw,
        color: "text-purple-400",
        gradient: "from-purple-500/20 to-pink-500/20",
    },
    {
        title: "Onchain Protection",
        description: "Cryptographic proof of authorship and ownership timestamped on Starknet.",
        icon: Shield,
        color: "text-blue-400",
        gradient: "from-blue-500/20 to-cyan-500/20",
    },
]

export function FeatureGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {features.map((feature, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden hover:bg-white/10 transition-colors"
                >
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                    <div className="relative z-10">
                        <div className={`w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6 ${feature.color}`}>
                            <feature.icon className="w-6 h-6" />
                        </div>

                        <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            {feature.description}
                        </p>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
