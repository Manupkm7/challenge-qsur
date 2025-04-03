import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EditItemModal } from '../EditItemModal';
import { RecoilRoot } from 'recoil';
import { toast } from 'react-toastify';

// Mock de react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

const mockCard = {
  id: 1,
  title: 'Producto de prueba',
  description: 'Descripción del producto de prueba que es lo suficientemente larga',
  status: 'active' as const,
  price: '100',
  createdAt: new Date(),
  quantity: 5,
  image: 'test-image.jpg',
};

describe('EditItemModal', () => {
  const renderWithRecoil = (component: React.ReactNode) => {
    return render(<RecoilRoot>{component}</RecoilRoot>);
  };

  const defaultProps = {
    open: true,
    onOpenChange: jest.fn(),
    card: mockCard,
    onSave: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderizado inicial', () => {
    it('renderiza correctamente con los datos del producto', () => {
      renderWithRecoil(<EditItemModal {...defaultProps} />);

      expect(screen.getByTestId('title-input')).toHaveValue('Producto de prueba');
      expect(screen.getByTestId('description-input')).toHaveValue(
        'Descripción del producto de prueba que es lo suficientemente larga'
      );
      expect(screen.getByTestId('price-input')).toHaveValue('100');
      expect(screen.getByTestId('quantity-input')).toHaveValue('5');
    });
  });

  describe('Validación de formulario', () => {
    it('muestra error cuando el título tiene menos de 3 caracteres', async () => {
      renderWithRecoil(<EditItemModal {...defaultProps} />);

      fireEvent.change(screen.getByTestId('title-input'), { target: { value: 'ab' } });
      fireEvent.click(screen.getByTestId('save-button'));

      expect(screen.getByTestId('error-title')).toBeInTheDocument();
      expect(defaultProps.onSave).not.toHaveBeenCalled();
    });

    it('muestra error cuando el precio es inválido', async () => {
      renderWithRecoil(<EditItemModal {...defaultProps} />);

      fireEvent.change(screen.getByTestId('price-input'), { target: { value: '0' } });
      fireEvent.click(screen.getByTestId('save-button'));

      expect(screen.getByTestId('error-price')).toBeInTheDocument();
      expect(defaultProps.onSave).not.toHaveBeenCalled();
    });

    it('muestra error cuando la descripción es muy corta', async () => {
      renderWithRecoil(<EditItemModal {...defaultProps} />);

      fireEvent.change(screen.getByTestId('description-input'), { target: { value: 'Corta' } });
      fireEvent.click(screen.getByTestId('save-button'));

      expect(screen.getByTestId('error-description')).toBeInTheDocument();
      expect(defaultProps.onSave).not.toHaveBeenCalled();
    });

    it('muestra error cuando no hay imagen', async () => {
      renderWithRecoil(<EditItemModal {...defaultProps} />);

      // Remover la imagen existente
      fireEvent.click(screen.getByTestId('remove-image-button'));
      fireEvent.click(screen.getByTestId('save-button'));

      expect(screen.getByTestId('error-image')).toBeInTheDocument();
      expect(defaultProps.onSave).not.toHaveBeenCalled();
    });
  });

  describe('Manejo de imágenes', () => {
    it('muestra mensaje de error al intentar subir un archivo que no es imagen', async () => {
      renderWithRecoil(<EditItemModal {...defaultProps} />);

      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const fileInput = screen.getByTestId('file-input');

      fireEvent.change(fileInput, { target: { files: [file] } });

      expect(toast.error).toHaveBeenCalledWith('Por favor, selecciona una imagen válida');
      expect(screen.getByTestId('error-image')).toHaveTextContent(
        'Por favor, selecciona una imagen válida'
      );
    });

    it('muestra mensaje de error al intentar subir una imagen mayor a 5MB', async () => {
      renderWithRecoil(<EditItemModal {...defaultProps} />);

      const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', {
        type: 'image/jpeg',
      });
      const fileInput = screen.getByTestId('file-input');

      fireEvent.change(fileInput, { target: { files: [largeFile] } });

      expect(toast.error).toHaveBeenCalledWith(
        'La imagen es demasiado grande. El tamaño máximo es 5MB.'
      );
      expect(screen.getByTestId('error-image')).toHaveTextContent(
        'La imagen es demasiado grande. El tamaño máximo es 5MB.'
      );
    });

    it('permite remover la imagen', async () => {
      renderWithRecoil(<EditItemModal {...defaultProps} />);

      fireEvent.click(screen.getByTestId('remove-image-button'));

      expect(screen.getByTestId('error-image')).toHaveTextContent('La imagen es requerida');
    });
  });

  describe('Manejo de estado y loading', () => {
    it('no renderiza nada cuando no hay card', () => {
      renderWithRecoil(<EditItemModal {...defaultProps} card={null} />);
      expect(screen.queryByTestId('title-input')).not.toBeInTheDocument();
    });
  });

  describe('Manejo de cambios en campos', () => {
    it('limpia el error del título cuando se corrige', async () => {
      renderWithRecoil(<EditItemModal {...defaultProps} />);

      fireEvent.change(screen.getByTestId('title-input'), { target: { value: 'ab' } });
      fireEvent.click(screen.getByTestId('save-button'));
      expect(screen.getByTestId('error-title')).toBeInTheDocument();

      fireEvent.change(screen.getByTestId('title-input'), { target: { value: 'abc' } });
      expect(screen.queryByTestId('error-title')).not.toBeInTheDocument();
    });

    it('limpia el error del precio cuando se corrige', async () => {
      renderWithRecoil(<EditItemModal {...defaultProps} />);

      fireEvent.change(screen.getByTestId('price-input'), { target: { value: '0' } });
      fireEvent.click(screen.getByTestId('save-button'));
      expect(screen.getByTestId('error-price')).toBeInTheDocument();

      fireEvent.change(screen.getByTestId('price-input'), { target: { value: '100' } });
      expect(screen.queryByTestId('error-price')).not.toBeInTheDocument();
    });
  });

  describe('Manejo de acciones', () => {
    it('llama a onSave con los datos actualizados al guardar', async () => {
      renderWithRecoil(<EditItemModal {...defaultProps} />);

      fireEvent.change(screen.getByTestId('title-input'), { target: { value: 'Nuevo título' } });
      fireEvent.change(screen.getByTestId('description-input'), {
        target: { value: 'Nueva descripción larga para el producto' },
      });
      fireEvent.change(screen.getByTestId('price-input'), { target: { value: '200' } });
      fireEvent.change(screen.getByTestId('quantity-input'), { target: { value: '10' } });

      fireEvent.click(screen.getByTestId('save-button'));

      await waitFor(() => {
        expect(defaultProps.onSave).toHaveBeenCalledWith({
          ...mockCard,
          title: 'Nuevo título',
          description: 'Nueva descripción larga para el producto',
          price: '200',
          quantity: 10,
        });
        expect(toast.success).toHaveBeenCalledWith('Tarjeta actualizada correctamente');
      });
    });

    it('llama a onDelete cuando se hace clic en el botón eliminar', async () => {
      const confirmSpy = jest.spyOn(window, 'confirm').mockImplementation(() => true);
      renderWithRecoil(<EditItemModal {...defaultProps} />);

      fireEvent.click(screen.getByTestId('delete-button'));

      await waitFor(() => {
        expect(defaultProps.onDelete).toHaveBeenCalledWith(mockCard.id);
        expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false);
      });

      confirmSpy.mockRestore();
    });

    it('no llama a onDelete cuando se cancela la confirmación', async () => {
      const confirmSpy = jest.spyOn(window, 'confirm').mockImplementation(() => false);
      renderWithRecoil(<EditItemModal {...defaultProps} />);

      fireEvent.click(screen.getByTestId('delete-button'));

      await waitFor(() => {
        expect(defaultProps.onDelete).not.toHaveBeenCalled();
        expect(defaultProps.onOpenChange).not.toHaveBeenCalled();
      });

      confirmSpy.mockRestore();
    });
  });
});
