import { CardProduct, CardProductProps } from "@/components/Cards/CardProduct"
import { useMemo, useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import { cardsAtom, filtersAtom, isNewCardModalOpenAtom, viewModeAtom } from "@/atoms/index"
import { NewCardModal } from "@/components/Header/NewItem"
import Button from "@/components/Button"
import { EditItemModal } from "@/components/Header/EditItemModal"
import { useHistoryLogger } from "@/hooks/useHistoryStore"
import { MdFormatListBulleted as List } from "@react-icons/all-files/md/MdFormatListBulleted";
import { MdGridOn as Grid3x3 } from "@react-icons/all-files/md/MdGridOn";
type CardProductBase = Omit<CardProductProps, "viewMode">

export const AllItems = () => {
    const [cards, setCards] = useRecoilState<CardProductBase[]>(cardsAtom)
    const [isNewCardModalOpen, setIsNewCardModalOpen] = useRecoilState(isNewCardModalOpenAtom)
    const [isEditCardModalOpen, setIsEditCardModalOpen] = useState(false)
    const [selectedCard, setSelectedCard] = useState<CardProductBase | null>(null)
    const { logCardCreation, logCardDeletion, logCardUpdate } = useHistoryLogger()
    const [viewMode, setViewMode] = useRecoilState(viewModeAtom);
    const filters = useRecoilValue(filtersAtom)

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
                <h2 className="text-xl font-semibold">Tarjetas</h2>
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
                <div className="flex flex-col items-center justify-center p-8 text-center">
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
                    {filteredCards.map((card) => (
                        <CardProduct key={card.id} {...card} viewMode={viewMode} onImageChange={handleImageChange} onCardClick={handleCardClick} />
                    ))}
                </div>
            )}
        </div>
    )
}