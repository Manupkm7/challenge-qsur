import { ReactNode } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { clsx } from 'clsx';

interface TabTitleProps {
  trigger: ReactNode;
  value: string;
  className?: string;
  disabled?: boolean;
  icon?: ReactNode;
}

interface TabContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

interface TabsRootProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}

const TabsRoot = ({ defaultValue, value, onValueChange, children, className }: TabsRootProps) => {
  return (
    <Tabs.Root
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
      className={clsx('w-full bg-transparent', className)}
    >
      {children}
    </Tabs.Root>
  );
};

const TabsList = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <Tabs.List
      className={clsx(
        'flex h-10 items-center justify-center rounded-md p-1 text-slate-500',
        className
      )}
    >
      {children}
    </Tabs.List>
  );
};

const TabTitle = ({ trigger, value, className, disabled, icon }: TabTitleProps) => {
  return (
    <Tabs.Trigger
      value={value}
      disabled={disabled}
      className={clsx(
        'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary-500 data-[state=active]:text-white data-[state=active]:shadow-sm',
        className
      )}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {trigger}
    </Tabs.Trigger>
  );
};

const TabContent = ({ value, children, className }: TabContentProps) => {
  return (
    <Tabs.Content
      value={value}
      className={clsx(
        'mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2',
        className
      )}
    >
      {children}
    </Tabs.Content>
  );
};

export { TabsRoot, TabsList, TabTitle, TabContent };
