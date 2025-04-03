import { render, screen, fireEvent, act } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { RecoilRoot, useRecoilState } from 'recoil'
import { SettingsPage } from '../Configuration'
import { darkModeAtom } from '../../atoms'
import React from 'react'


// Mock de Recoil
jest.mock('recoil', () => ({
  ...jest.requireActual('recoil'),
  useRecoilState: jest.fn()
}))

// Mock de localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn()
}
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage })

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      <RecoilRoot>
        {component}
      </RecoilRoot>
    </BrowserRouter>
  )
}

describe('SettingsPage', () => {
  const mockSetDark = jest.fn()
  
  beforeEach(() => {
    // Configurar mocks
    ;(useRecoilState as jest.Mock).mockImplementation((atom) => {
      if (atom === darkModeAtom) return [false, mockSetDark]
      return [null, jest.fn()]
    })
    
    // Limpiar localStorage mock
    mockLocalStorage.getItem.mockClear()
    mockLocalStorage.setItem.mockClear()
  })
  
  afterEach(() => {
    jest.clearAllMocks()
  })
  
  it('renderiza correctamente la página de configuración', () => {
    renderWithProviders(<SettingsPage />)
    
    // Verificar títulos de las secciones
    expect(screen.getByText('Configuración')).toBeInTheDocument()
    expect(screen.getByText('Apariencia')).toBeInTheDocument()
    expect(screen.getByText('Idioma')).toBeInTheDocument()
    expect(screen.getByText('Notificaciones')).toBeInTheDocument()
  })
  
  it('cambia el tema oscuro al hacer clic en el switch', () => {
    renderWithProviders(<SettingsPage />)
    
    const themeSwitches = screen.getAllByTestId('switch-root')
    const themeSwitch = themeSwitches[1]
    fireEvent.click(themeSwitch)
    
    expect(mockSetDark).toHaveBeenCalledWith(true)
  })
  
  it('cambia el idioma al seleccionar una opción', () => {
    renderWithProviders(<SettingsPage />)
    
    // Seleccionar inglés
    const englishRadio = screen.getAllByTestId('radio-button')[1]
    fireEvent.click(englishRadio)
    
    // Verificar que se guarda en localStorage
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('app-language', 'en')
  })
  
  it('carga el idioma guardado en localStorage al montar el componente', () => {
    mockLocalStorage.getItem.mockReturnValue('en')
    
    renderWithProviders(<SettingsPage />)
    
    // Verificar que se carga el idioma guardado
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('app-language')
  })

  
  it('renderiza los switches de notificaciones con el estado correcto', () => {
    renderWithProviders(<SettingsPage />)
    
    const notificationSwitches = screen.getAllByTestId('switch-root')
    expect(notificationSwitches).toHaveLength(4) // Tema oscuro + 3 notificaciones
    
    // Verificar que los switches de notificaciones están desactivados por defecto
    notificationSwitches.slice(1).forEach(switchEl => {
      expect(switchEl).not.toBeChecked()
    })
  })
  
  it('renderiza los divisores entre las opciones de notificaciones', () => {
    renderWithProviders(<SettingsPage />)
    
    const dividers = screen.getAllByTestId('divider')
    expect(dividers).toHaveLength(2) // Entre las 3 opciones de notificaciones
  })
}) 