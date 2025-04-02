import { ReactNode } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import clsx from 'clsx';

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
              `bg-select-dark-gray text-white max-w-xs text-[14px] p-2 data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade select-none rounded-[4px] font-medium leading-[22px] font-inter shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]`,
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
