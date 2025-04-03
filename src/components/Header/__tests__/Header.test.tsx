import { render, screen, fireEvent } from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { AppHeader } from '../Header';

const mockFilters = {
  status: { label: 'Todos', value: 'all' },
  sort: { label: 'Más recientes', value: 'recents' },
  search: '',
};

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      <RecoilRoot>{component}</RecoilRoot>
    </BrowserRouter>
  );
};

// Mock useLocation
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

describe('AppHeader', () => {
  const mockOnNewClick = jest.fn();
  const mockOnFiltersChange = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    // Configurar useLocation para simular la ruta /home por defecto
    jest.mocked(useLocation).mockReturnValue({
      pathname: '/home',
      state: undefined,
      key: '',
      search: '',
      hash: '',
    });
  });

  it('renderiza el título correctamente en la página de inicio', () => {
    (useLocation as jest.Mock).mockReturnValue({
      pathname: '/',
    });

    renderWithProviders(
      <AppHeader
        filters={mockFilters}
        onNewClick={mockOnNewClick}
        onFiltersChange={mockOnFiltersChange}
      />
    );
    expect(screen.getByText('Inicio')).toBeInTheDocument();
  });

  it('renderiza los filtros en la página /home', () => {
    renderWithProviders(
      <AppHeader
        filters={mockFilters}
        onNewClick={mockOnNewClick}
        onFiltersChange={mockOnFiltersChange}
      />
    );

    // Verificar que los selects están presentes
    const selects = screen.getAllByRole('combobox');
    expect(selects).toHaveLength(2);

    // Verificar que el input de búsqueda está presente
    expect(screen.getByPlaceholderText('Buscar...')).toBeInTheDocument();

    // Verificar que el botón Nuevo está presente
    expect(screen.getByText('Nuevo')).toBeInTheDocument();
  });

  it('no renderiza los filtros en otras páginas', () => {
    (useLocation as jest.Mock).mockReturnValue({
      pathname: '/settings',
    });

    renderWithProviders(
      <AppHeader
        filters={mockFilters}
        onNewClick={mockOnNewClick}
        onFiltersChange={mockOnFiltersChange}
      />
    );

    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Buscar...')).not.toBeInTheDocument();
    expect(screen.queryByText('Nuevo')).not.toBeInTheDocument();
  });

  it('llama a onNewClick cuando se hace clic en el botón Nuevo', () => {
    renderWithProviders(
      <AppHeader
        filters={mockFilters}
        onNewClick={mockOnNewClick}
        onFiltersChange={mockOnFiltersChange}
      />
    );

    const newButton = screen.getByText('Nuevo');
    fireEvent.click(newButton);

    expect(mockOnNewClick).toHaveBeenCalled();
  });
});
