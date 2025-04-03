import { render, screen } from '@testing-library/react';
import { NotFoundLogoSvg } from '../NotFound';

describe('NotFoundLogoSvg', () => {
  it('renderiza correctamente el SVG', () => {
    render(<NotFoundLogoSvg />);

    const svg = screen.getByTestId('not-found-logo');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '418');
    expect(svg).toHaveAttribute('height', '247');
    expect(svg).toHaveAttribute('viewBox', '0 0 418 247');
    expect(svg).toHaveAttribute('fill', 'none');
    expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
  });

  it('renderiza todos los elementos path del logo', () => {
    render(<NotFoundLogoSvg />);

    const svg = screen.getByTestId('not-found-logo');
    const paths = svg.querySelectorAll('path');

    expect(paths.length).toBe(19); // Verificar que hay 15 paths en el SVG
  });
});
