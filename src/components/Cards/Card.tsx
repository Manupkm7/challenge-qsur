import * as React from "react"
import { clsx } from "clsx"

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
        <div data-testid="card" className={clsx("rounded-lg border bg-white text-card-foreground shadow-sm", className)}>
            <div data-testid="card-header" className="p-6">
                <div data-testid="card-title-and-icon"  className="flex items-center gap-2">
                    {icon}
                    <h2 className="text-2xl font-semibold leading-none tracking-tight select-none" data-testid="card-title">
                        {title}
                    </h2>
                </div>
                <p data-testid="card-description" className="text-sm text-muted-foreground mt-2 select-none">
                    {description}
                </p>
                <div data-testid="card-content" className="p-6">{children}</div>
                <footer data-testid="card-footer" className="p-6">{footer}</footer>
            </div>
        </div>
    )
}
