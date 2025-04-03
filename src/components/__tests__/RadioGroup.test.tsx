import { render, screen, fireEvent } from '@testing-library/react'
import {  RadixRadioGroup } from '../RadioGroup'

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

    const option2 = screen.getByText('Option 2').closest('label')
    fireEvent.click(option2!)

    expect(defaultProps.onChange).toHaveBeenCalledWith('option2')
  })

  it('no permite seleccionar opciones deshabilitadas', () => {
    render(<RadixRadioGroup {...defaultProps} />)

    const disabledOption = screen.getByText('Option 3').closest('label')
    fireEvent.click(disabledOption!)

    expect(defaultProps.onChange).not.toHaveBeenCalled()
  })

  it('aplica la orientación horizontal por defecto', () => {
    render(<RadixRadioGroup {...defaultProps} />)

    const radioGroup = screen.getByTestId('radio-group-root')
    expect(radioGroup).toHaveAttribute('data-orientation', 'horizontal')
  })
}) 