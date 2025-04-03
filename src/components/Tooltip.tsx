import { ReactNode } from 'react';
import { clsx } from "clsx"
import { Tooltip } from 'radix-ui';

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
            className={clsx(
              `TooltipContent z-50`,
              className
            )}
            sideOffset={5}
            side={side}>
            {tooltip}
            <Tooltip.Arrow className="fill-select-dark-gray" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default ToolTip;
