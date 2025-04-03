import { render, screen } from '@testing-library/react';
import { Badge } from '../Badge';

describe('Badge', () => {
  it('renderiza correctamente con la variante por defecto', () => {
    render(<Badge variant="default">Test Badge</Badge>);

    const badge = screen.getByText('Test Badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-green-500');
    expect(badge).toHaveClass('text-white');
  });

  it('renderiza correctamente con la variante secondary', () => {
    render(<Badge variant="secondary">Test Badge</Badge>);

    const badge = screen.getByText('Test Badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-yelow-500');
    expect(badge).toHaveClass('text-black');
  });

  it('renderiza correctamente con la variante destructive', () => {
    render(<Badge variant="destructive">Test Badge</Badge>);

    const badge = screen.getByText('Test Badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-destructive');
    expect(badge).toHaveClass('text-destructive-foreground');
  });

  it('renderiza correctamente con la variante outline', () => {
    render(<Badge variant="outline">Test Badge</Badge>);

    const badge = screen.getByText('Test Badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('text-foreground');
  });

  it('aplica clases personalizadas correctamente', () => {
    render(
      <Badge variant="default" className="custom-class">
        Test Badge
      </Badge>
    );

    const badge = screen.getByText('Test Badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('custom-class');
  });

  it('pasa correctamente los atributos HTML adicionales', () => {
    render(
      <Badge variant="default" data-testid="test-badge" aria-label="Test Badge">
        Test Badge
      </Badge>
    );

    const badge = screen.getByTestId('test-badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute('aria-label', 'Test Badge');
  });
});
