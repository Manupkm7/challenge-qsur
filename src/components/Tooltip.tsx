//React
import { ReactNode } from 'react';

// Librerias externas
import { clsx } from 'clsx';
import { Tooltip } from 'radix-ui';

/**
 * Componente para mostrar información adicional al pasar el cursor.
 *
 * Props:
 * - `tooltip`: Texto a mostrar en el tooltip.
 * - `size`: Tamaño del tooltip.
 * - `className`: Clases CSS adicionales.
 * - `side`: Lado donde se mostrará el tooltip.
 * - `delayDuration`: Duración del retraso para mostrar el tooltip.
 * - `children`: Elemento hijo que activa el tooltip.
 */

type Props = {
  children: ReactNode;
  tooltip: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  delayDuration?: number;
};

const ToolTip = ({ children, tooltip, className, side = 'top', delayDuration = 0 }: Props) => {
  return (
    <Tooltip.Provider delayDuration={delayDuration}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className={clsx(`TooltipContent z-50`, className)}
            sideOffset={5}
            side={side}
          >
            {tooltip}
            <Tooltip.Arrow className="fill-select-dark-gray" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default ToolTip;
