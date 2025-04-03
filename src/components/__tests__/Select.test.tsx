import { render, screen, fireEvent } from '@testing-library/react'
import { Select } from '../Select'

describe('Select', () => {
  const defaultOptions = [
    { id: 1, name: 'Option 1', value: 'option1' },
    { id: 2, name: 'Option 2', value: 'option2' },
    { id: 3, name: 'Option 3', value: 'option3' },
  ]

  const defaultProps = {
    options: defaultOptions,
    extractLabel: (option: any) => option.name,
    extractValue: (option: any) => option.value,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza correctamente con las propiedades básicas', () => {
    render(<Select {...defaultProps} dataTestId='select' />)

    expect(screen.getByTestId('select-trigger')).toBeInTheDocument()
    expect(screen.getByTestId('select-icon')).toBeInTheDocument()
  })

  it('renderiza con un valor seleccionado', () => {
    render(<Select {...defaultProps} value={defaultOptions[0]} dataTestId='select' />)

    expect(screen.getByTestId('select-value')).toHaveTextContent('Option 1')
  })

  it('renderiza con una etiqueta', () => {
    render(<Select {...defaultProps} label="Select Label" />)

    expect(screen.getByText('Select Label')).toBeInTheDocument()
  })

  it('llama a onChange cuando se selecciona una opción', () => {
    const onChange = jest.fn()
    render(<Select {...defaultProps} onChange={onChange} dataTestId='select' />)

    const selectRoot = screen.getByTestId('select-trigger')
    fireEvent.click(selectRoot)

    const option = screen.getByText('Option 1')
    fireEvent.click(option)

    expect(onChange).toHaveBeenCalledWith(defaultOptions[0])
  })

  it('renderiza en modo oscuro', () => {
    render(<Select {...defaultProps} dark dataTestId='label' />)

    const label = screen.getByTestId('label')
    expect(label.parentElement).toHaveClass('relative undefined')

    const trigger = screen.getByTestId('label-trigger')
    expect(trigger).toHaveClass('bg-[#111317]')
    expect(trigger).toHaveClass('text-white')
  })

  it('renderiza deshabilitado', () => {
    render(<Select {...defaultProps} disabled dataTestId='select' />)

    const selectRoot = screen.getByTestId('select-trigger')
    expect(selectRoot).toHaveAttribute('data-disabled', 'true')
  })

}) 