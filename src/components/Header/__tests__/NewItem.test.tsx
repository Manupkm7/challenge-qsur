import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { NewCardModal } from '../NewItem'
import { TestWrapper } from '@/utils/test-utils'

describe('NewCardModal', () => {
  const renderWithRecoil = (component: React.ReactNode) => {
    return render(
      <TestWrapper>
        {component}
      </TestWrapper>
    )
  }

  const defaultProps = {
    open: true,
    onOpenChange: jest.fn(),
    onSave: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza correctamente con los campos vacíos', () => {
    renderWithRecoil(<NewCardModal {...defaultProps} />)

    expect(screen.getByTestId('title-input')).toHaveValue('')
    expect(screen.getByTestId('description-input')).toHaveValue('')
    expect(screen.getByTestId('price-input')).toHaveValue('')
    expect(screen.getByTestId('quantity-input')).toHaveValue('1')
  })

  it('llama a onSave con los datos ingresados al guardar', async () => {
    renderWithRecoil(<NewCardModal {...defaultProps} />)

    fireEvent.change(screen.getByTestId('title-input'), { target: { value: 'Nuevo producto' } })
    fireEvent.change(screen.getByTestId('description-input'), { target: { value: 'Nueva descripción' } })
    fireEvent.change(screen.getByTestId('price-input'), { target: { value: '100' } })
    fireEvent.change(screen.getByTestId('quantity-input'), { target: { value: '5' } })

    fireEvent.click(screen.getByTestId('save-button'))

    await waitFor(() => {
      expect(defaultProps.onSave).toHaveBeenCalledWith({
        title: 'Nuevo producto',
        description: 'Nueva descripción',
        status: 'active',
        price: '100',
        quantity: 5
      })
    })
  })

  it('solo permite números y punto decimal en el campo de precio', () => {
    renderWithRecoil(<NewCardModal {...defaultProps} />)

    const priceInput = screen.getByTestId('price-input')
    fireEvent.change(priceInput, { target: { value: 'abc123.45' } })
    expect(priceInput).toHaveValue('123.45')
  })

  it('solo permite números enteros en el campo de cantidad', () => {
    renderWithRecoil(<NewCardModal {...defaultProps} />)

    const quantityInput = screen.getByTestId('quantity-input')
    fireEvent.change(quantityInput, { target: { value: 'abc123' } })
    expect(quantityInput).toHaveValue('123')
  })

  it('resetea el formulario al cerrar', async () => {
    renderWithRecoil(<NewCardModal {...defaultProps} />)

    fireEvent.change(screen.getByTestId('title-input'), { target: { value: 'Test' } })
    await fireEvent.click(screen.getByTestId('cancel-button'))

    expect(screen.getByTestId('title-input')).toHaveValue('')
    expect(screen.getByTestId('description-input')).toHaveValue('')
    expect(screen.getByTestId('price-input')).toHaveValue('')
    expect(screen.getByTestId('quantity-input')).toHaveValue('1')
    expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false)
  })
}) 