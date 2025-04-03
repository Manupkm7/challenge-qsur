import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { History } from '../History'
import { useHistory } from '@/hooks/useHistoryStore'

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      <RecoilRoot>
        {component}
      </RecoilRoot>
    </BrowserRouter>
  )
}

describe('History', () => {
  const mockEvents = [
    {
      id: 1,
      timestamp: new Date('2024-01-01T10:00:00'),
      action: 'create',
      cardId: 1,
      cardTitle: 'Item 1',
      details: 'Item creado'
    },
    {
      id: 2,
      timestamp: new Date('2024-01-02T11:00:00'),
      action: 'update',
      cardId: 2,
      cardTitle: 'Item 2',
      details: 'Precio actualizado a $200'
    },
    {
      id: 3,
      timestamp: new Date('2024-01-03T12:00:00'),
      action: 'delete',
      cardId: 3,
      cardTitle: 'Item 3',
      details: 'Item eliminado'
    }
  ]

  beforeEach(() => {
    ;(useHistory as jest.Mock).mockReturnValue({
      events: mockEvents
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza correctamente el historial de eventos', () => {
    renderWithProviders(<History />)
    
    // Verificar título y descripción
    expect(screen.getByText('Historial de Cambios')).toBeInTheDocument()
    expect(screen.getByText('Registro de todas las acciones realizadas en las tarjetas')).toBeInTheDocument()
    
    // Verificar que se muestran los eventos
    const table = screen.getByTestId('history-table')
    expect(table).toBeInTheDocument()
    
    // Verificar que se muestran los badges correctos
    expect(screen.getByTestId('badge-default')).toBeInTheDocument() // Para creación
    expect(screen.getByTestId('badge-secondary')).toBeInTheDocument() // Para actualización
    expect(screen.getByTestId('badge-destructive')).toBeInTheDocument() // Para eliminación
  })

  it('muestra un mensaje cuando no hay eventos', () => {
    ;(useHistory as jest.Mock).mockReturnValue({
      events: []
    })

    renderWithProviders(<History />)
    
    expect(screen.getByText('No hay eventos en el historial')).toBeInTheDocument()
    expect(screen.getByText('El historial está vacío. Las acciones realizadas en las tarjetas se registrarán aquí.')).toBeInTheDocument()
  })

  it('filtra eventos por texto de búsqueda', () => {
    renderWithProviders(<History />)
    
    const searchInput = screen.getByTestId('search-input')
    fireEvent.change(searchInput, { target: { value: 'Item 1' } })
    
    // Solo debería mostrarse el evento que coincide con la búsqueda
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.queryByText('Item 2')).not.toBeInTheDocument()
    expect(screen.queryByText('Item 3')).not.toBeInTheDocument()
  })

  it('filtra eventos por tipo de acción', () => {
    renderWithProviders(<History />)
    
    // Abrir dropdown de filtros
    const filterButton = screen.getByTestId('filter-button')
    fireEvent.click(filterButton)
    
    // Seleccionar filtro de creaciones
    const createFilter = screen.getByTestId('filter-option-1')
    fireEvent.click(createFilter)
    
    // Solo deberían mostrarse los eventos de creación
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.queryByText('Item 2')).not.toBeInTheDocument()
    expect(screen.queryByText('Item 3')).not.toBeInTheDocument()
  })

  it('muestra un mensaje cuando no hay resultados con los filtros aplicados', () => {
    renderWithProviders(<History />)
    
    // Aplicar filtro que no coincide con ningún evento
    const searchInput = screen.getByTestId('search-input')
    fireEvent.change(searchInput, { target: { value: 'No existe' } })
    
    expect(screen.getByText('No hay eventos en el historial')).toBeInTheDocument()
    expect(screen.getByText('No se encontraron resultados con los filtros actuales.')).toBeInTheDocument()
  })

  it('formatea correctamente las fechas', () => {
    renderWithProviders(<History />)
    
    // Verificar que las fechas se muestran en el formato correcto
    expect(screen.getByText('01/01/2024 10:00:00')).toBeInTheDocument()
    expect(screen.getByText('02/01/2024 11:00:00')).toBeInTheDocument()
    expect(screen.getByText('03/01/2024 12:00:00')).toBeInTheDocument()
  })
}) 