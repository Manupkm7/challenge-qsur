import { CardProduct, CardProductProps } from "@/components/Cards/CardProduct"
import { useMemo, useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import { cardsAtom, filtersAtom, isNewCardModalOpenAtom } from "@/atoms/index"
import { NewCardModal } from "@/components/Header/NewItem"
import Button from "@/components/Button"
import { EditItemModal } from "@/components/Header/EditItemModal"

export const AllItems = () => {
    const [cards, setCards] = useRecoilState<CardProductProps[]>(cardsAtom)
    const [isNewCardModalOpen, setIsNewCardModalOpen] = useRecoilState(isNewCardModalOpenAtom)
    const [isEditCardModalOpen, setIsEditCardModalOpen] = useState(false)
    const [selectedCard, setSelectedCard] = useState<CardProductProps | null>(null)

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

    const handleNewCard = (card: Omit<CardProductProps, "id" | "createdAt">) => {
        setCards((prevCards) => [...prevCards, { ...card, id: prevCards.length + 1, createdAt: new Date() }])
    }

    // Handle card update
    const handleUpdateCard = (updatedCard: CardProductProps) => {
        // Find the old card to compare changes
        const oldCard = cards.find((card) => card.id === updatedCard.id)

        setCards((prevCards) => prevCards.map((card) => (card.id === updatedCard.id ? updatedCard : card)))
    }
    // Handle card deletion
    const handleDeleteCard = (id: number) => {
        // Find the card to be deleted for logging
        const cardToDelete = cards.find((card) => card.id === id)

        setCards((prevCards) => prevCards.filter((card) => card.id !== id))

    }

    // Handle card click for editing
    const handleCardClick = (card: CardProductProps) => {
        setSelectedCard(card)
        setIsEditCardModalOpen(true)
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
                <div className="flex flex-wrap gap-6">
                    {filteredCards.map((card) => (
                        <CardProduct key={card.id} {...card} onImageChange={handleImageChange} onCardClick={handleCardClick} />
                    ))}
                </div>
            )}
        </div>
    )
}