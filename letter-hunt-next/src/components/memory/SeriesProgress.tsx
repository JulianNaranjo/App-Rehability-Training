'use client';

/**
 * Series Progress Component
 *
 * Shows progress through the series game (X/3 series completed).
 * Also shows current series length phase.
 *
 * @module SeriesProgress
 */

import { cn } from '@/lib/utils';
import { CheckCircle2, Circle } from 'lucide-react';
import { SERIES_REQUIRED_CORRECT, SERIES_MIN_LENGTH, SERIES_MAX_LENGTH } from '@/types/working-memory';

interface SeriesProgressProps {
  current: number;
  total: number;
  currentSeriesLength: number;
  className?: string;
}

export function SeriesProgress({ current, total, currentSeriesLength, className }: SeriesProgressProps) {
  const totalPhases = SERIES_MAX_LENGTH - SERIES_MIN_LENGTH + 1;
  const currentPhase = currentSeriesLength - SERIES_MIN_LENGTH + 1;

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <div className="text-center">
        <p className="text-sm font-medium text-text-secondary">
          Fase {currentPhase}/{totalPhases}: Series de {currentSeriesLength} dígitos
        </p>
        <p className="text-2xl font-bold text-text-primary">
          {current} / {total}
        </p>
        <p className="text-xs text-text-tertiary mt-1">
          series correctas consecutivas
        </p>
      </div>

      <div className="flex items-center gap-3">
        {Array.from({ length: SERIES_REQUIRED_CORRECT }).map((_, index) => (
          <div
            key={index}
            className={cn(
              'flex items-center justify-center transition-all duration-300',
            )}
          >
            {index < current ? (
              <CheckCircle2 className="w-8 h-8 text-success-500" />
            ) : (
              <Circle className={cn(
                'w-8 h-8',
                index === current ? 'text-primary-400' : 'text-neutral-300'
              )} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
