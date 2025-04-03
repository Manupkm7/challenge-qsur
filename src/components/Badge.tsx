import type * as React from "react"
import { clsx } from "clsx"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant: "default" | "secondary" | "destructive" | "outline"
    testId?: string
}

export const Badge = ({ className, variant = "default", testId, ...props }: BadgeProps) => {
    return <div data-testid={testId} className={clsx(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors select-none",
        variant === "default" && "border-transparent bg-green-500 text-white",
        variant === "secondary" && "border-transparent bg-yelow-500 text-black",
        variant === "destructive" && "border-transparent bg-destructive text-destructive-foreground",
        variant === "outline" && "text-foreground",
        className
    )} {...props} />
}
