import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { EditItemModal } from '../EditItemModal'
import { RecoilRoot } from 'recoil'

const mockCard = {
  id: 1,
  title: 'Producto de prueba',
  description: 'Descripción del producto',
  status: 'active' as const,
  price: '100',
  createdAt: new Date(),
  quantity: 5,
  image: 'test-image.jpg'
}

describe('EditItemModal', () => {
  const renderWithRecoil = (component: React.ReactNode) => {
    return render(
      <RecoilRoot>
        {component}
      </RecoilRoot>
    )
  }

  const defaultProps = {
    open: true,
    onOpenChange: jest.fn(),
    card: mockCard,
    onSave: jest.fn(),
    onDelete: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza correctamente con los datos del producto', () => {
    renderWithRecoil(<EditItemModal {...defaultProps} />)

    expect(screen.getByTestId('title-input')).toHaveValue('Producto de prueba')
    expect(screen.getByTestId('description-input')).toHaveValue('Descripción del producto')
    expect(screen.getByTestId('price-input')).toHaveValue('100')
    expect(screen.getByTestId('quantity-input')).toHaveValue('5')
  })

  it('llama a onSave con los datos actualizados al guardar', async () => {
    renderWithRecoil(<EditItemModal {...defaultProps} />)

    fireEvent.change(screen.getByTestId('title-input'), { target: { value: 'Nuevo título' } })
    fireEvent.change(screen.getByTestId('description-input'), { target: { value: 'Nueva descripción' } })
    fireEvent.change(screen.getByTestId('price-input'), { target: { value: '200' } })
    fireEvent.change(screen.getByTestId('quantity-input'), { target: { value: '10' } })

    fireEvent.click(screen.getByTestId('save-button'))

    await waitFor(() => {
      expect(defaultProps.onSave).toHaveBeenCalledWith({
        ...mockCard,
        title: 'Nuevo título',
        description: 'Nueva descripción',
        price: '200',
        quantity: 10
      })
    })
  })

  it('llama a onDelete cuando se hace clic en el botón eliminar', async () => {
    const confirmSpy = jest.spyOn(window, 'confirm').mockImplementation(() => true)
    renderWithRecoil(<EditItemModal {...defaultProps} />)

    fireEvent.click(screen.getByTestId('delete-button'))

    await waitFor(() => {
      expect(defaultProps.onDelete).toHaveBeenCalledWith(mockCard.id)
      expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false)
    })

    confirmSpy.mockRestore()
  })

  it('no llama a onDelete cuando se cancela la confirmación', async () => {
    const confirmSpy = jest.spyOn(window, 'confirm').mockImplementation(() => false)
    renderWithRecoil(<EditItemModal {...defaultProps} />)

    fireEvent.click(screen.getByTestId('delete-button'))

    await waitFor(() => {
      expect(defaultProps.onDelete).not.toHaveBeenCalled()
      expect(defaultProps.onOpenChange).not.toHaveBeenCalled()
    })

    confirmSpy.mockRestore()
  })
})