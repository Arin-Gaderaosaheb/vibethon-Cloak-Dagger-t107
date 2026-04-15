'use client';
import { forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-[var(--color-text-muted)]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)]">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            className={clsx('input', icon && 'pl-10', error && 'error', className)}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-[var(--color-error)]">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
