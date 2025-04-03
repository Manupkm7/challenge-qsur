import { screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AllItems } from '../AllItems'
import { cardsAtom, currentPageAtom, filtersAtom, isNewCardModalOpenAtom, itemsPerPageAtom, totalPagesAtom, viewModeAtom } from '../../atoms'
import { useSales } from '@/hooks/useSales'
import { useHistoryLogger } from '@/hooks/useHistoryStore'
import { renderWithRecoil, setupRecoilMocks, setupSalesMock, setupHistoryLoggerMock } from '@/utils/test-utils'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

// Mock de react-router-dom
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    ...originalModule,
    BrowserRouter: ({ children }: { children: React.ReactNode }) => children
  };
});

// Mock de recoil
jest.mock('recoil', () => {
  const originalModule = jest.requireActual('recoil');
  return {
    ...originalModule,
    useRecoilState: jest.fn(),
    useRecoilValue: jest.fn(),
    useSetRecoilState: jest.fn()
  };
});

// Mock de useHistoryLogger
jest.mock('@/hooks/useHistoryStore', () => ({
  useHistoryLogger: () => ({
    logCardCreation: jest.fn(),
    logCardUpdate: jest.fn(),
    logCardDeletion: jest.fn(),
    logItemSold: jest.fn()
  })
}))

