import { render, screen } from '@testing-library/react'
import NotFoundPage from '../NotFoundPage'

describe('NotFoundPage', () => {
  it('renderiza correctamente el mensaje de error 404', () => {
    render(<NotFoundPage />)

    // Verificar que se muestra el código de error 404
    expect(screen.getByText('404')).toBeInTheDocument()
  })

  it('renderiza correctamente el mensaje "Page not found"', () => {
    render(<NotFoundPage />)

    // Verificar que se muestra el mensaje de error
    expect(screen.getByText('Page not found')).toBeInTheDocument()
  })

  it('renderiza el logo de NotFound', () => {
    render(<NotFoundPage />)

    // Verificar que se renderiza el componente NotFoundLogoSvg
    const notFoundLogo = screen.getByTestId('not-found-logo')
    expect(notFoundLogo).toBeInTheDocument()
  })

}) 