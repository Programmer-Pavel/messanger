import { ButtonHTMLAttributes, forwardRef } from 'react';
import cn from 'classnames';
import { Spinner } from '@shared/ui/Spinner';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      fullWidth,
      isLoading,
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          'flex items-center justify-center gap-2 rounded-md px-3 py-1.5 cursor-pointer',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'bg-indigo-600 text-white hover:bg-indigo-500':
              variant === 'primary',
            'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50':
              variant === 'secondary',
            'w-full': fullWidth,
          },
          className,
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Spinner />}
        {children}
      </button>
    );
  },
);
