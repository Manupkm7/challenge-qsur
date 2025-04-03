import { render, screen } from '@testing-library/react';
import { Divider } from '../Divider';

describe('Divider', () => {
  it('renderiza correctamente con las clases por defecto', () => {
    render(<Divider />);

    const divider = screen.getByTestId('divider');
    expect(divider).toBeInTheDocument();
    expect(divider).toHaveClass('w-full');
    expect(divider).toHaveClass('border-t');
    expect(divider).toHaveClass('border-gray-300');
    expect(divider).toHaveClass('my-2.5');
  });

  it('aplica clases personalizadas correctamente', () => {
    render(<Divider className="custom-class" />);

    const divider = screen.getByTestId('divider');
    expect(divider).toBeInTheDocument();
    expect(divider).toHaveClass('custom-class');
  });

  it('mantiene las clases por defecto junto con las personalizadas', () => {
    render(<Divider className="custom-class" />);

    const divider = screen.getByTestId('divider');
    expect(divider).toBeInTheDocument();
    expect(divider).toHaveClass('w-full');
    expect(divider).toHaveClass('border-t');
    expect(divider).toHaveClass('border-gray-300');
    expect(divider).toHaveClass('my-2.5');
    expect(divider).toHaveClass('custom-class');
  });
});
