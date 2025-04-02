import * as React from "react"
import clsx from "clsx"

type CardProps = {
    className?: string;
    footer?: React.ReactNode;
    title?: string;
    description?: string;
    children?: React.ReactNode;
    icon?: React.ReactNode;
}

export const Card = ({ className, footer, title, description, children, icon }: CardProps) => {
    return (
        <div className={clsx("rounded-lg border bg-white text-card-foreground shadow-sm", className)}>
            <div className="p-6">
                <div className="flex items-center gap-2">
                    {icon}
                    <h2 className="text-2xl font-semibold leading-none tracking-tight select-none">
                        {title}
                    </h2>
                </div>
                <p className="text-sm text-muted-foreground mt-2 select-none">
                    {description}
                </p>
                <div className="p-6">{children}</div>
                <footer className="p-6">{footer}</footer>
            </div>
        </div>
    )
}
