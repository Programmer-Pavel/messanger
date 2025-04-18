import { ButtonHTMLAttributes, forwardRef } from 'react';
import cn from 'classnames';
import { Spinner } from '@shared/ui/Spinner';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', fullWidth, isLoading, className, disabled, ...props }, ref) => {
    const buttonVariants = {
      primary: 'bg-indigo-600 text-white hover:bg-indigo-500',
      secondary: 'bg-white text-gray-900 hover:bg-gray-50',
      danger: 'bg-red-600 text-white hover:bg-red-500',
    };

    const buttonClasses = cn(
      'flex items-center justify-center gap-2 rounded-md px-3 py-1.5 cursor-pointer',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      buttonVariants[variant],
      {
        'w-full': fullWidth,
      },
      className,
    );

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Spinner className="text-white" />}
        {children}
      </button>
    );
  },
);
