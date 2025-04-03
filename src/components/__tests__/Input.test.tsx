import { render, screen, fireEvent } from '@testing-library/react'
import Input from '../Input'

describe('Input', () => {
  const defaultProps = {
    value: '',
    onChange: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza correctamente con las propiedades básicas', () => {
    render(<Input {...defaultProps} testId='input' />)
    
    const input = screen.getByTestId('input')
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue('')
  })

  it('renderiza con un valor inicial', () => {
    render(<Input {...defaultProps} value="test value" testId='input' />)
    
    const input = screen.getByTestId('input')
    expect(input).toHaveValue('test value')
  })

  it('llama a onChange cuando se modifica el valor', () => {
    render(<Input {...defaultProps} testId='input' />)
    
    const input = screen.getByTestId('input')
    fireEvent.change(input, { target: { value: 'new value' } })
    
    expect(defaultProps.onChange).toHaveBeenCalledWith('new value')
  })

  it('renderiza con una etiqueta', () => {
    render(<Input {...defaultProps} labelContent="Test Label" testId='input' />)
    
    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('aplica clases personalizadas al input', () => {
    render(<Input {...defaultProps} inputClassName="custom-input" testId='input' />)
    
    const inputContainer = screen.getByTestId('input').parentElement?.parentElement
    expect(inputContainer).toHaveClass('custom-input')
  })

  it('aplica clases personalizadas a la etiqueta', () => {
    render(<Input {...defaultProps} labelContent="Test Label" labelClassName="custom-label" testId='input' />)
    
    const label = screen.getByText('Test Label')
    expect(label).toHaveClass('custom-label')
  })

  it('renderiza en modo oscuro', () => {
    render(<Input {...defaultProps} dark testId='input' />)
    
    const input = screen.getByTestId('input')
    expect(input).toHaveStyle({
      color: '#FFFFFF',
      background: '#111317'
    })
  })

  it('muestra estado de error', () => {
    render(<Input {...defaultProps} hasError testId='input' />)
    
    const inputContainer = screen.getByTestId('input').parentElement?.parentElement
    expect(inputContainer).toHaveClass('focus-within:border-red-500')
  })

  it('renderiza deshabilitado', () => {
    render(<Input {...defaultProps} disabled testId='input' />)
    
    const input = screen.getByTestId('input')
    expect(input).toBeDisabled()
    expect(input).toHaveClass('cursor-not-allowed')
  })

  it('renderiza con un placeholder', () => {
    render(<Input {...defaultProps} placeholder="Enter text" testId='input' />)
    
    const input = screen.getByPlaceholderText('Enter text')
    expect(input).toBeInTheDocument()
  })

  it('renderiza con un tipo específico', () => {
    render(<Input {...defaultProps} type="password" testId='input' />)
    
    const input = screen.getByTestId('input')
    expect(input).toHaveAttribute('type', 'password')
  })
}) 