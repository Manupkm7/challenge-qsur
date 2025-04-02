import { CardProduct, CardProductProps } from "@/components/Cards/CardProduct"
import { useEffect, useMemo, useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import { cardsAtom, currentPageAtom, filtersAtom, isNewCardModalOpenAtom, itemsPerPageAtom, totalPagesAtom, viewModeAtom } from "@/atoms/index"
import { NewCardModal } from "@/components/Header/NewItem"
import Button from "@/components/Button"
import { EditItemModal } from "@/components/Header/EditItemModal"
import { useHistoryLogger } from "@/hooks/useHistoryStore"
import { MdFormatListBulleted as List } from "@react-icons/all-files/md/MdFormatListBulleted";
import { MdGridOn as Grid3x3 } from "@react-icons/all-files/md/MdGridOn";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/Pagination"
import { useSales } from "@/hooks/useSales"
import { Select } from "@/components/Select"

type CardProductBase = Omit<CardProductProps, "viewMode">

export const AllItems = () => {
    const [cards, setCards] = useRecoilState<CardProductBase[]>(cardsAtom)
    const [isNewCardModalOpen, setIsNewCardModalOpen] = useRecoilState(isNewCardModalOpenAtom)
    const [isEditCardModalOpen, setIsEditCardModalOpen] = useState(false)
    const [selectedCard, setSelectedCard] = useState<CardProductBase | null>(null)
    const { logCardCreation, logCardDeletion, logCardUpdate } = useHistoryLogger()
    const [viewMode, setViewMode] = useRecoilState(viewModeAtom);
    const filters = useRecoilValue(filtersAtom)
    const { markAsSold } = useSales()

    // Pagination state
    const [itemsPerPage, setItemsPerPage] = useRecoilState(itemsPerPageAtom)

    const [currentPage, setCurrentPage] = useRecoilState(currentPageAtom)
    const [totalPages, setTotalPages] = useRecoilState(totalPagesAtom)


    // Apply filters and sorting to cards
    const filteredCards = useMemo(() => {
        return cards
            // Filter by status
            .filter((card) => {
                if (filters.status.value === "all") return true
                return card.status === filters.status.value
            })
            // Filter by search text
            .filter((card) => {
                if (!filters.search) return true
                const searchLower = filters.search.toLowerCase()
                return card.title.toLowerCase().includes(searchLower) || card.description.toLowerCase().includes(searchLower)
            })
            // Sort cards
            .sort((a, b) => {
                switch (filters.sort.value) {
                    case "recents":
                        return b.createdAt.getTime() - a.createdAt.getTime()
                    case "oldest":
                        return a.createdAt.getTime() - b.createdAt.getTime()
                    case "name":
                        return a.title.localeCompare(b.title)
                    default:
                        return 0
                }
            })
    }, [cards, filters])

    // Handle image change
    const handleImageChange = (id: number, image: string | null) => {
        setCards((prevCards) => prevCards.map((card) => (card.id === id ? { ...card, image: image || undefined } : card)))
    }

    const handleNewCard = (card: Omit<CardProductBase, "id" | "createdAt">) => {
        const newCard = { ...card, id: cards.length + 1, createdAt: new Date() }
        setCards((prevCards) => [...prevCards, newCard])

        // Log card creation to history
        logCardCreation(newCard)
    }

    // Handle card update
    const handleUpdateCard = (updatedCard: CardProductBase) => {
        // Find the old card to compare changes
        const oldCard = cards.find((card) => card.id === updatedCard.id)

        setCards((prevCards) => prevCards.map((card) => (card.id === updatedCard.id ? updatedCard : card)))
        // Log card update to history
        if (oldCard) {
            logCardUpdate(oldCard, updatedCard)
        }
    }
    // Handle card deletion
    const handleDeleteCard = (id: number) => {
        // Find the card to be deleted for logging
        const cardToDelete = cards.find((card) => card.id === id)

        setCards((prevCards) => prevCards.filter((card) => card.id !== id))
        // Log card deletion to history
        if (cardToDelete) {
            logCardDeletion(cardToDelete)
        }
    }

    // Handle card click for editing
    const handleCardClick = (card: CardProductBase) => {
        setSelectedCard(card)
        setIsEditCardModalOpen(true)
    }


    // Toggle view mode
    const toggleViewMode = () => {
        setViewMode(viewMode === "grid" ? "list" : "grid")
    }

    // Calculate pagination and update totalPages atom
    const paginatedCards = useMemo(() => {
        const calculatedTotalPages = Math.ceil(filteredCards.length / itemsPerPage)
        setTotalPages(calculatedTotalPages)

        const startIndex = (currentPage - 1) * itemsPerPage
        return filteredCards.slice(startIndex, startIndex + itemsPerPage)
    }, [filteredCards, currentPage, itemsPerPage, setTotalPages])


    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [filters, setCurrentPage])

    const paginationItems = useMemo(() => {
        const items = []

        // Always show first page
        items.push(
            <PaginationItem key="first">
                <PaginationLink
                    href="#"
                    isActive={currentPage === 1}
                    onClick={(e) => {
                        e.preventDefault()
                        setCurrentPage(1)
                    }}
                >
                    1
                </PaginationLink>
            </PaginationItem>,
        )

        // Show ellipsis if needed
        if (currentPage > 3) {
            items.push(
                <PaginationItem key="ellipsis-1">
                    <PaginationEllipsis />
                </PaginationItem>,
            )
        }

        // Show current page and surrounding pages
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            if (i === 1 || i === totalPages) continue // Skip first and last page as they're always shown

            items.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        href="#"
                        isActive={currentPage === i}
                        onClick={(e) => {
                            e.preventDefault()
                            setCurrentPage(i)
                        }}
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>,
            )
        }

        // Show ellipsis if needed
        if (currentPage < totalPages - 2) {
            items.push(
                <PaginationItem key="ellipsis-2">
                    <PaginationEllipsis />
                </PaginationItem>,
            )
        }

        // Always show last page if there's more than one page
        if (totalPages > 1) {
            items.push(
                <PaginationItem key="last">
                    <PaginationLink
                        href="#"
                        isActive={currentPage === totalPages}
                        onClick={(e) => {
                            e.preventDefault()
                            setCurrentPage(totalPages)
                        }}
                    >
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>,
            )
        }

        return items
    }, [currentPage, totalPages, setCurrentPage])

    const handleItemsPerPageChange = (value: string) => {
        setItemsPerPage(parseInt(value))
    }

    return (
        <div className="p-3.5 overflow-y-auto">
            <NewCardModal open={isNewCardModalOpen} onOpenChange={setIsNewCardModalOpen} onSave={handleNewCard} />

            <EditItemModal
                open={isEditCardModalOpen}
                onOpenChange={setIsEditCardModalOpen}
                card={selectedCard}
                onSave={handleUpdateCard}
                onDelete={handleDeleteCard}
            />
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Items</h2>
                <Button variant="secondary" onClick={toggleViewMode}>
                    {viewMode === "grid" ? (
                        <>
                            <List className="h-4 w-4 mr-2" />
                            Ver como lista
                        </>
                    ) : (
                        <>
                            <Grid3x3 className="h-4 w-4 mr-2" />
                            Ver como cuadrícula
                        </>
                    )}
                </Button>


            </div>
            {filteredCards.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center select-none">
                    <h2 className="text-xl font-semibold">No hay items</h2>
                    <p className="text-muted-foreground mb-4">
                        {cards.length === 0
                            ? "Agregue su primer item haciendo clic en el botón 'Nuevo'"
                            : "No se encontraron resultados con los filtros actuales"}
                    </p>
                    {cards.length === 0 && <Button variant="primary" onClick={() => setIsNewCardModalOpen(true)}>Crear nuevo item</Button>}
                </div>
            ) : (
                <div className={viewMode === "grid" ? "flex flex-wrap gap-6" : "flex flex-col gap-4"}>
                    {paginatedCards.map((card) => (
                        <CardProduct key={card.id} {...card} viewMode={viewMode} onImageChange={handleImageChange} onCardClick={handleCardClick} />
                    ))}
                    {totalPages > 1 && (
                        <>
                            <Pagination className="mt-8">
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                if (currentPage > 1) setCurrentPage(currentPage - 1)
                                            }}
                                            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                        />
                                    </PaginationItem>

                                    {paginationItems}

                                    <PaginationItem>
                                        <PaginationNext
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                                            }}
                                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>

                        </>

                    )}

                </div>
            )}
            {filteredCards.length > 0 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                    <Select
                        label="Items por página"
                        value={itemsPerPage.toString()}
                        onChange={handleItemsPerPageChange}
                        className="w-[100px]"
                        options={["10", "25", "50", "100"]}
                    />
                </div>
            )}
        </div>
    )
}