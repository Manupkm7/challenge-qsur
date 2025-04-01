import { useState } from "react"
import { MdSearch as Search } from "@react-icons/all-files/md/MdSearch"
import { useLocation } from "react-router-dom"


import Button from "../Button"
import { Select } from "../Select"
import Input from "../Input"

export function AppHeader() {
    const [searchQuery, setSearchQuery] = useState("")
    const location = useLocation()

    // Format the pathname to create a readable title
    const formatPathname = (path: string) => {
        if (path === "/") return "Inicio"

        // Remove leading slash and split by slashes
        const segments = path.slice(1).split("/")

        // Capitalize each segment and join with " / "
        return segments.map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1)).join(" / ")
    }

    const pageTitle = formatPathname(location.pathname)

    return (
        <header className="sticky top-0 z-10 border-b bg-background">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-3.5">
                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold">{pageTitle}</h1>
                </div>

                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="flex gap-2">
                        <Select options={["Todos", "Activos", "Inactivos"]} />
                        <Select options={["Más recientes", "Más antiguos", "Nombre"]} />

                    </div>

                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Buscar..."
                            className="w-full pl-8 md:w-[250px]"
                            value={searchQuery}
                            onChange={(value) => setSearchQuery(value)}
                        />
                    </div>

                    <Button variant="primary" onClick={() => { }}>Nuevo</Button>
                </div>
            </div>
        </header>
    )
}

