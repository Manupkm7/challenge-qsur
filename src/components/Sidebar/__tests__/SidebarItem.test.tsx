import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { RecoilRoot, useRecoilValue } from 'recoil'
import SidebarItem from '../SidebarItem'
import { isSidebarOpenAtom } from '@/atoms'

const mockIcon = <div data-testid="mock-icon">Icon</div>

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      <RecoilRoot>
        {component}
      </RecoilRoot>
    </BrowserRouter>
  )
}

describe('SidebarItem', () => {
  const defaultProps = {
    name: 'Test Item',
    route: '/test',
    icon: mockIcon,
    testId: 'test-item'
  }

  it('renderiza correctamente cuando el sidebar está abierto', () => {
    // Mock de useRecoilValue para simular sidebar abierto
    jest.spyOn(require('recoil'), 'useRecoilValue').mockImplementation(() => true)

    renderWithProviders(<SidebarItem {...defaultProps} />)

    expect(screen.getByText('Test Item')).toBeInTheDocument()
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument()
    expect(screen.getByTestId('test-item')).toHaveClass('justify-start')
  })

  it('renderiza correctamente cuando el sidebar está cerrado', () => {
    // Mock de useRecoilValue para simular sidebar cerrado
    jest.spyOn(require('recoil'), 'useRecoilValue').mockImplementation(() => false)

    renderWithProviders(<SidebarItem {...defaultProps} />)

    expect(screen.queryByText('Test Item')).not.toBeInTheDocument()
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument()
    expect(screen.getByTestId('test-item')).toHaveClass('justify-center')
  })

  it('aplica la clase CSS personalizada cuando se proporciona', () => {
    jest.spyOn(require('recoil'), 'useRecoilValue').mockImplementation(() => true)

    renderWithProviders(<SidebarItem {...defaultProps} className="custom-class" />)

    expect(screen.getByTestId('test-item')).toHaveClass('custom-class')
  })

  it('llama a onClick cuando se hace clic en el elemento', () => {
    const handleClick = jest.fn()
    jest.spyOn(require('recoil'), 'useRecoilValue').mockImplementation(() => true)

    renderWithProviders(<SidebarItem {...defaultProps} onClick={handleClick} />)

    fireEvent.click(screen.getByTestId('test-item'))
    expect(handleClick).toHaveBeenCalled()
  })

  it('renderiza el enlace con la ruta correcta', () => {
    jest.spyOn(require('recoil'), 'useRecoilValue').mockImplementation(() => true)

    renderWithProviders(<SidebarItem {...defaultProps} />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/test')
  })

  it('aplica el estilo activo cuando la ruta coincide con la ubicación actual', () => {
    // Mock de location.pathname
    Object.defineProperty(window, 'location', {
      value: { pathname: '/test' },
      writable: true
    })

    jest.spyOn(require('recoil'), 'useRecoilValue').mockImplementation(() => true)

    renderWithProviders(<SidebarItem {...defaultProps} />)

    expect(screen.getByTestId('test-item')).toHaveClass('text-[#0074B5]')
  })
}) 