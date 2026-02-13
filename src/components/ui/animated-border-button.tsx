"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"
import { ButtonProps, buttonVariants } from "@/components/ui/button"

interface AnimatedBorderButtonProps extends ButtonProps {
    gradientColors?: string;
}

const AnimatedBorderButton = React.forwardRef<HTMLButtonElement, AnimatedBorderButtonProps>(
    ({ className, gradientColors = "from-blue-500 via-rose-400 to-blue-500", variant, size, asChild = false, children, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"

        // We use a wrapper for the border effect, but since we are replacing a Button component, 
        // we need to be careful about layout.
        // Actually, the best way to do this while keeping Button props is to render the Button 
        // with a special class that handles the internal layering, OR render a container that looks like a button.

        // Let's go with a container approach that wraps the actual button interaction
        return (
            <div className={cn(
                "group relative inline-flex p-[1px] overflow-hidden rounded-lg transition-transform hover:scale-[1.02] active:scale-[0.98] duration-300",
                className
            )}>
                {/* Spinning Gradient Background */}
                <div className={cn(
                    "absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#0000_0%,#3b82f6_50%,#fb7185_100%)] opacity-100",
                    // We can override the gradient here if needed, but tailwind arbitrary values in classNames are tricky with dynamic strings
                )} />

                {/* Button Content */}
                <Comp
                    className={cn(
                        "relative inline-flex h-11 w-full items-center justify-center rounded-lg bg-background px-8 py-2 font-medium text-foreground transition-all group-hover:bg-background/90 group-hover:text-foreground",
                        // If it was a 'ghost' or 'link' variant, this might need adjustment, but for primary actions this is good.
                        // We strip the default button styling to let the container handle the shape
                    )}
                    ref={ref}
                    {...props}
                >
                    {children}
                </Comp>
            </div>
        )
    }
)
AnimatedBorderButton.displayName = "AnimatedBorderButton"

export { AnimatedBorderButton }
