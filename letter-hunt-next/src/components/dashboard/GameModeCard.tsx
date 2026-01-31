'use client';

/**
 * Game Mode Card Component
 * 
 * Interactive card for selecting a game mode.
 * Features gradient background, icon, and hover effects.
 * 
 * @module GameModeCard
 */

import { cn } from '@/lib/utils';
import { useState } from 'react';
import type { GameModeConfig } from '@/skills/dashboard/dashboard-logic';
import { 
  MousePointerClick, 
  Calculator, 
  Eye, 
  Layers,
  type LucideIcon 
} from 'lucide-react';

// Map icon names to Lucide components
const iconMap: Record<string, LucideIcon> = {
  MousePointerClick,
  Calculator,
  Eye,
  Layers,
};

interface GameModeCardProps {
  /** Game mode configuration */
  mode: GameModeConfig;
  /** Callback when card is selected */
  onSelect: () => void;
  /** Optional loading state */
  isLoading?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Game Mode Card - Interactive selection card
 * 
 * Displays a game mode with gradient background, icon,
 * and interactive hover/click states.
 */
export function GameModeCard({ 
  mode, 
  onSelect, 
  isLoading = false,
  className 
}: GameModeCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Get the icon component
  const IconComponent = iconMap[mode.icon];

  return (
    <button
      onClick={onSelect}
      disabled={isLoading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        // Base styles
        'relative w-full rounded-2xl p-6 md:p-8',
        'transition-all duration-200 ease-out',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        
        // Gradient background - using complete Tailwind classes
        'bg-gradient-to-r',
        mode.gradientFrom,
        mode.gradientTo,
        
        // Hover effects - scale and shadow
        'hover:scale-[1.02]',
        
        // Cursor
        'cursor-pointer',
        
        // Text color for gradient backgrounds
        'text-white',
        
        className
      )}
      aria-label={`Seleccionar ${mode.title}: ${mode.shortDescription}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      {/* Content Container */}
      <div className="flex flex-col items-center text-center">
        {/* Icon */}
        <div className="mb-4">
          {IconComponent && (
            <IconComponent 
              className={cn(
                'w-12 h-12 md:w-16 md:h-16',
                'transition-transform duration-200',
                isHovered && 'scale-110'
              )}
              strokeWidth={1.5}
              aria-hidden="true"
            />
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-bold mb-2">
          {mode.title}
        </h3>

        {/* Short Description */}
        <p className="text-sm md:text-base opacity-90">
          {mode.shortDescription}
        </p>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
          </div>
        )}
      </div>

      {/* Hover Glow Effect */}
      <div 
        className={cn(
          'absolute inset-0 rounded-2xl transition-opacity duration-200',
          'bg-white/10',
          isHovered ? 'opacity-100' : 'opacity-0'
        )}
        aria-hidden="true"
      />
    </button>
  );
}
