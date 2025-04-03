import { render, screen } from '@testing-library/react'
import { SearchIcon } from '../SearchIcon'

describe('SearchIcon', () => {
  it('renderiza correctamente con valores por defecto', () => {
    render(<SearchIcon />)
    
    const icon = screen.getByTestId('search-icon')
    expect(icon).toBeInTheDocument()
    expect(icon).toHaveAttribute('width', '24')
    expect(icon).toHaveAttribute('height', '24')
    expect(icon).toHaveAttribute('viewBox', '0 0 24 24')
    expect(icon).toHaveAttribute('fill', 'none')
    expect(icon).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg')
  })

  it('aplica la clase CSS personalizada cuando se proporciona', () => {
    render(<SearchIcon className="custom-class" />)
    
    const icon = screen.getByTestId('search-icon')
    expect(icon).toHaveClass('custom-class')
  })

  it('aplica el color personalizado a los elementos SVG', () => {
    render(<SearchIcon color="#FF0000" />)
    
    const icon = screen.getByTestId('search-icon')
    const circle = icon.querySelector('circle')
    const path = icon.querySelector('path')
    
    expect(circle).toHaveAttribute('stroke', '#FF0000')
    expect(path).toHaveAttribute('stroke', '#FF0000')
  })

  it('aplica el tamaño personalizado', () => {
    render(<SearchIcon size="32" />)
    
    const icon = screen.getByTestId('search-icon')
    expect(icon).toHaveAttribute('width', '32')
    expect(icon).toHaveAttribute('height', '32')
  })

  it('aplica el grosor de trazo personalizado', () => {
    render(<SearchIcon strokeWidth="3" />)
    
    const icon = screen.getByTestId('search-icon')
    const circle = icon.querySelector('circle')
    const path = icon.querySelector('path')
    
    expect(circle).toHaveAttribute('stroke-width', '3')
    expect(path).toHaveAttribute('stroke-width', '3')
  })

  it('renderiza el círculo y la línea de búsqueda', () => {
    render(<SearchIcon />)
    
    const icon = screen.getByTestId('search-icon')
    const circle = icon.querySelector('circle')
    const path = icon.querySelector('path')
    
    expect(circle).toBeInTheDocument()
    expect(path).toBeInTheDocument()
    expect(circle).toHaveAttribute('cx', '10')
    expect(circle).toHaveAttribute('cy', '10')
    expect(circle).toHaveAttribute('r', '7')
    expect(path).toHaveAttribute('d', 'M21 21L15 15')
  })
}) 