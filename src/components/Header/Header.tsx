// React
import { useState, useRef, useEffect } from 'react';

// Recoil
import { useRecoilValue } from 'recoil';
import { darkModeAtom } from '@/atoms/index';

// Librerías externas
import { toast } from 'react-toastify';

// Componentes
import Input from '@/components/Input';
import { CardProductProps } from '@/components/Cards/CardProduct';
import Button from '../Button';
import { Textarea } from '../Textarea';
import ModalLayout from '../Modal';
import { Select } from '../Select';

// Tipos
import { LabelValue } from '@/types/common';

// Iconos o SVGs
import { MdClose as CloseIcon } from '@react-icons/all-files/md/MdClose';
import { MdFileUpload as Upload } from '@react-icons/all-files/md/MdFileUpload';
import { MdImage as ImageIcon } from '@react-icons/all-files/md/MdImage';

/**
 * Encabezado principal de la aplicación.
 *
 * Props:
 * - `filters`: Filtros aplicados actualmente.
 * - `onFiltersChange`: Callback para manejar cambios en los filtros.
 * - `onNewClick`: Callback para abrir el modal de creación de un nuevo producto.
 */

const STATUS_OPTIONS = [
  { label: 'Todos', value: 'all' },
  { label: 'Activo', value: 'active' },
  { label: 'Inactivo', value: 'inactive' },
];

const SORT_OPTIONS = [
  { label: 'Más recientes', value: 'recents' },
  { label: 'Más antiguos', value: 'oldest' },
  { label: 'Nombre', value: 'name' },
];

export function AppHeader({ filters, onFiltersChange, onNewClick }: AppHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const dark = useRecoilValue(darkModeAtom);

  // Format the pathname to create a readable title
  const formatPathname = (path: string) => {
    if (path === '/') return 'Inicio';

    // Remove leading slash and split by slashes
    const segments = path.slice(1).split('/');

    // Capitalize each segment and join with " / "
    return segments
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(' / ');
  };

  const pageTitle = formatPathname(location.pathname);

  const handleStatusChange = (value: LabelValue) => {
    console.log(value);

    onFiltersChange({ ...filters, status: value });
  };

  const handleSortChange = (value: LabelValue) => {
    onFiltersChange({ ...filters, sort: value });
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onFiltersChange({ ...filters, search: value });
  };

  return (
    <header
      className={`sticky top-0 z-10 border-b h-[80px] ${dark ? 'bg-[#0c0c0c] text-white' : 'bg-white'}`}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-5">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">{pageTitle}</h1>
        </div>

        {location.pathname === '/home' && (
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex gap-2">
              <Select<LabelValue>
                dark={dark}
                value={filters.status}
                onChange={handleStatusChange}
                options={STATUS_OPTIONS}
                extractLabel={(option) => option.label}
                extractValue={(option) => option.value}
              />

              <Select<LabelValue>
                dark={dark}
                value={filters.sort}
                onChange={(value: LabelValue) => handleSortChange(value)}
                options={SORT_OPTIONS}
                extractLabel={(option) => option.label}
                extractValue={(option) => option.value}
              />
            </div>

            <div>
              <Input
                type="search"
                placeholder="Buscar..."
                className="w-full"
                dark={dark}
                testId="search-input"
                value={searchQuery}
                onChange={(value) => handleSearchChange(value)}
              />
            </div>

            <Button testId="new-button" variant="primary" type="button" onClick={onNewClick}>
              Nuevo
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
