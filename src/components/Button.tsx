import { ButtonHTMLAttributes, forwardRef, MouseEventHandler, ReactNode } from 'react';
import { clsx } from 'clsx';

type Props = {
  variant: 'primary' | 'secondary' | 'destructive';
  type?: ButtonHTMLAttributes<unknown>['type'];
  className?: string;
  isLoading?: boolean;
  disabled?: boolean;
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  hasError?: boolean;
  testId?: string;
};

const Button = forwardRef<HTMLButtonElement, Props>((props, forwardedRef) => {
  const {
    variant,
    isLoading,
    type = 'button',
    onClick,
    disabled,
    className,
    children,
    hasError,
    testId,
  } = props;

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (isLoading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  return (
    <button
      ref={forwardedRef}
      type={type}
      data-testid={testId}
      data-variant={variant}
      className={clsx(
        'flex items-center justify-center gap-[10px] py-[10px] px-[20px] rounded-[8px] text-[16px] leading-[20px] border',
        variant === 'primary' &&
          'bg-primary-500 font-lexend font-bold text-white border-primary-500',
        variant === 'secondary' && 'bg-white font-inter font-medium text-black border-gray-border',
        variant === 'destructive' && 'bg-red-500 font-lexend font-bold text-white border-red-500',
        disabled && 'bg-gray-600 text-gray-400 border-gray-600',
        isLoading ? 'min-w-[14px] min-h-[14px]' : 'min-w-min min-h-min',
        hasError && 'bg-red-500 text-white',
        className
      )}
      disabled={disabled}
      data-disabled={disabled}
      data-loading={isLoading}
      onClick={handleClick}
    >
      {isLoading ? (
        <div
          className={clsx(
            'w-3 h-3 border-b-2 rounded-full animate-spin',
            variant === 'primary' && 'border-white',
            variant === 'secondary' && 'border-primary-500'
          )}
        />
      ) : null}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
