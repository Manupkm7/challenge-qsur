import { screen, fireEvent, waitFor } from '@testing-library/react'
import { NewCardModal } from '../NewItem'
import { toast } from 'react-toastify'
import { renderWithRecoil } from '@/utils/test-utils'

// Mock de react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn()
  }
}))

describe('NewCardModal', () => {

  const defaultProps = {
    open: true,
    onOpenChange: jest.fn(),
    onSave: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Renderizado inicial', () => {
    it('renderiza correctamente con los campos vacíos', () => {
      renderWithRecoil(<NewCardModal {...defaultProps} />)

      expect(screen.getByTestId('title-input')).toHaveValue('')
      expect(screen.getByTestId('description-input')).toHaveValue('')
      expect(screen.getByTestId('price-input')).toHaveValue('')
      expect(screen.getByTestId('quantity-input')).toHaveValue('1')
      expect(screen.getByTestId('file-input')).toBeInTheDocument()
    })

    it('muestra el modal con el título correcto', () => {
      renderWithRecoil(<NewCardModal {...defaultProps} />)
      expect(screen.getByText('Crear nueva tarjeta')).toBeInTheDocument()
    })

    it('muestra el texto descriptivo del formulario', () => {
      renderWithRecoil(<NewCardModal {...defaultProps} />)
      expect(screen.getByText('Completa los campos para crear una nueva tarjeta.')).toBeInTheDocument()
    })
  })

  describe('Validación de formulario', () => {
    it('muestra error cuando el título tiene menos de 3 caracteres', async () => {
      renderWithRecoil(<NewCardModal {...defaultProps} />)

      fireEvent.change(screen.getByTestId('title-input'), { target: { value: 'ab' } })
      fireEvent.click(screen.getByTestId('save-button'))

      expect(screen.getByTestId('error-title')).toBeInTheDocument()
      expect(defaultProps.onSave).not.toHaveBeenCalled()
    })

    it('muestra error cuando el precio es inválido', async () => {
      renderWithRecoil(<NewCardModal {...defaultProps} />)

      fireEvent.change(screen.getByTestId('title-input'), { target: { value: 'Nuevo producto' } })
      fireEvent.change(screen.getByTestId('price-input'), { target: { value: '0' } })
      fireEvent.click(screen.getByTestId('save-button'))

      expect(screen.getByTestId('error-price')).toBeInTheDocument()
      expect(defaultProps.onSave).not.toHaveBeenCalled()
    })


    it('muestra error cuando no se ha subido una imagen', async () => {
      renderWithRecoil(<NewCardModal {...defaultProps} />)

      fireEvent.change(screen.getByTestId('title-input'), { target: { value: 'Nuevo producto' } })
      fireEvent.change(screen.getByTestId('description-input'), { target: { value: 'Esta es una descripción larga para el producto' } })
      fireEvent.change(screen.getByTestId('price-input'), { target: { value: '100' } })
      fireEvent.change(screen.getByTestId('quantity-input'), { target: { value: '5' } })
      fireEvent.click(screen.getByTestId('save-button'))

      expect(defaultProps.onSave).not.toHaveBeenCalled()
    })

    it('permite guardar cuando todos los campos requeridos están completos y válidos', async () => {
      renderWithRecoil(<NewCardModal {...defaultProps} />)

      // Crear un archivo de imagen válido para la prueba
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const fileInput = screen.getByTestId('file-input')
      
      // Simular la carga de la imagen
      const mockImageData = 'data:image/jpeg;base64,test'
      const mockFileReader = {
        readAsDataURL: jest.fn(),
        onload: null as any,
        result: mockImageData
      }
      
      // Mock de FileReader
      global.FileReader = jest.fn(() => mockFileReader) as any
      
      fireEvent.change(fileInput, { target: { files: [file] } })
      
      // Simular que la imagen se cargó correctamente
      mockFileReader.onload({ target: { result: mockImageData } } as any)

      fireEvent.change(screen.getByTestId('title-input'), { target: { value: 'Nuevo producto' } })
      fireEvent.change(screen.getByTestId('description-input'), { target: { value: 'Esta es una descripción larga para el producto' } })
      fireEvent.change(screen.getByTestId('price-input'), { target: { value: '100' } })
      fireEvent.change(screen.getByTestId('quantity-input'), { target: { value: '5' } })

      fireEvent.click(screen.getByTestId('save-button'))

      await waitFor(() => {
        expect(defaultProps.onSave).toHaveBeenCalledWith({
          title: 'Nuevo producto',
          description: 'Esta es una descripción larga para el producto',
          status: 'active',
          price: '100',
          quantity: 5,
          image: mockImageData
        })
        expect(toast.success).toHaveBeenCalledWith('Tarjeta creada correctamente')
      })
    })
  })


  describe('Manejo de imágenes', () => {
    it('muestra el área de carga de imagen cuando no hay imagen', () => {
      renderWithRecoil(<NewCardModal {...defaultProps} />)
      expect(screen.getByText('Subir imagen')).toBeInTheDocument()
    })

    it('muestra mensaje de error al intentar subir un archivo que no es imagen', async () => {
      renderWithRecoil(<NewCardModal {...defaultProps} />)

      const file = new File(['test'], 'test.txt', { type: 'text/plain' })
      const fileInput = screen.getByTestId('file-input')

      fireEvent.change(fileInput, { target: { files: [file] } })

      expect(toast.error).toHaveBeenCalledWith('Por favor, selecciona una imagen válida')
    })

    it('muestra mensaje de error al intentar subir una imagen mayor a 5MB', async () => {
      renderWithRecoil(<NewCardModal {...defaultProps} />)

      const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' })
      const fileInput = screen.getByTestId('file-input')

      fireEvent.change(fileInput, { target: { files: [largeFile] } })

      expect(toast.error).toHaveBeenCalledWith('La imagen es demasiado grande. El tamaño máximo es 5MB.')
    })
  })

  describe('Manejo del estado del modal', () => {
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
}) 