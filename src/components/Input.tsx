//React
import { DetailedHTMLProps, forwardRef, InputHTMLAttributes, ReactNode, useId } from 'react';

//Librerias externas
import { clsx } from 'clsx';

/**
 * Campo de entrada reutilizable.
 * 
 * Props:
 * - `value`: Valor del campo.
 * - `onChange`: Callback para manejar cambios.
 * - `placeholder`: Texto de marcador de posición.
 * - `dark`: Indica si el tema oscuro está activado.
 * - `inputClassName`: Clases CSS adicionales para el input.
 * - `labelClassName`: Clases CSS adicionales para la etiqueta.
 * - `primaryColor`: Color primario para el input.
 * - `labelContent`: Contenido de la etiqueta.
 * - `hasError`: Indica si hay un error en el input.
 * - `testId`: ID para pruebas.
 */

type Props = Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'onChange'
> & {
  value: string | number;
  onChange: (value: string) => void;
  inputClassName?: string;
  labelClassName?: string;
  primaryColor?: string;
  labelContent?: ReactNode;
  hasError?: boolean;
  dark?: boolean;
  testId?: string;
};

const Input = forwardRef<HTMLInputElement, Props>(
  (
    {
      value,
      onChange,
      disabled,
      inputClassName,
      labelContent,
      labelClassName,
      placeholder,
      hasError,
      dark,
      testId,
      ...inputProps
    },
    forwardedRef
  ) => {
    const generatedId = useId();
    return (
      <div
        id={inputProps.id || generatedId}
        className={clsx('relative w-full', inputProps.className)}
      >
        <div
          className={clsx(
            'min-h-[44px] h-full relative flex w-full rounded-lg focus-within:border-primary-500 group transition-all',
            hasError && 'focus-within:border-red-500',
            inputClassName,
            disabled && 'cursor-not-allowed',
            dark ? 'bg-[#111317] text-white border' : 'bg-[#FFFFFF] border'
          )}
        >
          <label
            className={clsx(
              'absolute -top-1.5 left-4 flex rounded-2xl px-1 text-[8px] transition-all text-[#BBBBBB]',
              hasError && 'group-focus-within:border-red-500',
              labelClassName,
              dark ? 'bg-[#111317] text-white' : 'bg-[#FFFFFF] group-focus-within:text-primary-500'
            )}
          >
            {labelContent}
          </label>
          <div className="flex min-h-[42px] w-full items-center justify-between gap-2.5 px-4 text-sm">
            <input
              data-testid={testId}
              ref={forwardedRef}
              className={clsx(
                'min-h-[44px] w-full text-sm font-light focus:outline-none active:outline-none blur:ring-0 focus:ring-0 focus-within:ring-0 focus-within:border-primary-500',
                disabled ? 'cursor-not-allowed' : '',
                dark ? "text-white bg-transparent" : "text-black",
              )}
              placeholder={placeholder}
              name={inputProps.name}
              value={value}
              type={inputProps.type || 'text'}
              onChange={(e) => onChange?.(e.target.value)}
              disabled={disabled}
              style={{
                color: dark ? '#FFFFFF' : '#000000',
                background: dark ? '#111317' : 'transparent',
              }}
              {...inputProps}
            />
          </div>
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
