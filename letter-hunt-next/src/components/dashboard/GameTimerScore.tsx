'use client';

/**
 * Game Timer Score Component
 * 
 * Displays elapsed time and current score.
 * Clean inline display for dashboard-style layout.
 * 
 * @module GameTimerScore
 */

import { cn, formatTime } from '@/lib/utils';
import { Clock, Trophy } from 'lucide-react';

interface GameTimerScoreProps {
  /** Elapsed time in seconds */
  elapsedTime: number;
  /** Current score */
  score: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Game Timer Score - Time and score display
 * 
 * Format: "Tiempo: 02:34 | Puntuación: 1,250"
 * With optional icons for visual clarity.
 */
export function GameTimerScore({ elapsedTime, score, className }: GameTimerScoreProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center gap-4 md:gap-8',
        'text-sm md:text-base text-gray-700 dark:text-gray-300',
        className
      )}
      role="status"
      aria-label={`Tiempo: ${formatTime(elapsedTime)}, Puntuación: ${score.toLocaleString()}`}
    >
      {/* Time */}
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 md:w-5 md:h-5 text-primary-500" aria-hidden="true" />
        <span className="text-neutral-500">Tiempo:</span>
        <span className="font-mono font-bold">{formatTime(elapsedTime)}</span>
      </div>
      
      {/* Separator */}
      <span className="text-neutral-300">|</span>
      
      {/* Score */}
      <div className="flex items-center gap-2">
        <Trophy className="w-4 h-4 md:w-5 md:h-5 text-warning-500" aria-hidden="true" />
        <span className="text-neutral-500">Puntuación:</span>
        <span className="font-mono font-bold">{score.toLocaleString()}</span>
      </div>
    </div>
  );
}
