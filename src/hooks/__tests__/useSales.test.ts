import { renderHook, act } from '@testing-library/react'
import { useRecoilValue } from 'recoil'
import { useSales } from '../useSales'
import { soldItemsState } from '@/store/salesAtoms'
import { TestWrapper } from '@/utils/test-utils'

describe('useSales', () => {
  it('should mark an item as sold', () => {
    const { result } = renderHook(() => useSales(), { wrapper: TestWrapper })

    const mockCard = {
      id: 1,
      title: 'Test Item',
      price: '100',
      quantity: 1,
      status: 'active' as const,
      description: 'Test Description',
      createdAt: new Date(),
    }

    act(() => {
      result.current.markAsSold(mockCard)
    })

    // Verificar que el item se agregó a soldItems
    const { result: soldItemsResult } = renderHook(
      () => useRecoilValue(soldItemsState),
      { wrapper: TestWrapper }
    )

    expect(soldItemsResult.current).toHaveLength(1)
    expect(soldItemsResult.current[0]).toMatchObject({
      id: mockCard.id,
      title: mockCard.title,
      price: Number(mockCard.price),
      quantity: 1,
    })
  })

  it('should not mark an item as sold if it has no price', () => {
    const { result } = renderHook(() => useSales(), { wrapper: TestWrapper })

    const mockCard = {
      id: 1,
      title: 'Test Item',
      price: '',
      quantity: 1,
      status: 'active' as const,
      description: 'Test Description',
      createdAt: new Date(),
    }

    act(() => {
      result.current.markAsSold(mockCard)
    })

    const { result: soldItemsResult } = renderHook(
      () => useRecoilValue(soldItemsState),
      { wrapper: TestWrapper }
    )

    expect(soldItemsResult.current).toHaveLength(0)
  })

  it('should calculate average sales from January', () => {
    const { result } = renderHook(() => useSales(), { wrapper: TestWrapper })

    // Agregar algunas ventas de prueba
    const mockCard = {
      id: 1,
      title: 'Test Item',
      price: '100',
      quantity: 1,
      status: 'active' as const,
      description: 'Test Description',
      createdAt: new Date(),
    }

    act(() => {
      result.current.markAsSold(mockCard)
      result.current.markAsSold(mockCard)
    })

    const average = result.current.getAverageSalesFromJanuary()
    expect(average).toBeGreaterThan(0)
  })
}) 