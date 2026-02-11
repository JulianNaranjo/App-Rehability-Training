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
          // Base styles - Clinical clean
          'inline-flex items-center justify-center rounded-lg font-medium',
          'transition-all duration-150 ease-out',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'relative overflow-hidden',
          
          // Variants - Clinical desaturated colors
          {
            // Primary: Soft violet, minimal
            'bg-primary-500 hover:bg-primary-600 text-white': variant === 'primary',
            'focus:ring-primary-400': variant === 'primary',
            
            // Secondary: Subtle border style
            'bg-surface border border-border-emphasis text-text-primary': variant === 'secondary',
            'hover:bg-surface-elevated hover:border-border-standard': variant === 'secondary',
            'focus:ring-border-emphasis': variant === 'secondary',
            
            // Success: Forest green
            'bg-success-500 hover:bg-success-600 text-white': variant === 'success',
            'focus:ring-success-400': variant === 'success',
            
            // Error: Terracotta
            'bg-error-500 hover:bg-error-600 text-white': variant === 'error',
            'focus:ring-error-400': variant === 'error',
            
            // Warning: Muted amber
            'bg-warning-500 hover:bg-warning-600 text-white': variant === 'warning',
            'focus:ring-warning-400': variant === 'warning',
            
            // Ghost: Minimal presence
            'bg-transparent text-text-secondary hover:bg-surface hover:text-text-primary': variant === 'ghost',
            'focus:ring-border-soft': variant === 'ghost',
          },
          
          // Sizes - Clinical proportions
          {
            'px-3 py-1.5 text-sm gap-1.5': size === 'sm',
            'px-4 py-2 text-base gap-2': size === 'md',
            'px-5 py-2.5 text-base gap-2': size === 'lg',
            'px-6 py-3 text-lg gap-3': size === 'xl',
          },
          
          // Active state - Clinical subtle press
          'active:scale-[0.98]',
          
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {/* Loading spinner - Clinical minimal */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent opacity-70" />
          </div>
        )}
        
        {/* Content */}
        <span className={cn('flex items-center gap-2', loading && 'opacity-0')}>
          {icon && <span className="flex-shrink-0 opacity-80">{icon}</span>}
          {children}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';
