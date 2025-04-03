import { render, screen, fireEvent } from '@testing-library/react'
import { Textarea } from '../Textarea'

describe('Textarea', () => {
  it('renderiza correctamente con las propiedades básicas', () => {
    render(<Textarea placeholder="Test placeholder" />)

    const textarea = screen.getByRole('textbox')
    expect(textarea).toBeInTheDocument()
    expect(textarea).toHaveAttribute('placeholder', 'Test placeholder')
    expect(textarea).toHaveClass('min-h-[80px]')
  })

  it('aplica clases personalizadas', () => {
    render(<Textarea className="custom-class" />)

    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveClass('custom-class')
    expect(textarea).toHaveClass('min-h-[80px]')
  })

  it('maneja el cambio de valor correctamente', () => {
    const handleChange = jest.fn()
    render(<Textarea onChange={handleChange} />)

    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'Test value' } })

    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(handleChange).toHaveBeenCalledWith(expect.any(Object))
  })

  it('aplica el ID correctamente', () => {
    render(<Textarea id="test-id" />)

    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('id', 'test-id')
  })

  it('aplica el testId correctamente', () => {
    render(<Textarea testId="test-data-id" />)

    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('data-testid', 'test-data-id')
  })

  it('mantiene el valor proporcionado', () => {
    render(<Textarea value="Test value" />)

    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveValue('Test value')
  })

  it('se deshabilita correctamente', () => {
    render(<Textarea disabled />)

    const textarea = screen.getByRole('textbox')
    expect(textarea).toBeDisabled()
    expect(textarea).toHaveClass('disabled:cursor-not-allowed')
    expect(textarea).toHaveClass('disabled:opacity-50')
  })

  it('aplica los estilos por defecto', () => {
    render(<Textarea />)

    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveClass('rounded-md')
    expect(textarea).toHaveClass('border')
    expect(textarea).toHaveClass('px-3')
    expect(textarea).toHaveClass('py-2')
  })
}) 