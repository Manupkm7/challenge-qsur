import { useSetRecoilState, useRecoilValue, useRecoilState } from 'recoil';
import { soldItemsState } from '@/store/salesAtoms';
import type { CardProductProps } from '@/components/Cards/CardProduct';
import { randomUUID } from 'crypto';
import { cardsAtom } from '../atoms';

interface SoldItem {
  id: number;
  title: string;
  price: number;
  soldAt: Date;
  quantity: number;
}

export const useSales = () => {
  const setSoldItems = useSetRecoilState(soldItemsState);
  const soldItems = useRecoilValue(soldItemsState);
  const setCards = useSetRecoilState(cardsAtom);
  const cards = useRecoilValue(cardsAtom);

  const markAsSold = (card: Omit<CardProductProps, 'viewMode'>) => {
    if (!card.price) return; // Saltar si no hay precio

    // Crear una nueva venta individual
    const newSale: SoldItem = {
      id: card.id,
      title: card.title,
      price: Number(card.price),
      soldAt: new Date(),
      quantity: 1, // Siempre registramos como 1 venta individual
    };

    setSoldItems((prevItems) => [...prevItems, newSale]);
  };

  const updateSoldItemQuantity = (id: number, newQuantity: number) => {
    // Encontrar el item original
    const originalItem = soldItems.find((item) => item.id === id);
    if (!originalItem) return;

    // Registrar una nueva venta individual
    const newSale: SoldItem = {
      id: originalItem.id,
      title: originalItem.title,
      price: originalItem.price,
      soldAt: new Date(),
      quantity: 1,
    };
    setSoldItems((prevItems) => [...prevItems, newSale]);
  };

  const getAverageSalesFromJanuary = () => {
    const currentDate = new Date();
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1); // 1 de enero del año actual

    // Filtrar ventas desde enero hasta hoy
    const salesFromJanuary = soldItems.filter(
      (item) => item.soldAt >= startOfYear && item.soldAt <= currentDate
    );

    if (salesFromJanuary.length === 0) return 0;

    // Calcular el total de ventas (ahora cada item cuenta como una venta individual)
    const totalSales = salesFromJanuary.reduce((sum, item) => sum + item.price, 0);

    // Calcular el número de días transcurridos
    const daysElapsed = Math.ceil(
      (currentDate.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Calcular el promedio diario
    return totalSales / daysElapsed;
  };

  return {
    markAsSold,
    updateSoldItemQuantity,
    getAverageSalesFromJanuary,
  };
};
