import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { RecoilRoot, useRecoilState, useRecoilValue } from 'recoil'
import { AppSidebar } from '../Sidebar'
import { useLocalStorage } from '@/hooks/useLocalStorage'

// Mock de Recoil
jest.mock('recoil', () => ({
  RecoilRoot: ({ children }: { children: React.ReactNode }) => children,
  atom: jest.fn(({ key, default: defaultValue }) => ({
    key,
    default: defaultValue,
  })),
  useRecoilState: jest.fn(),
  useRecoilValue: jest.fn(),
  useSetRecoilState: jest.fn(),
  selector: jest.fn(),
}))

jest.mock('@/hooks/useLocalStorage', () => ({
  useLocalStorage: jest.fn(),
}))

// Mock de localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
  length: 0,
  key: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
})

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
    jest.clearAllMocks()
    ;(useRecoilState as jest.Mock).mockImplementation(() => [mockIsSidebarOpen, mockSetIsSidebarOpen])
    ;(useRecoilValue as jest.Mock).mockImplementation(() => mockDarkMode)
    ;(useLocalStorage as jest.Mock).mockImplementation(() => [mockIsSidebarOpen, mockSetIsSidebarOpenStored])
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'isSidebarOpen') return 'true'
      if (key === 'darkMode') return 'false'
      return null
    })
  })

  describe('Renderizado inicial', () => {
    it('debería renderizar el título cuando el sidebar está abierto', () => {
      renderWithProviders(<AppSidebar />)
      expect(screen.getByText('Gestion de Items')).toBeInTheDocument()
    })

    it('debería renderizar todos los elementos de navegación con sus iconos', () => {
      renderWithProviders(<AppSidebar />)
      
      const navItems = ['Inicio', 'Dashboard', 'Historial', 'Configuración']
      navItems.forEach(item => {
        const button = screen.getByTestId(`sidebar-${item}-btn`)
        expect(button).toBeInTheDocument()
        expect(button.querySelector('svg')).toBeInTheDocument()
      })
    })

    it('debería renderizar el botón de soporte', () => {
      renderWithProviders(<AppSidebar />)
      expect(screen.getByTestId('sidebar-soporte-btn')).toBeInTheDocument()
    })
  })

  describe('Comportamiento del sidebar', () => {
    it('debería alternar el estado del sidebar al hacer clic en el botón', () => {
      renderWithProviders(<AppSidebar />)
      
      const toggleButton = screen.getByTestId('sidebar-handler-btn')
      fireEvent.click(toggleButton)

      expect(mockSetIsSidebarOpen).toHaveBeenCalledWith(!mockIsSidebarOpen)
      expect(mockSetIsSidebarOpenStored).toHaveBeenCalledWith(!mockIsSidebarOpen)
    })

    it('debería aplicar el ancho correcto cuando el sidebar está abierto', () => {
      renderWithProviders(<AppSidebar />)
      const aside = screen.getByRole('complementary')
      expect(aside).toHaveClass('w-[280px]')
    })

    it('debería aplicar el ancho reducido cuando el sidebar está cerrado', () => {
      ;(useRecoilState as jest.Mock).mockReturnValue([false, mockSetIsSidebarOpen])
      renderWithProviders(<AppSidebar />)
      
      const aside = screen.getByRole('complementary')
      expect(aside).toHaveClass('w-[80px]')
    })
  })

  describe('Estilos y temas', () => {
    it('debería renderizar el botón de menú con el color correcto', () => {
      renderWithProviders(<AppSidebar />)
      const menuIcon = screen.getByTestId('sidebar-handler-btn').querySelector('svg')
      expect(menuIcon).toHaveAttribute('color', '#279AF1')
    })

    it('debería aplicar los estilos correctos en modo oscuro', () => {
      ;(useRecoilValue as jest.Mock).mockReturnValue(true)
      renderWithProviders(<AppSidebar />)
      
      const supportLabel = screen.getByText('Soporte')
      expect(supportLabel).toHaveClass('text-white')
    })

    it('debería aplicar los estilos correctos en modo claro', () => {
      ;(useRecoilValue as jest.Mock).mockReturnValue(false)
      renderWithProviders(<AppSidebar />)
      
      const supportLabel = screen.getByText('Soporte')
      expect(supportLabel).toHaveClass('text-[#0074B5]')
    })
  })
}) 