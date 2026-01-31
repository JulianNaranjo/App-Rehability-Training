import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, icon, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(
          // Base styles
          'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-950',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'relative overflow-hidden',
          
          // Variants
          {
            'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500 shadow-lg shadow-primary-500/25':
              variant === 'primary',
            'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 focus:ring-neutral-600':
              variant === 'secondary',
            'bg-success hover:bg-success-600 text-white focus:ring-success shadow-lg shadow-success/25':
              variant === 'success',
            'bg-error hover:bg-error-600 text-white focus:ring-error shadow-lg shadow-error/25':
              variant === 'error',
            'bg-warning hover:bg-warning-600 text-white focus:ring-warning shadow-lg shadow-warning/25':
              variant === 'warning',
            'bg-transparent hover:bg-neutral-800 text-neutral-300 focus:ring-neutral-600':
              variant === 'ghost',
          },
          
          // Sizes
          {
            'px-3 py-1.5 text-sm gap-1.5': size === 'sm',
            'px-4 py-2 text-base gap-2': size === 'md',
            'px-6 py-3 text-lg gap-2': size === 'lg',
            'px-8 py-4 text-xl gap-3': size === 'xl',
          },
          
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {/* Loading spinner */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          </div>
        )}
        
        {/* Content */}
        <span className={cn('flex items-center gap-2', loading && 'opacity-0')}>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
        </span>
        
        {/* Hover effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
      </button>
    );
  }
);

Button.displayName = 'Button';