import { useState } from "react"
import Input from "@/components/Input"
import Table from "@/components/Table"
import { useHistory, type HistoryAction } from "@/hooks/useHistoryStore"
import moment from "moment"
import { FaFilter as Filter } from "@react-icons/all-files/fa/FaFilter";
import { SearchIcon as Search } from '../assets/SearchIcon';
import { MdChevronRight as ChevronDown } from "@react-icons/all-files/md/MdChevronRight";
import { FaPlusCircle as PlusCircle } from "@react-icons/all-files/fa/FaPlusCircle";
import { FaPencilAlt as Pencil } from "@react-icons/all-files/fa/FaPencilAlt";
import { FaTrash as Trash2 } from "@react-icons/all-files/fa/FaTrash";

import { Badge } from "@/components/Badge"
import Dropdown from "@/components/Dropdown"
import Button from "@/components/Button"

export const History = () => {
    const { events } = useHistory()
    const [searchQuery, setSearchQuery] = useState("")
    const [actionFilter, setActionFilter] = useState<HistoryAction | "all">("all")
    const [openFilterDropdown, setOpenFilterDropdown] = useState(false)

    // Filter events based on search and action filter
    const filteredEvents = events.filter((event) => {
        // Filter by action type
        if (actionFilter !== "all" && event.action !== actionFilter) {
            return false
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            return (
                event.cardTitle.toLowerCase().includes(query) ||
                event.details.toLowerCase().includes(query) ||
                event.cardId.toString().includes(query)
            )
        }

        return true
    })

    // Get action badge variant
    const getActionBadge = (action: HistoryAction) => {
        switch (action) {
            case "create":
                return { variant: "default" as const, label: "Creación", icon: PlusCircle }
            case "update":
                return { variant: "secondary" as const, label: "Actualización", icon: Pencil }
            case "delete":
                return { variant: "destructive" as const, label: "Eliminación", icon: Trash2 }
        }
    }

    // Format date with time
    const formatDateTime = (date: Date) => {
        return moment(new Date(date)).format("DD/MM/YYYY HH:mm:ss")
    }

    return (
        <div className="px-[24px] py-[12px] overflow-y-auto" data-testid="history">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold select-none">Historial de Cambios</h1>
                    <p className="text-muted-foreground select-none">Registro de todas las acciones realizadas en las tarjetas</p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="relative">
                        <Input
                            type="search"
                            placeholder="Buscar en el historial..."
                            className="w-full"
                            value={searchQuery}
                            onChange={(e: string) => setSearchQuery(e)}
                        />
                        <Search className="absolute right-2.5 top-3 h-4 w-4 text-muted-foreground z-10" />

                    </div>
                    <Dropdown items={[
                        {
                            content: (<>
                                <span className={actionFilter === "all" ? "bg-accent" : ""}>Todas las acciones
                                </span>
                            </>), onClick: () => setActionFilter("all")
                        },
                        {
                            content: (<>
                                <span className={actionFilter === "create" ? "bg-accent" : ""}>Creaciones
                                </span>
                            </>), onClick: () => setActionFilter("create")
                        },
                        {
                            content: (<>
                                <span className={actionFilter === "update" ? "bg-accent" : ""}>Actualizaciones
                                </span>
                            </>), onClick: () => setActionFilter("update")

                        },
                        {
                            content: (<>
                                <span className={actionFilter === "delete" ? "bg-accent" : ""}>Eliminaciones
                                </span>
                            </>), onClick: () => setActionFilter("delete")
                        }
                    ]}
                        open={openFilterDropdown}
                        onOpenChange={() => setOpenFilterDropdown(!openFilterDropdown)}
                        button={
                            <Button variant="secondary" type="button" className="flex items-center gap-2" onClick={() => setOpenFilterDropdown(!openFilterDropdown)}>
                                <Filter className="h-4 w-4" />
                                <span>Filtrar</span>
                                <ChevronDown className="h-4 w-4 ml-2 rotate-90 transition-transform duration-300" />
                            </Button>
                        } />

                </div>
            </div>

            {filteredEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg">
                    <h2 className="text-xl font-semibold">No hay eventos en el historial</h2>
                    <p className="text-muted-foreground mt-2">
                        {events.length === 0
                            ? "El historial está vacío. Las acciones realizadas en las tarjetas se registrarán aquí."
                            : "No se encontraron resultados con los filtros actuales."}
                    </p>
                </div>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.Head className="w-[180px]">Fecha y Hora</Table.Head>
                                <Table.Head className="w-[120px]">Acción</Table.Head>
                                <Table.Head className="w-[100px]">ID Tarjeta</Table.Head>
                                <Table.Head>Título</Table.Head>
                                <Table.Head className="hidden md:table-cell">Detalles</Table.Head>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {filteredEvents.map((event) => {
                                const actionInfo = getActionBadge(event.action)
                                const ActionIcon = actionInfo.icon

                                return (
                                    <Table.Row key={event.id}>
                                        <Table.Cell className="font-mono text-xs">{formatDateTime(event.timestamp)}</Table.Cell>
                                        <Table.Cell>
                                            <Badge variant={actionInfo.variant} className="flex w-fit items-center gap-1">
                                                <ActionIcon className="h-3 w-3" />
                                                <span>{actionInfo.label}</span>
                                            </Badge>
                                        </Table.Cell>
                                        <Table.Cell className="font-mono">{event.cardId}</Table.Cell>
                                        <Table.Cell className="font-medium">{event.cardTitle}</Table.Cell>
                                        <Table.Cell className="hidden md:table-cell text-muted-foreground">{event.details}</Table.Cell>
                                    </Table.Row>
                                )
                            })}
                        </Table.Body>
                    </Table>
                </div>
            )}
        </div>
    )
}