"use client"

import { cn } from "@/lib/utils"

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string
    description?: React.ReactNode
    children?: React.ReactNode
}

export function PageHeader({
    title,
    description,
    children,
    className,
    ...props
}: PageHeaderProps) {
    return (
        <div className={cn("flex flex-col gap-4 md:gap-8 pt-20 pb-10", className)} {...props}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col space-y-2">
                    <h1 className="text-3xl tracking-tight bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                        {title}
                    </h1>
                    {description && (
                        <div className="text-sm text-muted-foreground w-full max-w-[700px]">
                            {description}
                        </div>
                    )}
                </div>
                {children && (
                    <div className="flex items-center gap-2 mt-4 md:mt-0">
                        {children}
                    </div>
                )}
            </div>
            {/* Optional divider if needed later, currently keeping it clean */}
        </div>
    )
}
