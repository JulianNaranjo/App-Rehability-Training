import { cn } from '@/lib/utils';
import { forwardRef, useId } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'flushed';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helper, icon, variant = 'default', id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text-secondary mb-2"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              {icon}
            </div>
          )}

          <input
            id={inputId}
            className={cn(
              // Base styles
              'w-full px-3 py-2 rounded-lg font-medium transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary-500/30',
              'placeholder:text-text-muted',
              'disabled:opacity-50 disabled:cursor-not-allowed',

              // Icon spacing
              icon && 'pl-10',

              // Variants — aligned with the clinical design tokens (theme-aware)
              {
                'bg-surface border border-border-standard text-text-primary focus:border-primary-500':
                  variant === 'default',
                'bg-surface-elevated border border-transparent text-text-primary focus:bg-surface focus:border-border-emphasis':
                  variant === 'filled',
                'bg-transparent border-0 border-b-2 border-border-standard text-text-primary focus:border-primary-500 focus:ring-0 rounded-none px-1':
                  variant === 'flushed',
              },

              // Error state
              error && 'border-error-500 focus:border-error-500 focus:ring-error-500/30',

              className
            )}
            ref={ref}
            {...props}
          />
        </div>

        {(error || helper) && (
          <p className={cn(
            'mt-1 text-xs',
            error ? 'text-error-600' : 'text-text-muted'
          )}>
            {error || helper}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';