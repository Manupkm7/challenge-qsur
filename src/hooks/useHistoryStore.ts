import { useEffect } from "react"
import { atom, useRecoilState } from "recoil"
import { CardProductProps } from "@/components/Cards/CardProduct"

export type HistoryAction = "create" | "update" | "delete"

export interface HistoryEvent {
    id: string
    timestamp: Date
    action: HistoryAction
    cardId: number
    cardTitle: string
    details: string
    user?: string
}

// Recoil atom for history events
export const historyEventsState = atom<HistoryEvent[]>({
    key: "historyEventsState",
    default: [],
})

// Custom hook for history management with localStorage persistence
export function useHistory() {
    const [events, setEvents] = useRecoilState(historyEventsState)

    // Load events from localStorage on initial render
    useEffect(() => {
        try {
            const savedEvents = localStorage.getItem("card-history-storage")
            if (savedEvents) {
                const parsedEvents = JSON.parse(savedEvents)
                // Convert string dates back to Date objects
                const eventsWithDates = parsedEvents.map((event: any) => ({
                    ...event,
                    timestamp: new Date(event.timestamp),
                }))
                setEvents(eventsWithDates)
            }
        } catch (error) {
            console.error("Error loading history from localStorage:", error)
        }
    }, [setEvents])

    // Save events to localStorage when they change
    useEffect(() => {
        localStorage.setItem("card-history-storage", JSON.stringify(events))
    }, [events])

    // Add a new event to history
    const addEvent = (eventData: Omit<HistoryEvent, "id" | "timestamp">) => {
        const newEvent: HistoryEvent = {
            id: crypto.randomUUID(),
            timestamp: new Date(),
            ...eventData,
        }

        setEvents((prevEvents) => [newEvent, ...prevEvents])
    }

    // Clear all history
    const clearHistory = () => {
        setEvents([])
    }

    return {
        events,
        addEvent,
        clearHistory,
    }
}

// Helper functions to log specific events
export function useHistoryLogger() {
    const { addEvent } = useHistory()

    const logCardCreation = (card: Omit<CardProductProps, "viewMode">) => {
        addEvent({
            action: "create",
            cardId: card.id,
            cardTitle: card.title,
            details: `Tarjeta creada con estado: ${card.status === "active" ? "Activo" : "Inactivo"}`,
        })
    }

    const logCardUpdate = (oldCard: Omit<CardProductProps, "viewMode">, newCard: Omit<CardProductProps, "viewMode">) => {
        const changes: string[] = []

        if (oldCard.title !== newCard.title) {
            changes.push(`título cambiado de "${oldCard.title}" a "${newCard.title}"`)
        }

        if (oldCard.status !== newCard.status) {
            changes.push(
                `estado cambiado de "${oldCard.status === "active" ? "Activo" : "Inactivo"}" a "${newCard.status === "active" ? "Activo" : "Inactivo"}"`,
            )
        }

        if (oldCard.description !== newCard.description) {
            changes.push("descripción actualizada")
        }

        if ((oldCard.image || "") !== (newCard.image || "")) {
            changes.push(newCard.image ? (oldCard.image ? "imagen actualizada" : "imagen añadida") : "imagen eliminada")
        }

        if (changes.length === 0) {
            changes.push("sin cambios detectados")
        }

        addEvent({
            action: "update",
            cardId: newCard.id,
            cardTitle: newCard.title,
            details: `Tarjeta actualizada: ${changes.join(", ")}`,
        })
    }

    const logCardDeletion = (card: Omit<CardProductProps, "viewMode">) => {
        addEvent({
            action: "delete",
            cardId: card.id,
            cardTitle: card.title,
            details: `Tarjeta eliminada`,
        })
    }

    return {
        logCardCreation,
        logCardUpdate,
        logCardDeletion,
    }
}

