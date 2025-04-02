import * as React from "react"
import { MdChevronRight as ChevronRight } from "@react-icons/all-files/md/MdChevronRight";
import { MdChevronLeft as ChevronLeft } from "@react-icons/all-files/md/MdChevronLeft";
import { MdMoreHoriz as MoreHorizontal } from "@react-icons/all-files/md/MdMoreHoriz";

import clsx from "clsx"

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
    <nav
        role="navigation"
        aria-label="pagination"
        className={clsx("mx-auto flex w-full justify-center", className)}
        {...props}
    />
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(
    ({ className, ...props }, ref) => (
        <ul ref={ref} className={clsx("flex flex-row items-center gap-1", className)} {...props} />
    ),
)
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(({ className, ...props }, ref) => (
    <li ref={ref} className={clsx("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = {
    isActive?: boolean
} &
    React.ComponentProps<"a">

const PaginationLink = ({ className, isActive, ...props }: PaginationLinkProps) => (
    <a
        aria-current={isActive ? "page" : undefined}
        className={clsx(isActive ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-secondary text-secondary-foreground hover:bg-secondary/90",
            className,
        )}
        {...props}
    />
)
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
    <PaginationLink aria-label="Go to previous page" className={clsx("gap-1 pl-2.5", className)} {...props}>
        <ChevronLeft className="h-4 w-4" />
        <span>Anterior</span>
    </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
    <PaginationLink aria-label="Go to next page" className={clsx("gap-1 pr-2.5", className)} {...props}>
        <span>Siguiente</span>
        <ChevronRight className="h-4 w-4" />
    </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
    <span aria-hidden className={clsx("flex h-9 w-9 items-center justify-center", className)} {...props}>
        <MoreHorizontal className="h-4 w-4" />
        <span className="sr-only">More pages</span>
    </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
}

