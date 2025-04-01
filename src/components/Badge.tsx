import type * as React from "react"
import clsx from "clsx"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant: "default" | "secondary" | "destructive" | "outline"
}

export const Badge = ({ className, variant = "default", ...props }: BadgeProps) => {
    return <div className={clsx(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors select-none",
        variant === "default" && "border-transparent bg-green-500 text-white",
        variant === "secondary" && "border-transparent bg-yellow-500 text-black",
        variant === "destructive" && "border-transparent bg-red-500 text-white",
        variant === "outline" && "border-input bg-background hover:bg-accent hover:text-accent-foreground",
        className
    )} {...props} />
}
