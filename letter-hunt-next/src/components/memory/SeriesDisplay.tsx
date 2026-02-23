'use client';

/**
 * Series Display Component
 *
 * Displays the series digits one by one with animation.
 * Each digit is shown for 1 second.
 *
 * @module SeriesDisplay
 */

import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { SERIES_SHOW_TIME_MS } from '@/types/working-memory';

interface SeriesDisplayProps {
  series: number[];
  currentIndex: number;
  onAdvance: () => void;
  className?: string;
}

export function SeriesDisplay({ 
  series, 
  currentIndex, 
  onAdvance, 
  className 
}: SeriesDisplayProps) {
  useEffect(() => {
    if (currentIndex < series.length) {
      const timer = setTimeout(() => {
        onAdvance();
      }, SERIES_SHOW_TIME_MS);
      
      return () => clearTimeout(timer);
    }
  }, [currentIndex, series.length, onAdvance]);

  return (
    <div className={cn('flex flex-col items-center gap-6', className)}>
      <div className="text-center">
        <h2 className="text-lg font-semibold text-text-primary mb-2">
          Memoriza la serie
        </h2>
        <p className="text-sm text-text-secondary">
          Dígito {currentIndex + 1} de {series.length}
        </p>
      </div>

      <div className="flex items-center justify-center gap-4">
        {Array.from({ length: series.length }).map((_, index) => {
          const isCurrentDigit = index === currentIndex;
          const isPast = index < currentIndex;
          const showDigit = index <= currentIndex;
          
          return (
            <div
              key={index}
              className={cn(
                'w-20 h-20 rounded-xl flex items-center justify-center',
                'text-4xl font-bold transition-all duration-300',
                'border-4',
                isCurrentDigit && [
                  'bg-primary-500 text-white',
                  'border-primary-600',
                  'scale-110 shadow-lg',
                ],
                isPast && [
                  'bg-primary-100 text-primary-300',
                  'border-primary-200',
                ],
                !showDigit && [
                  'bg-surface-elevated text-transparent',
                  'border-border-soft',
                ]
              )}
            >
              {showDigit ? series[index] : '?'}
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 mt-2">
        {Array.from({ length: series.length }).map((_, index) => (
          <div
            key={index}
            className={cn(
              'w-2 h-2 rounded-full transition-colors',
              index <= currentIndex ? 'bg-primary-500' : 'bg-neutral-300'
            )}
          />
        ))}
      </div>
    </div>
  );
}
