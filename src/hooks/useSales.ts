import { useSetRecoilState } from "recoil"
import { soldItemsState } from "@/store/salesAtoms"
import { CardProductProps } from "@/components/Cards/CardProduct"

export const useSales = () => {
  const setSoldItems = useSetRecoilState(soldItemsState)

  const markAsSold = (card: Omit<CardProductProps, "viewMode">) => {
    if (!card.price) return // Skip if no price

    setSoldItems((prevItems) => [
      ...prevItems,
      {
        id: card.id,
        title: card.title,
        price: Number(card.price),
        soldAt: new Date(),
      },
    ])
  }

  return {
    markAsSold,
  }
} 