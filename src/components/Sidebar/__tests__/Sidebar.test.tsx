import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { RecoilRoot, useRecoilState, useRecoilValue } from 'recoil'
import { AppSidebar } from '../Sidebar'
import { useLocalStorage } from '@/hooks/useLocalStorage'


const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      <RecoilRoot>
        {component}
      </RecoilRoot>
    </BrowserRouter>
  )
}

describe('AppSidebar', () => {
  const mockSetIsSidebarOpen = jest.fn()
  const mockSetIsSidebarOpenStored = jest.fn()
  const mockIsSidebarOpen = true
  const mockDarkMode = false

  beforeEach(() => {
    // Configurar mocks
    ;(useRecoilState as jest.Mock).mockReturnValue([mockIsSidebarOpen, mockSetIsSidebarOpen])
    ;(useRecoilValue as jest.Mock).mockReturnValue(mockDarkMode)
    ;(useLocalStorage as jest.Mock).mockReturnValue([mockIsSidebarOpen, mockSetIsSidebarOpenStored])
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza el título cuando el sidebar está abierto', () => {
    renderWithProviders(<AppSidebar />)
    expect(screen.getByText('Gestion de Items')).toBeInTheDocument()
  })

  it('renderiza todos los elementos de navegación', () => {
    renderWithProviders(<AppSidebar />)
    
    expect(screen.getByTestId('sidebar-Inicio-btn')).toBeInTheDocument()
    expect(screen.getByTestId('sidebar-Dashboard-btn')).toBeInTheDocument()
    expect(screen.getByTestId('sidebar-Historial-btn')).toBeInTheDocument()
    expect(screen.getByTestId('sidebar-Configuración-btn')).toBeInTheDocument()
    expect(screen.getByTestId('sidebar-soporte-btn')).toBeInTheDocument()
  })

  it('alterna el estado del sidebar al hacer clic en el botón', () => {
    renderWithProviders(<AppSidebar />)
    
    const toggleButton = screen.getByTestId('sidebar-handler-btn')
    fireEvent.click(toggleButton)

    expect(mockSetIsSidebarOpen).toHaveBeenCalledWith(!mockIsSidebarOpen)
    expect(mockSetIsSidebarOpenStored).toHaveBeenCalledWith(!mockIsSidebarOpen)
  })

  it('muestra el texto "Soporte" cuando el sidebar está abierto', () => {
    renderWithProviders(<AppSidebar />)
    expect(screen.getByText('Soporte')).toBeInTheDocument()
  })

  it('aplica el ancho correcto basado en el estado del sidebar', () => {
    renderWithProviders(<AppSidebar />)
    
    const aside = screen.getByRole('complementary')
    expect(aside).toHaveClass('w-[280px]')
  })

  it('aplica el ancho reducido cuando el sidebar está cerrado', () => {
    ;(useRecoilState as jest.Mock).mockReturnValue([false, mockSetIsSidebarOpen])
    renderWithProviders(<AppSidebar />)
    
    const aside = screen.getByRole('complementary')
    expect(aside).toHaveClass('w-[80px]')
  })

  it('renderiza el botón de menú con el color correcto', () => {
    renderWithProviders(<AppSidebar />)
    
    const menuIcon = screen.getByTestId('sidebar-handler-btn').querySelector('svg')
    expect(menuIcon).toHaveAttribute('color', '#279AF1')
  })
}) 