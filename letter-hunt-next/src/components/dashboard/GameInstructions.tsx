/**
 * Game Instructions Component
 * 
 * Displays detailed instructions for a game mode.
 * Styled card appearing below the game mode cards.
 * 
 * @module GameInstructions
 */

import { cn } from '@/lib/utils';
import type { GameModeConfig } from '@/skills/dashboard/dashboard-logic';

interface GameInstructionsProps {
  /** Game mode configuration containing instructions */
  mode: GameModeConfig;
  /** Background color class for light mode */
  bgLight: string;
  /** Background color class for dark mode */
  bgDark: string;
  /** Text color class for light mode */
  textLight: string;
  /** Text color class for dark mode */
  textDark: string;
  /** Title color class for light mode */
  titleLight: string;
  /** Title color class for dark mode */
  titleDark: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Game Instructions - Instruction card for a game mode
 * 
 * Displays detailed instructions with section-specific
 * color scheme below the game mode selection cards.
 */
export function GameInstructions({
  mode,
  bgLight,
  bgDark,
  textLight,
  textDark,
  titleLight,
  titleDark,
  className,
}: GameInstructionsProps) {
  return (
    <div
      className={cn(
        // Base styles
        'rounded-lg p-4',
        
        // Colors from section config
        bgLight,
        bgDark,
        
        className
      )}
      role="region"
      aria-label={`Instrucciones para ${mode.title}`}
    >
      {/* Title */}
      <h4 className={cn(
        'font-semibold mb-2',
        titleLight,
        titleDark
      )}>
        {mode.title}
      </h4>
      
      {/* Instructions Text */}
      <p className={cn(
        'text-sm leading-relaxed',
        textLight,
        textDark
      )}>
        {mode.instructions}
      </p>
    </div>
  );
}
