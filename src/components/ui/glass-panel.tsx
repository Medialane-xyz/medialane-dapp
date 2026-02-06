import * as React from "react"
import { cn } from "@/lib/utils"

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "hover" | "neon" | "vivid"
    intensity?: "low" | "medium" | "high"
}

const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
    ({ className, variant = "default", intensity = "medium", children, ...props }, ref) => {

        const intensityMap = {
            low: "backdrop-blur-sm bg-white/5 dark:bg-slate-900/20 border-white/10 dark:border-white/5",
            medium: "backdrop-blur-xl bg-white/10 dark:bg-slate-900/30 border-white/20 dark:border-white/10",
            high: "backdrop-blur-2xl bg-white/15 dark:bg-slate-900/40 border-white/25 dark:border-white/15",
        }

        const variantStyles = {
            default: "shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] dark:shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]",
            hover: "shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] dark:shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] hover:shadow-[0_12px_40px_0_rgba(31,38,135,0.2)] dark:hover:shadow-[0_12px_40px_0_rgba(31,38,135,0.5)] hover:bg-white/15 dark:hover:bg-slate-800/40 transition-all duration-300",
            neon: "shadow-neon-cyan border-primary/50 bg-primary/5 dark:bg-primary/10",
            vivid: "shadow-[0_8px_32px_0_rgba(139,92,246,0.2),0_0_60px_-15px_rgba(6,182,212,0.3)] dark:shadow-[0_8px_32px_0_rgba(139,92,246,0.4),0_0_60px_-15px_rgba(6,182,212,0.4)] border-violet-500/20 dark:border-cyan-500/20",
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
