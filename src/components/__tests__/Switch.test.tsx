import { render, screen, fireEvent } from '@testing-library/react';
import { Switch } from '../Switch';

describe('Switch', () => {
  const defaultProps = {
    value: false,
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza correctamente con las propiedades básicas', () => {
    render(<Switch {...defaultProps} />);

    expect(screen.getByTestId('switch-root')).toBeInTheDocument();
    expect(screen.getByTestId('switch-thumb')).toBeInTheDocument();
  });

  it('renderiza con una etiqueta', () => {
    render(<Switch {...defaultProps} label="Switch Label" />);

    expect(screen.getByText('Switch Label')).toBeInTheDocument();
  });

  it('renderiza con el valor correcto', () => {
    render(<Switch {...defaultProps} value={true} />);

    const switchRoot = screen.getByTestId('switch-root');
    expect(switchRoot).toHaveAttribute('data-state', 'checked');
  });

  it('llama a onChange cuando se hace clic', () => {
    render(<Switch {...defaultProps} />);

    const switchRoot = screen.getByTestId('switch-root');
    fireEvent.click(switchRoot);

    expect(defaultProps.onChange).toHaveBeenCalledWith(true);
  });

  it('renderiza deshabilitado', () => {
    render(<Switch {...defaultProps} disabled />);

    const switchRoot = screen.getByTestId('switch-root');
    expect(switchRoot).toHaveAttribute('data-disabled', 'true');
    expect(switchRoot).toHaveClass('disabled:bg-gray-100');
    expect(switchRoot).toHaveClass('disabled:cursor-not-allowed');
  });

  it('aplica el id correcto', () => {
    render(<Switch {...defaultProps} id="switch-id" />);

    const switchRoot = screen.getByTestId('switch-root');
    expect(switchRoot).toHaveAttribute('id', 'switch-id');
  });
});
