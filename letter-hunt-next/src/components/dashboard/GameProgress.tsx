'use client';

/**
 * Game Progress Component
 * 
 * Simple counter showing selected/total tiles.
 * Clean design matching dashboard aesthetics.
 * 
 * @module GameProgress
 */

import { cn } from '@/lib/utils';

interface GameProgressProps {
  /** Number of currently selected tiles */
  selectedCount: number;
  /** Total number of target tiles */
  targetCount: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Game Progress - Simple selection counter
 * 
 * Displays: "Seleccionadas: X/Y"
 * No progress bar, just text counter.
 */
export function GameProgress({ selectedCount, targetCount, className }: GameProgressProps) {
  const isLimitReached = selectedCount >= targetCount;
  
  return (
    <div
      className={cn(
        'text-center',
        className
      )}
      role="status"
      aria-label={`Progreso: ${selectedCount} de ${targetCount} letras seleccionadas`}
    >
      <p className="text-lg md:text-xl text-primary-600 dark:text-primary-400">
        Seleccionadas:{' '}
        <span className="font-bold">{selectedCount}</span>
        <span className="text-neutral-400 mx-1">/</span>
        <span className="font-bold">{targetCount}</span>
      </p>
      {isLimitReached && (
        <p className="text-sm text-warning-600 dark:text-warning-400 mt-2 font-medium">
          ¡Límite alcanzado! Presiona Verificar
        </p>
      )}
    </div>
  );
}
