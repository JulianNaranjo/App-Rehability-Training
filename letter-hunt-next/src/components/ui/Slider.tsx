import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface SliderProps {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ value, onValueChange, min = 0, max = 100, step = 1, disabled = false, className }, ref) => {
    const percentage = ((value - min) / (max - min)) * 100;

    return (
      <div className={cn('relative w-full', className)}>
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onValueChange(Number(e.target.value))}
          className={cn(
            'absolute inset-0 w-full h-full opacity-0 cursor-pointer',
            disabled && 'cursor-not-allowed'
          )}
        />
        <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
          <div
            className="absolute h-full bg-primary-600 rounded-full transition-all duration-150"
            style={{ width: `${percentage}%` }}
          />
          <div
            className={cn(
              'absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-primary-600 rounded-full shadow-md transition-all duration-150',
              disabled && 'cursor-not-allowed'
            )}
            style={{ left: `calc(${percentage}% - 8px)` }}
          />
        </div>
      </div>
    );
  }
);

Slider.displayName = 'Slider';
