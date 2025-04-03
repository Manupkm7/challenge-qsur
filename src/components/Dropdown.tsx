import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { MouseEventHandler, ReactNode } from 'react';

type DropdownProps = {
  items: { content: ReactNode; onClick?: MouseEventHandler<HTMLDivElement> }[];
  button: ReactNode;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  open?: boolean;
  align?: DropdownMenu.DropdownMenuContentProps['align'];
};

export default function Dropdown({ items, button, onOpenChange, defaultOpen, open, align }: DropdownProps) {
  return (
    <DropdownMenu.Root data-testid="dropdown-root" open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <DropdownMenu.Trigger asChild data-testid="dropdown-trigger">{button}</DropdownMenu.Trigger>
      <DropdownMenu.Portal data-testid="dropdown-portal">
        <DropdownMenu.Content
          data-testid="dropdown-content"
          className="z-20 p-2 bg-white rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity] animate-fade"
          sideOffset={5}
          align={align}>
          {items.map(({ content, onClick }, index) => (
            <DropdownMenu.Item
              onClick={onClick}
              className="flex items-center p-2 rounded-md cursor-pointer hover:bg-primary-100 focus:bg-primary-100 gap-x-2"
              key={index}>
              {content}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
