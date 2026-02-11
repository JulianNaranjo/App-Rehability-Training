/**
 * Game Instructions Component - Clinical Design
 * 
 * Displays detailed instructions for a game mode.
 * Styled with clean clinical aesthetics.
 * 
 * @module GameInstructions
 */

import { cn } from '@/lib/utils';
import type { GameModeConfig } from '@/skills/dashboard/dashboard-logic';
import { Info } from 'lucide-react';

interface GameInstructionsProps {
  mode: GameModeConfig;
  bgLight: string;
  bgDark: string;
  textLight: string;
  textDark: string;
  titleLight: string;
  titleDark: string;
  className?: string;
}

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
        // Base styles - Clinical
        'rounded-lg p-4 border border-border-soft',
        
        // Colors
        bgLight,
        bgDark,
        
        className
      )}
      role="region"
      aria-label={`Instrucciones para ${mode.title}`}
    >
      {/* Header with icon */}
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <Info className="w-4 h-4 text-text-tertiary" strokeWidth={1.5} />
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h4 className={cn(
            'font-medium text-sm mb-1.5',
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
      </div>
    </div>
  );
}
