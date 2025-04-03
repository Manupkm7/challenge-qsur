import { render, screen, fireEvent } from '@testing-library/react'
import Button from '../Button'

describe('Button', () => {
  it('renderiza correctamente con la variante primary', () => {
    render(<Button variant="primary">Test Button</Button>)
    
    const button = screen.getByText('Test Button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('data-variant', 'primary')
    expect(button).toHaveClass('bg-primary-500')
    expect(button).toHaveClass('text-white')
  })
  
  it('renderiza correctamente con la variante secondary', () => {
    render(<Button variant="secondary">Test Button</Button>)
    
    const button = screen.getByText('Test Button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('data-variant', 'secondary')
    expect(button).toHaveClass('bg-white')
    expect(button).toHaveClass('text-black')
  })
  
  it('renderiza correctamente con la variante destructive', () => {
    render(<Button variant="destructive">Test Button</Button>)
    
    const button = screen.getByText('Test Button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('data-variant', 'destructive')
    expect(button).toHaveClass('bg-red-500')
    expect(button).toHaveClass('text-white')
  })
  
  it('aplica clases personalizadas correctamente', () => {
    render(<Button variant="primary" className="custom-class">Test Button</Button>)
    
    const button = screen.getByText('Test Button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('custom-class')
  })
  
  it('llama a la función onClick cuando se hace clic', () => {
    const handleClick = jest.fn()
    render(<Button variant="primary" onClick={handleClick}>Test Button</Button>)
    
    const button = screen.getByText('Test Button')
    fireEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
  
  it('no llama a la función onClick cuando está deshabilitado', () => {
    const handleClick = jest.fn()
    render(<Button variant="primary" onClick={handleClick} disabled>Test Button</Button>)
    
    const button = screen.getByText('Test Button')
    fireEvent.click(button)
    
    expect(handleClick).not.toHaveBeenCalled()
    expect(button).toBeDisabled()
    expect(button).toHaveClass('bg-gray-600')
  })
  
  it('no llama a la función onClick cuando está cargando', () => {
    const handleClick = jest.fn()
    render(<Button variant="primary" onClick={handleClick} isLoading>Test Button</Button>)
    
    const button = screen.getByText('Test Button')
    fireEvent.click(button)
    
    expect(handleClick).not.toHaveBeenCalled()
    expect(button).toHaveAttribute('data-loading', 'true')
  })
  
  it('muestra el indicador de carga cuando isLoading es true', () => {
    render(<Button variant="primary" isLoading>Test Button</Button>)
    
    const button = screen.getByText('Test Button')
    const loadingIndicator = button.querySelector('.animate-spin')
    
    expect(loadingIndicator).toBeInTheDocument()
  })
  
  it('aplica la clase hasError cuando hasError es true', () => {
    render(<Button variant="primary" hasError>Test Button</Button>)
    
    const button = screen.getByText('Test Button')
    expect(button).toHaveClass('bg-red-500')
    expect(button).toHaveClass('text-white')
  })
  
  it('tiene el tipo correcto según la prop type', () => {
    render(<Button variant="primary" type="submit">Test Button</Button>)
    
    const button = screen.getByText('Test Button')
    expect(button).toHaveAttribute('type', 'submit')
  })
  
  it('tiene el tipo "button" por defecto', () => {
    render(<Button variant="primary">Test Button</Button>)
    
    const button = screen.getByText('Test Button')
    expect(button).toHaveAttribute('type', 'button')
  })
}) 