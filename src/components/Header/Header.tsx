import { useState } from "react"
import { useLocation } from "react-router-dom"


import Button from "../Button"
import { Select } from "../Select"
import Input from "../Input"
import { darkModeAtom } from "@/atoms/index"
import { useRecoilValue } from "recoil"

export type FilterState = {
    status: LabelValue
    sort: LabelValue
    search: string
}

type AppHeaderProps = {
    filters: FilterState
    onFiltersChange: (filters: FilterState) => void
}

type LabelValue = {
    label: string
    value: string
}

const statusMap = {
    "Todos": "all",
    "Activo": "active",
    "Inactivo": "inactive"
}

const STATUS_OPTIONS = [
    { label: "Todos", value: "all" },
    { label: "Activo", value: "active" },
    { label: "Inactivo", value: "inactive" }
]

const SORT_OPTIONS = [
    { label: "Más recientes", value: "recents" },
    { label: "Más antiguos", value: "oldest" },
    { label: "Nombre", value: "name" }
]


export function AppHeader({ filters, onFiltersChange }: AppHeaderProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const location = useLocation()
    const dark = useRecoilValue(darkModeAtom)

    // Format the pathname to create a readable title
    const formatPathname = (path: string) => {
        if (path === "/") return "Inicio"

        // Remove leading slash and split by slashes
        const segments = path.slice(1).split("/")

        // Capitalize each segment and join with " / "
        return segments.map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1)).join(" / ")
    }

    const pageTitle = formatPathname(location.pathname)

    const handleStatusChange = (value: LabelValue) => {
        console.log(value)

        onFiltersChange({ ...filters, status: value })
    }

    const handleSortChange = (value: LabelValue) => {
        onFiltersChange({ ...filters, sort: value })
    }

    const handleSearchChange = (value: string) => {
        setSearchQuery(value)
        onFiltersChange({ ...filters, search: value })
    }


    return (
        <header className="sticky top-0 z-10 border-b bg-background">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-3.5">
                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold">{pageTitle}</h1>
                </div>

                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="flex gap-2">
                        <Select<LabelValue> dark={dark} value={filters.status}
                            onChange={handleStatusChange}
                            options={STATUS_OPTIONS}
                            extractLabel={(option) => option.label}
                            extractValue={(option) => option.value}
                        />

                        <Select<LabelValue> dark={dark}
                            value={filters.sort}
                            onChange={(value: LabelValue) => handleSortChange(value)}
                            options={SORT_OPTIONS} extractLabel={(option) => option.label}
                            extractValue={(option) => option.value}
                        />
                    </div>

                    <div>
                        <Input
                            type="search"
                            placeholder="Buscar..."
                            className="w-full"
                            value={searchQuery}
                            onChange={(value) => handleSearchChange(value)}
                        />
                    </div>

                    <Button variant="primary" onClick={() => { }}>Nuevo</Button>
                </div>
            </div>
        </header>
    )
}

