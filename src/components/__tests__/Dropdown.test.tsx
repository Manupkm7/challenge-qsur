import { render, screen, fireEvent } from '@testing-library/react';
import Dropdown from '../Dropdown';

describe('Dropdown', () => {
  const mockItems = [
    { content: 'Item 1', onClick: jest.fn() },
    { content: 'Item 2', onClick: jest.fn() },
  ];
  const mockButton = <button>Click me</button>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza el botón correctamente', () => {
    render(<Dropdown items={mockItems} button={mockButton} />);

    const trigger = screen.getByTestId('dropdown-trigger');
    expect(trigger).toContainElement(screen.getByText('Click me'));
  });

  it('renderiza los items con su contenido y maneja los clicks', () => {
    render(<Dropdown items={mockItems} button={mockButton} open={true} />);

    const items = screen.getAllByTestId('dropdown-item');
    expect(items[0]).toHaveTextContent('Item 1');
    expect(items[1]).toHaveTextContent('Item 2');

    fireEvent.click(items[0]);
    expect(mockItems[0].onClick).toHaveBeenCalled();
  });

  it('aplica el align correcto al contenido', () => {
    render(<Dropdown items={mockItems} button={mockButton} align="end" open={true} />);

    const content = screen.getByTestId('dropdown-content');
    expect(content).toHaveAttribute('data-align', 'end');
  });

  it('maneja el estado open correctamente', () => {
    const { rerender } = render(<Dropdown items={mockItems} button={mockButton} open={true} />);

    const root = screen.getByTestId('dropdown-trigger');
    expect(root).toHaveAttribute('data-state', 'open');

    rerender(<Dropdown items={mockItems} button={mockButton} open={false} />);
    expect(root).toHaveAttribute('data-state', 'closed');
  });

  it('maneja correctamente el caso sin items', () => {
    render(<Dropdown items={[]} button={mockButton} open={true} />);

    expect(screen.queryByTestId('dropdown-item')).not.toBeInTheDocument();
  });
});
