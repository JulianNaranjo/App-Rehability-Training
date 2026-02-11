import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'elevated' | 'outlined';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
}

export function Card({ 
  children, 
  className, 
  variant = 'default', 
  padding = 'md',
  interactive = false 
}: CardProps) {
  return (
    <div
      className={cn(
        // Base styles - Clinical clean
        'rounded-xl transition-all duration-200',
        
        // Padding variants
        {
          'p-4': padding === 'sm',
          'p-6': padding === 'md',
          'p-8': padding === 'lg',
          'p-10': padding === 'xl',
        },
        
        // Visual variants - Clinical borders-only approach
        {
          // Default: White surface with subtle border
          'bg-surface border border-border-standard': variant === 'default',
          
          // Glass: Frosted glass effect for overlays
          'bg-surface/80 backdrop-blur-md border border-border-soft': variant === 'glass',
          
          // Elevated: Subtle lift with shadow
          'bg-surface border border-border-soft shadow-md': variant === 'elevated',
          
          // Outlined: Minimal, just border
          'bg-transparent border border-border-emphasis': variant === 'outlined',
        },
        
        // Interactive styles - Clinical subtle feedback
        interactive && [
          'cursor-pointer',
          'hover:border-primary-300 hover:shadow-sm',
          'active:scale-[0.995]',
          'transition-all duration-150 ease-out'
        ],
        
        className
      )}
    >
      {children}
    </div>
  );
}
