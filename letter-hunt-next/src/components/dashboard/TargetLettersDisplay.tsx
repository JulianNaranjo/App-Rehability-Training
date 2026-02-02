'use client';

/**
 * Target Letters Display Component
 * 
 * Displays all target letters in a single card with gradient background.
 * Dashboard-style design matching the main dashboard aesthetics.
 * 
 * @module TargetLettersDisplay
 */

import { cn } from '@/lib/utils';

interface TargetLettersDisplayProps {
  /** Array of target letters to display */
  letters: string[];
  /** Current game mode to determine color scheme */
  gameMode?: 'selection' | 'count';
  /** Additional CSS classes */
  className?: string;
}

/**
 * Target Letters Display - Card showing all letters to find
 * 
 * Displays target letters in a gradient card with the text
 * "Busca todas las letras: A, B, C"
 */
export function TargetLettersDisplay({ letters, gameMode, className }: TargetLettersDisplayProps) {
  if (!letters || letters.length === 0) return null;

  const lettersText = letters.map(l => l.toUpperCase()).join(', ');
  
  // Check if these are numbers (level 5)
  const isNumbers = letters.length > 0 && /^[0-9]$/.test(letters[0]);

  return (
    <div
      className={cn(
        // Base card styles - matching dashboard cards
        'relative w-full rounded-2xl p-6 md:p-8',
        'text-white shadow-lg',
        // Dynamic gradient based on game mode
        gameMode === 'count'
          ? 'bg-gradient-to-r from-secondary-500 to-secondary-700'
          : 'bg-gradient-to-r from-primary-500 to-primary-700',
        className
      )}
      role="region"
      aria-label={isNumbers ? "Números objetivo" : "Letras objetivo"}
    >
      <div className="text-center">
        {/* Label */}
        <p className="text-sm md:text-base opacity-90 mb-3">
          {isNumbers ? 'Busca todos los números:' : 'Busca todas las letras:'}
        </p>
        
        {/* Letters */}
        <p className="text-3xl md:text-4xl font-bold tracking-wider">
          {lettersText}
        </p>
      </div>
    </div>
  );
}
