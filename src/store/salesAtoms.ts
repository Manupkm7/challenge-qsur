import { atom, selector } from "recoil"

interface SoldItem {
  id: number
  title: string
  price: number
  soldAt: Date
  quantity: number
}

export const soldItemsState = atom<SoldItem[]>({
  key: "soldItemsState",
  default: [],
})

export const totalSalesState = selector({
  key: "totalSalesState",
  get: ({ get }) => {
    const soldItems = get(soldItemsState)
    return soldItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  },
})

export const salesByMonthState = selector({
  key: "salesByMonthState",
  get: ({ get }) => {
    const soldItems = get(soldItemsState)
    const salesByMonth: Record<string, number> = {}
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

    // Inicializar todos los meses con 0
    months.forEach((month) => {
      salesByMonth[month] = 0
    })

    // Sumar ventas por mes
    soldItems.forEach((item) => {
      const month = months[item.soldAt.getMonth()]
      salesByMonth[month] += item.price * item.quantity
    })

    return salesByMonth
  },
}) 