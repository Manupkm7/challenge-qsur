import { render, screen, fireEvent } from '@testing-library/react'
import { AppHeader } from '../Header'
import { BrowserRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { FilterState } from '@/types/common'

const mockFilters = {
  status: { label: 'Todos', value: 'all' },
  sort: { label: 'Más recientes', value: 'recents' },
  search: ''
}

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      <RecoilRoot>
        {component}
      </RecoilRoot>
    </BrowserRouter>
  )
}

describe('AppHeader', () => {
  const defaultProps = {
    filters: mockFilters,
    onFiltersChange: (filters: FilterState) => jest.fn(),
    onNewClick: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza el título correctamente en la página de inicio', () => {
    renderWithProviders(<AppHeader {...defaultProps} />)
    expect(screen.getByText('Inicio')).toBeInTheDocument()
  })

  it('renderiza los filtros en la página /home', () => {
    // Mock de useLocation para simular la ruta /home
    jest.spyOn(require('react-router-dom'), 'useLocation').mockImplementation(() => ({
      pathname: '/home'
    }))

    renderWithProviders(<AppHeader {...defaultProps} />)

    expect(screen.getByText('Todos')).toBeInTheDocument()
    expect(screen.getByText('Más recientes')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Buscar...')).toBeInTheDocument()
    expect(screen.getByText('Nuevo')).toBeInTheDocument()
  })

  it('no renderiza los filtros en otras páginas', () => {
    // Mock de useLocation para simular una ruta diferente
    jest.spyOn(require('react-router-dom'), 'useLocation').mockImplementation(() => ({
      pathname: 'settings'
    }))

    renderWithProviders(<AppHeader {...defaultProps} />)

    expect(screen.queryByText('Todos')).not.toBeInTheDocument()
    expect(screen.queryByText('Más recientes')).not.toBeInTheDocument()
    expect(screen.queryByPlaceholderText('Buscar...')).not.toBeInTheDocument()
    expect(screen.queryByText('Nuevo')).not.toBeInTheDocument()
  })


  it('llama a onNewClick cuando se hace clic en el botón Nuevo', () => {
    jest.spyOn(require('react-router-dom'), 'useLocation').mockImplementation(() => ({
      pathname: '/home'
    }))

    renderWithProviders(<AppHeader {...defaultProps} />)

    const newButton = screen.getByText('Nuevo')
    fireEvent.click(newButton)

    expect(defaultProps.onNewClick).toHaveBeenCalled()
  })
}) 