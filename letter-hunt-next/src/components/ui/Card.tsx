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
        // Base styles
        'rounded-2xl transition-all duration-200',
        
        // Padding variants
        {
          'p-4': padding === 'sm',
          'p-6': padding === 'md',
          'p-8': padding === 'lg',
          'p-10': padding === 'xl',
        },
        
        // Visual variants
        {
          'bg-neutral-900': variant === 'default',
          'bg-neutral-900/50 backdrop-blur-md border border-neutral-800': variant === 'glass',
          'bg-neutral-900 shadow-2xl border border-neutral-800': variant === 'elevated',
          'bg-transparent border-2 border-neutral-800': variant === 'outlined',
        },
        
        // Interactive styles
        interactive && 'hover:bg-neutral-800/50 hover:scale-[1.02] cursor-pointer',
        
        className
      )}
    >
      {children}
    </div>
  );
}