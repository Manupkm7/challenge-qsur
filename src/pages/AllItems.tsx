import { CardProduct, CardProductProps } from "@/components/Cards/CardProduct"
import { useMemo, useState } from "react"
import { useRecoilValue } from "recoil"
import { filtersAtom } from "@/atoms/index"

const generateCards = (): CardProductProps[] => {
    return Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        title: `Tarjeta ${i + 1}`,
        description: `Descripción de la tarjeta ${i + 1} con información detallada.`,
        status: i % 3 === 0 ? "inactive" : "active",
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
        image: i % 4 === 0 ? `/placeholder.svg?height=400&width=600` : undefined,
    }))
}

export const AllItems = () => {
    const [cards, setCards] = useState<CardProductProps[]>(generateCards())
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

    return (
        <div className="p-3.5 overflow-y-auto">
            {filteredCards.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                    <h2 className="text-xl font-semibold">No se encontraron resultados</h2>
                    <p className="text-muted-foreground">Intenta cambiar los filtros o términos de búsqueda</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredCards.map((card) => (
                        <CardProduct key={card.id} {...card} onImageChange={handleImageChange} />
                    ))}
                </div>
            )}
        </div>
    )
}