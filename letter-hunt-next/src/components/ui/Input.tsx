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
            className="block text-sm font-medium text-neutral-300 mb-2"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
              {icon}
            </div>
          )}
          
          <input
            id={inputId}
            className={cn(
              // Base styles
              'w-full px-3 py-2 rounded-lg font-medium transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-950',
              'placeholder:text-neutral-500',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              
              // Icon spacing
              icon && 'pl-10',
              
              // Variants
              {
                'bg-neutral-900 border border-neutral-700 text-neutral-100 focus:border-primary-500 focus:ring-primary-500':
                  variant === 'default',
                'bg-neutral-800 border-0 text-neutral-100 focus:bg-neutral-700 focus:ring-primary-500':
                  variant === 'filled',
                'bg-transparent border-0 border-b-2 border-neutral-700 text-neutral-100 focus:border-primary-500 focus:ring-0 rounded-none px-1':
                  variant === 'flushed',
              },
              
              // Error state
              error && 'border-error focus:border-error focus:ring-error',
              
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        
        {(error || helper) && (
          <p className={cn(
            'mt-1 text-xs',
            error ? 'text-error' : 'text-neutral-500'
          )}>
            {error || helper}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';