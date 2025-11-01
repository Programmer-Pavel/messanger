import { ChangeEvent, InputHTMLAttributes, RefCallback, forwardRef, useRef, useState } from 'react';
import { Control, FieldValues, useController } from 'react-hook-form';
import cn from 'classnames';
import { EyeIcon, EyeSlashIcon, XMarkIcon } from '@heroicons/react/24/outline';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  fullWidth?: boolean;
  containerClassName?: string;
  showPasswordToggle?: boolean;
  showClearButton?: boolean;
  control?: Control<FieldValues>;
  name?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      className,
      fullWidth = true,
      containerClassName,
      showPasswordToggle = false,
      showClearButton = true,
      control,
      name,
      type,
      error,
      value,
      onChange,
      ...props
    },
    forwardedRef,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const controlled = control && name;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const fieldProps = controlled ? useController({ name: name!, control }).field : { value, onChange };

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const fieldError = controlled ? useController({ name: name!, control }).fieldState.error : { message: error };

    const handleClear = () => {
      if (controlled) {
        fieldProps.onChange?.({ target: { value: '' } } as ChangeEvent<HTMLInputElement>);
      } else if (onChange) {
        onChange({ target: { value: '' } } as ChangeEvent<HTMLInputElement>);
      }
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    const togglePassword = () => {
      setShowPassword((prev) => !prev);
    };

    const handleRefs: RefCallback<HTMLInputElement> = (element) => {
      if (controlled && 'ref' in fieldProps) {
        fieldProps.ref(element);
      }

      if (typeof forwardedRef === 'function') {
        forwardedRef(element);
      } else if (forwardedRef) {
        forwardedRef.current = element;
      }

      inputRef.current = element;
    };

    const inputClasses = cn(
      'block rounded-md bg-white px-3 py-1.5 text-base text-gray-900',
      'outline-1 -outline-offset-1 outline-gray-300',
      'placeholder:text-gray-400',
      'focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600',
      'sm:text-sm/6',
      {
        'w-full': fullWidth,
        'outline-red-500': fieldError?.message,
        'focus:outline-red-500': fieldError?.message,
        'pr-10': showPasswordToggle || (showClearButton && fieldProps.value),
      },
      className,
    );

    const labelClasses = cn('block text-left text-sm/6 font-medium', {
      'text-gray-900': !fieldError?.message,
      'text-red-500': fieldError?.message,
    });

    const helperTextClasses = cn('text-sm text-left', {
      'text-red-500': fieldError?.message,
      'text-gray-500': !fieldError?.message && helperText,
    });

    const passwordToggleClasses = cn(
      'absolute top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer',
      {
        'right-2': !showClearButton || !fieldProps.value,
        'right-8': showClearButton && fieldProps.value,
      },
    );

    const containerClasses = cn('flex flex-col gap-2', containerClassName);

    return (
      <div className={containerClasses}>
        {label && (
          <label
            htmlFor={props.id}
            className={labelClasses}
          >
            {label}
          </label>
        )}

        <div className="relative">
          <input
            {...props}
            ref={handleRefs}
            value={fieldProps.value || ''}
            onChange={fieldProps.onChange}
            className={inputClasses}
            type={showPassword ? 'text' : type}
          />

          {showClearButton && fieldProps.value && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}

          {showPasswordToggle && type === 'password' && fieldProps.value && (
            <button
              type="button"
              onClick={togglePassword}
              className={passwordToggleClasses}
            >
              {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          )}
        </div>

        {(fieldError?.message || helperText) && (
          <span className={helperTextClasses}>{fieldError?.message || helperText}</span>
        )}
      </div>
    );
  },
);