describe('AllItems', () => {
  const mockCards = [
    { id: 1, title: 'Item 1', description: 'Descripción 1', price: 100, quantity: 5, status: 'active', createdAt: new Date(), image: 'image1.jpg' },
    { id: 2, title: 'Item 2', description: 'Descripción 2', price: 200, quantity: 3, status: 'active', createdAt: new Date(), image: 'image2.jpg' },
    { id: 3, title: 'Item 3', description: 'Descripción 3', price: 300, quantity: 0, status: 'inactive', createdAt: new Date(), image: 'image3.jpg' }
  ]

  const mockSetCards = jest.fn()
  const mockSetIsNewCardModalOpen = jest.fn()
  const mockSetViewMode = jest.fn()
  const mockSetItemsPerPage = jest.fn()
  const mockSetCurrentPage = jest.fn()
  const mockSetTotalPages = jest.fn()
  const mockMarkAsSold = jest.fn()
  const mockLogCardCreation = jest.fn()
  const mockLogCardUpdate = jest.fn()
  const mockLogCardDeletion = jest.fn()
  const mockLogItemSold = jest.fn()

  beforeEach(() => {
    // Configurar mocks de Recoil
    setupRecoilMocks({
      [cardsAtom.key]: { value: mockCards, setter: mockSetCards },
      [isNewCardModalOpenAtom.key]: { value: false, setter: mockSetIsNewCardModalOpen },
      [viewModeAtom.key]: { value: 'grid', setter: mockSetViewMode },
      [itemsPerPageAtom.key]: { value: 10, setter: mockSetItemsPerPage },
      [currentPageAtom.key]: { value: 1, setter: mockSetCurrentPage },
      [totalPagesAtom.key]: { value: 1, setter: mockSetTotalPages },
      [filtersAtom.key]: { value: { status: { value: 'all' }, search: '', sort: { value: 'recents' } } }
    })

    // Configurar mock de useSales
    setupSalesMock({
      markAsSold: mockMarkAsSold
    })

    // Configurar mock de useHistoryLogger
    setupHistoryLoggerMock({
      logCardCreation: mockLogCardCreation,
      logCardUpdate: mockLogCardUpdate,
      logCardDeletion: mockLogCardDeletion,
      logItemSold: mockLogItemSold
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza correctamente la lista de items', () => {
    renderWithRecoil(<AllItems />)
    
    // Verificar que se muestran los items
    const cardProducts = screen.getAllByTestId('card-product')
    expect(cardProducts).toHaveLength(3)
    expect(cardProducts[0]).toHaveTextContent('Item 1')
    expect(cardProducts[1]).toHaveTextContent('Item 2')
    expect(cardProducts[2]).toHaveTextContent('Item 3')
  })

  it('muestra un mensaje cuando no hay items', () => {
    // Configurar mock para mostrar lista vacía
    setupRecoilMocks({
      [cardsAtom.key]: { value: [], setter: mockSetCards },
      [filtersAtom.key]: { value: { status: { value: 'all' }, search: '', sort: { value: 'recents' } } }
    })

    renderWithRecoil(<AllItems />)
    
    expect(screen.getByText('No hay items')).toBeInTheDocument()
    expect(screen.getByText('Agregue su primer item haciendo clic en el botón \'Nuevo\'')).toBeInTheDocument()
  })

  it('alterna entre vista de cuadrícula y lista', () => {
    renderWithRecoil(<AllItems />)
    
    const toggleButton = screen.getByTestId('button')
    fireEvent.click(toggleButton)
    
    expect(mockSetViewMode).toHaveBeenCalledWith('list')
  })

  it('abre el modal de nuevo item', () => {
    ;(useRecoilState as jest.Mock).mockImplementation((atom) => {
      if (atom === isNewCardModalOpenAtom) return [true, mockSetIsNewCardModalOpen]
      return [null, jest.fn()]
    })

    renderWithRecoil(<AllItems />)
    
    expect(screen.getByTestId('new-card-modal')).toBeInTheDocument()
  })

  it('abre el modal de edición al hacer clic en un item', () => {
    renderWithRecoil(<AllItems />)
    
    const firstCard = screen.getAllByTestId('card-product')[0]
    fireEvent.click(firstCard)
    
    expect(screen.getByTestId('edit-card-modal')).toBeInTheDocument()
  })

  it('actualiza un item al guardar en el modal de edición', () => {
    renderWithRecoil(<AllItems />)
    
    // Abrir modal de edición
    const firstCard = screen.getAllByTestId('card-product')[0]
    fireEvent.click(firstCard)
    
    // Guardar cambios
    const saveButton = screen.getByText('Guardar')
    fireEvent.click(saveButton)
    
    expect(mockSetCards).toHaveBeenCalled()
    expect(mockLogCardUpdate).toHaveBeenCalled()
  })

  it('elimina un item al hacer clic en eliminar en el modal de edición', () => {
    renderWithRecoil(<AllItems />)
    
    // Abrir modal de edición
    const firstCard = screen.getAllByTestId('card-product')[0]
    fireEvent.click(firstCard)
    
    // Eliminar item
    const deleteButton = screen.getByText('Eliminar')
    fireEvent.click(deleteButton)
    
    expect(mockSetCards).toHaveBeenCalled()
    expect(mockLogCardDeletion).toHaveBeenCalled()
  })

  it('cambia el número de items por página', () => {
    renderWithRecoil(<AllItems />)
    
    const select = screen.getByTestId('select')
    fireEvent.change(select, { target: { value: '25' } })
    
    expect(mockSetItemsPerPage).toHaveBeenCalledWith(25)
  })

  it('filtra items por estado', () => {
    ;(useRecoilValue as jest.Mock).mockImplementation((atom) => {
      if (atom === filtersAtom) return { status: { value: 'active' }, search: '', sort: { value: 'recents' } }
      return null
    })

    renderWithRecoil(<AllItems />)
    
    // Solo deberían mostrarse los items activos (con cantidad > 0)
    const cardProducts = screen.getAllByTestId('card-product')
    expect(cardProducts).toHaveLength(2)
    expect(cardProducts[0]).toHaveTextContent('Item 1')
    expect(cardProducts[1]).toHaveTextContent('Item 2')
  })

  it('filtra items por texto de búsqueda', () => {
    ;(useRecoilValue as jest.Mock).mockImplementation((atom) => {
      if (atom === filtersAtom) return { status: { value: 'all' }, search: 'Item 1', sort: { value: 'recents' } }
      return null
    })

    renderWithRecoil(<AllItems />)
    
    // Solo debería mostrarse el item que coincide con la búsqueda
    const cardProducts = screen.getAllByTestId('card-product')
    expect(cardProducts).toHaveLength(1)
    expect(cardProducts[0]).toHaveTextContent('Item 1')
  })
}) 