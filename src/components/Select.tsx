// React
import { ReactNode, useMemo, useState } from 'react';

// Librerías externas
import { clsx } from 'clsx';
import * as SelectPrimitive from '@radix-ui/react-select';

// Iconos o SVGs
import { MdKeyboardArrowDown as ArrowDownIcon } from '@react-icons/all-files/md/MdKeyboardArrowDown';
import { SearchIcon } from '../assets/SearchIcon';

/**
 * Componente de selección con opciones desplegables.
 *
 * Props:
 * - `options`: Lista de opciones disponibles.
 * - `value`: Valor seleccionado.
 * - `onChange`: Callback para manejar cambios.
 * - `placeholder`: Texto de marcador de posición.
 * - `label`: Etiqueta del campo.
 * - `className`: Clases CSS adicionales.
 * - `activeFilter`: Indica si se debe mostrar un filtro activo.
 * - `disabled`: Indica si el campo está deshabilitado.
 * - `extractLabel`: Función para extraer la etiqueta de una opción.
 * - `extractValue`: Función para extraer el valor de una opción.
 * - `onChangeInput`: Callback para manejar cambios en el campo de entrada.
 * - `position`: Posición del contenido desplegable.
 * - `contentClassName`: Clases CSS adicionales para el contenido.
 * - `classNameOption`: Clases CSS adicionales para las opciones.
 * - `classNameValue`: Clases CSS adicionales para el valor seleccionado.
 * - `dark`: Indica si el tema oscuro está activado.
 * - `dataTestId`: ID para pruebas.
 */

type SelectProps<T> = {
  id?: string;
  name?: string;
  value?: T;
  options: T[];
  placeholder?: ReactNode;
  label?: string;
  className?: string;
  activeFilter?: boolean;
  disabled?: boolean;
  onChange?: (value: T) => void;
  extractLabel?: (option: T) => ReactNode;
  extractValue?: (option: T) => string;
  onChangeInput?: (e: string) => void;
  position?: 'item-aligned' | 'popper';
  contentClassName?: string;
  classNameOption?: string;
  classNameValue?: string;
  dark?: boolean;
  dataTestId?: string;
};

export const Select = <T,>({
  id,
  name,
  value,
  options,
  placeholder,
  label,
  className,
  disabled,
  activeFilter,
  onChange,
  extractLabel = (option) => option as string,
  extractValue = (option) => option as string,
  onChangeInput,
  position = 'popper',
  contentClassName,
  classNameOption,
  classNameValue,
  dark,
  dataTestId,
}: SelectProps<T>) => {
  const [selectedValue, setSelectedValue] = useState<string>('');

  const handleChange = (selectedValue: string): void => {
    onChange?.(options.find((option) => extractValue(option) === selectedValue)!);
  };

  const contentClass = useMemo(
    () => clsx('z-30 w-full bg-white border rounded-lg', contentClassName),
    [contentClassName]
  );

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedValue(e.target.value);
    onChangeInput?.(e.target.value);
  };

  return (
    <div id={id} className={`relative ${className}`}>
      <div
        data-testid={`label`}
        className={clsx(
          dark ? 'bg-[#111317] text-white' : 'bg-[#FFFFFF] text-gray-500',
          'text-[9px] leading-[12px] absolute -top-1 px-1 rounded-lg left-3.5 select-none'
        )}
      >
        {label}
      </div>
      <SelectPrimitive.Root
        data-testid={`${dataTestId}-root`}
        disabled={disabled}
        value={value ? extractValue(value) : ''}
        onValueChange={handleChange}
        name={name}
      >
        <SelectPrimitive.SelectTrigger
          data-disabled={disabled}
          data-testid={`${dataTestId}-trigger`}
          className={clsx(
            'flex items-center justify-between px-4 h-[46px] gap-[5px] focus:border-[#0074B5] rounded-lg w-full outline-none placeholder-shown:text-secondary-gray-2 select-none text-sm truncate',
            dark ? 'bg-[#111317] text-white border' : 'bg-[#FFFFFF] border',
            placeholder && !value ? 'text-[#9ca3af] ' : 'text-black',
            classNameValue
          )}
        >
          <SelectPrimitive.Value data-testid={`${dataTestId}-value`}>
            {value ? extractLabel(value) : placeholder}
          </SelectPrimitive.Value>
          <SelectPrimitive.Icon data-testid={`${dataTestId}-icon`}>
            <ArrowDownIcon color={dark ? 'white' : 'black'} width={9.26} height={4.42} />
          </SelectPrimitive.Icon>
        </SelectPrimitive.SelectTrigger>

        <SelectPrimitive.Portal data-testid={`${dataTestId}-portal`}>
          <SelectPrimitive.Content
            data-testid={`${dataTestId}-content`}
            position={position}
            className={contentClass}
            style={{ width: 'var(--radix-select-trigger-width)' }}
          >
            <SelectPrimitive.Viewport
              data-testid={`${dataTestId}-viewport`}
              className="p-[2.5px]"
              contextMenu="px-[5px]"
            >
              <div className="flex items-center" onKeyDown={(e) => e.stopPropagation()}>
                {activeFilter ? (
                  <div
                    className="flex items-center border-b w-full"
                    onKeyDown={(e) => e.stopPropagation()}
                  >
                    <input
                      type="text"
                      key={id}
                      className="outline-none !border-0 border-x-0 border-t-0 ring-0 !focus-within:border-b !focus:outline-0 !focus:border-b focus:ring-0 w-full"
                      placeholder="Filter"
                      value={selectedValue}
                      onChange={handleChangeInput}
                    />
                    <SearchIcon className="absolute right-2" size="16" />
                  </div>
                ) : null}
              </div>

              {options?.map((option: T) => {
                const optionLabel = extractLabel(option);
                const optionValue = extractValue(option);
                return (
                  <SelectPrimitive.Item
                    data-testid={`${dataTestId}-item`}
                    key={optionValue}
                    value={optionValue}
                    className={clsx(
                      'h-[40px] flex outline-none items-center px-2.5 cursor-pointer select-none text-sm z-50',
                      classNameOption,
                      dark
                        ? 'bg-[#111317] focus:bg-[#08080810] focus:text-black text-white'
                        : 'bg-[#FFFFFF] focus:bg-[#00000010]'
                    )}
                  >
                    <SelectPrimitive.ItemText data-testid={`${dataTestId}-item-text`}>
                      {optionLabel}
                    </SelectPrimitive.ItemText>
                  </SelectPrimitive.Item>
                );
              })}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </div>
  );
};
