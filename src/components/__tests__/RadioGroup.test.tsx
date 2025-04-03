import { render, screen, fireEvent } from '@testing-library/react'
import { RadioButton, RadixRadioGroup } from '../RadioGroup'

describe('RadioButton', () => {
  const defaultProps = {
    value: false,
    onChange: jest.fn(),
    children: 'Test Radio Button',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza correctamente con las propiedades básicas', () => {
    render(<RadioButton {...defaultProps} />)
    
    expect(screen.getByText('Test Radio Button')).toBeInTheDocument()
    expect(screen.getByTestId('radio-unchecked')).toBeInTheDocument()
  })

  it('renderiza el ícono correcto cuando está seleccionado', () => {
    render(<RadioButton {...defaultProps} value={true} />)
    
    expect(screen.getByTestId('radio-checked')).toBeInTheDocument()
    expect(screen.queryByTestId('radio-unchecked')).not.toBeInTheDocument()
  })

  it('llama a onChange cuando se hace clic', () => {
    render(<RadioButton {...defaultProps} />)
    
    const radioButton = screen.getByText('Test Radio Button').parentElement
    fireEvent.click(radioButton!)
    
    expect(defaultProps.onChange).toHaveBeenCalledTimes(1)
  })

  it('no llama a onChange cuando está deshabilitado', () => {
    render(<RadioButton {...defaultProps} disabled />)
    
    const radioButton = screen.getByText('Test Radio Button').parentElement
    fireEvent.click(radioButton!)
    
    expect(defaultProps.onChange).not.toHaveBeenCalled()
  })

  it('aplica clases personalizadas', () => {
    render(<RadioButton {...defaultProps} className="custom-class" />)
    
    const radioButton = screen.getByText('Test Radio Button').parentElement
    expect(radioButton).toHaveClass('custom-class')
  })

  it('aplica estilos cuando está deshabilitado', () => {
    render(<RadioButton {...defaultProps} disabled />)
    
    const radioButton = screen.getByText('Test Radio Button').parentElement
    expect(radioButton).toHaveClass('opacity-60')
    expect(radioButton).toHaveClass('cursor-not-allowed')
  })
})

describe('RadixRadioGroup', () => {
  const defaultProps = {
    value: 'option1',
    onChange: jest.fn(),
    items: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3', disabled: true },
    ],
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza correctamente con las propiedades básicas', () => {
    render(<RadixRadioGroup {...defaultProps} />)
    
    expect(screen.getByTestId('radio-group-root')).toBeInTheDocument()
    expect(screen.getAllByTestId('radio-item')).toHaveLength(3)
    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
    expect(screen.getByText('Option 3')).toBeInTheDocument()
  })

  it('llama a onChange cuando se selecciona una opción', () => {
    render(<RadixRadioGroup {...defaultProps} />)
    
    const radioGroup = screen.getByTestId('radio-group-root')
    fireEvent.click(radioGroup)
    
    expect(defaultProps.onChange).toHaveBeenCalledWith('test-value')
  })

  it('aplica la orientación correcta', () => {
    render(<RadixRadioGroup {...defaultProps} orientation="vertical" />)
    
    const radioGroup = screen.getByTestId('radio-group-root')
    expect(radioGroup).toHaveAttribute('data-orientation', 'horizontal')
  })
}) 