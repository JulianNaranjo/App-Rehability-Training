'use client';

/**
 * Target Letters Display Component
 * 
 * Displays all target letters/numbers/symbols in a single card with gradient background.
 * Dashboard-style design matching the main dashboard aesthetics.
 * 
 * @module TargetLettersDisplay
 */

import { cn } from '@/lib/utils';
import { SYMBOLS } from '@/types/game';

interface TargetLettersDisplayProps {
  /** Array of target letters to display */
  letters: string[];
  /** Current game mode to determine color scheme */
  gameMode?: 'selection' | 'count';
  /** Additional CSS classes */
  className?: string;
}

/**
 * Check if a character is a symbol (from SYMBOLS constant)
 */
function isSymbol(char: string): boolean {
  return SYMBOLS.includes(char);
}

/**
 * Target Letters Display - Card showing all targets to find
 * 
 * Displays target letters/numbers/symbols in a gradient card with the text
 * "Busca todas las letras: A, B, C" or "Busca todos los números: 1, 2, 3" or "Busca todos los símbolos: ∞, π, ÷"
 */
export function TargetLettersDisplay({ letters, gameMode, className }: TargetLettersDisplayProps) {
  if (!letters || letters.length === 0) return null;

  // Check if these are numbers (level 5)
  const isNumbers = letters.length > 0 && /^[0-9]$/.test(letters[0]);
  // Check if these are symbols (level 6)
  const isSymbols = letters.length > 0 && isSymbol(letters[0]);
  
  // Don't apply toUpperCase() to symbols - they should be displayed as-is
  const lettersText = letters.map(l => isSymbol(l) ? l : l.toUpperCase()).join(', ');

  return (
    <div
      className={cn(
        // Base card styles - matching dashboard cards
        'relative w-full rounded-2xl p-6 md:p-8',
        'text-white shadow-lg',
        // Consistent gradient: primary (purple) for letters and symbols, secondary (teal) for count mode
        gameMode === 'count'
          ? 'bg-gradient-to-r from-secondary-500 to-secondary-700'
          : 'bg-gradient-to-r from-primary-500 to-primary-700',
        className
      )}
      role="region"
      aria-label={isSymbols ? "Símbolos objetivo" : isNumbers ? "Números objetivo" : "Letras objetivo"}
    >
      <div className="text-center">
        {/* Label */}
        <p className="text-sm md:text-base opacity-90 mb-3">
          {isSymbols ? 'Busca todos los símbolos:' : isNumbers ? 'Busca todos los números:' : 'Busca todas las letras:'}
        </p>
        
        {/* Letters/Numbers/Symbols */}
        <p className={cn(
          "font-bold tracking-wider",
          isSymbols ? "text-4xl md:text-5xl" : "text-3xl md:text-4xl"
        )}>
          {lettersText}
        </p>
      </div>
    </div>
  );
}
