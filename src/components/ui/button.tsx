import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/40 font-mono tracking-wide",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-white/20 dark:border-white/10 bg-white/10 dark:bg-slate-900/30 backdrop-blur-sm shadow-sm hover:bg-white/20 dark:hover:bg-slate-800/40 hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-white/10 dark:hover:bg-white/5 hover:text-accent-foreground hover:backdrop-blur-sm",
        link: "text-primary underline-offset-4 hover:underline",
        cyber: "relative overflow-hidden bg-transparent border border-primary/50 text-primary hover:bg-primary/10 hover:border-primary hover:shadow-neon-cyan transition-all duration-300 font-mono uppercase tracking-widest clip-path-slant before:absolute before:inset-0 before:bg-primary/20 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
        glass: "glass-button text-foreground hover:text-foreground",
        vivid: "gradient-vivid-primary rounded-lg",
        "vivid-accent": "gradient-vivid-accent rounded-lg",
        "vivid-creative": "gradient-vivid-creative rounded-lg",
        "vivid-outrun": "gradient-vivid-outrun rounded-lg border-0",
        "neon-cyan": "bg-transparent border-2 border-outrun-cyan text-outrun-cyan hover:bg-outrun-cyan/10 hover:shadow-neon-cyan transition-all duration-300 font-mono uppercase tracking-wider",
        "neon-magenta": "bg-transparent border-2 border-outrun-magenta text-outrun-magenta hover:bg-outrun-magenta/10 hover:shadow-neon-magenta transition-all duration-300 font-mono uppercase tracking-wider",
        "neon-orange": "bg-transparent border-2 border-outrun-orange text-outrun-orange hover:bg-outrun-orange/10 hover:shadow-neon-orange transition-all duration-300 font-mono uppercase tracking-wider",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
