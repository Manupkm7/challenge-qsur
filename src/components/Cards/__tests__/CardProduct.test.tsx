import { render, screen, fireEvent } from '@testing-library/react';
import { CardProduct } from '../CardProduct';
import { RecoilRoot } from 'recoil';

const mockCard = {
  id: 1,
  title: 'Producto de prueba',
  description: 'Descripción del producto',
  status: 'active' as const,
  price: '100',
  createdAt: new Date(),
  quantity: 5,
  viewMode: 'grid' as const,
};

describe('CardProduct', () => {
  const renderWithRecoil = (component: React.ReactNode) => {
    return render(<RecoilRoot>{component}</RecoilRoot>);
  };

  it('renderiza correctamente en modo grid', () => {
    renderWithRecoil(
      <CardProduct {...mockCard} onCardClick={() => {}} onStatusChange={() => {}} />
    );
    expect(screen.getByTestId('title')).toHaveTextContent('Producto de prueba');
    expect(screen.getByTestId('description')).toHaveTextContent('Descripción del producto');
    expect(screen.getByTestId('price')).toHaveTextContent('100,00 ARS');
    expect(screen.getByTestId('stock-quantity')).toHaveTextContent('Stock: 5');
    expect(screen.getByTestId('status')).toHaveTextContent('Activo');
    expect(screen.getByTestId('file-input')).toBeInTheDocument();
    expect(screen.getByTestId('image-upload-area')).toBeInTheDocument();
  });

  it('renderiza correctamente en modo lista', () => {
    renderWithRecoil(
      <CardProduct {...mockCard} viewMode="list" onCardClick={() => {}} onStatusChange={() => {}} />
    );

    expect(screen.getByTestId('title')).toHaveTextContent('Producto de prueba');
    expect(screen.getByTestId('description')).toHaveTextContent('Descripción del producto');
    expect(screen.getByTestId('price')).toHaveTextContent('100,00 ARS');
    expect(screen.getByTestId('stock-quantity')).toHaveTextContent('Stock: 5');
    expect(screen.getByTestId('status')).toHaveTextContent('Activo');
  });

  it('llama a onCardClick cuando se hace clic en la tarjeta', () => {
    const handleCardClick = jest.fn();
    renderWithRecoil(
      <CardProduct {...mockCard} onCardClick={handleCardClick} onStatusChange={() => {}} />
    );

    fireEvent.click(screen.getByTestId('title').closest('div')!);
    expect(handleCardClick).toHaveBeenCalled();
  });

  it('llama a onStatusChange cuando se hace clic en el botón de vender', () => {
    const handleStatusChange = jest.fn();
    renderWithRecoil(
      <CardProduct {...mockCard} onCardClick={() => {}} onStatusChange={handleStatusChange} />
    );

    fireEvent.click(screen.getByTestId('sell-button'));
    expect(handleStatusChange).toHaveBeenCalledWith(mockCard.id);
  });

  it('no muestra el botón de vender cuando el producto está inactivo', () => {
    renderWithRecoil(
      <CardProduct
        {...mockCard}
        status="inactive"
        onCardClick={() => {}}
        onStatusChange={() => {}}
      />
    );

    expect(screen.queryByTestId('sell-button')).not.toBeInTheDocument();
  });
});
