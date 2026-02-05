import * as React from "react"
import { cn } from "@/lib/utils"

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "hover" | "neon"
    intensity?: "low" | "medium" | "high"
}

const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
    ({ className, variant = "default", intensity = "medium", children, ...props }, ref) => {

        const intensityMap = {
            low: "backdrop-blur-sm bg-white/5 border-white/5",
            medium: "backdrop-blur-md bg-white/10 border-white/10",
            high: "backdrop-blur-xl bg-white/15 border-white/20",
        }

        const variantStyles = {
            default: "shadow-glass",
            hover: "shadow-glass hover:shadow-glass-hover hover:bg-white/15 transition-all duration-300",
            neon: "shadow-neon-cyan border-primary/50 bg-primary/5",
        }

        return (
            <div
                ref={ref}
                className={cn(
                    "relative overflow-hidden rounded-2xl border",
                    intensityMap[intensity],
                    variantStyles[variant],
                    className
                )}
                {...props}
            >
                {/* Holographic noise texture overlay */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />

                {/* Gradient sheen */}
                <div className="absolute -inset-[100%] top-0 block h-[200%] w-[50%] -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-[0.05] group-hover:animate-shine pointer-events-none" />

                <div className="relative z-10">
                    {children}
                </div>
            </div>
        )
    }
)
GlassPanel.displayName = "GlassPanel"

export { GlassPanel }
