'use client';

import { cn } from '@/lib/utils';
import {
  Star,
  Circle,
  Square,
  Triangle,
  Heart,
  Diamond,
  Hexagon,
  Moon,
  Sun,
  Cloud,
  Zap,
  Flower,
  Trees,
  Home,
  Car,
  Bird,
  Fish,
  Cat,
  Dog,
  Smile,
} from 'lucide-react';
import { SpatialIconId } from '@/store/visual-spatial-memory-store';

export type { SpatialIconId };

/**
 * Map icon IDs to Lucide React components
 */
const ICON_MAP: Record<SpatialIconId, React.ComponentType<{ className?: string }>> = {
  star: Star,
  circle: Circle,
  square: Square,
  triangle: Triangle,
  heart: Heart,
  diamond: Diamond,
  hexagon: Hexagon,
  moon: Moon,
  sun: Sun,
  cloud: Cloud,
  lightning: Zap,
  flower: Flower,
  tree: Trees,
  house: Home,
  car: Car,
  bird: Bird,
  fish: Fish,
  cat: Cat,
  dog: Dog,
  smile: Smile,
};

/**
 * Get Lucide icon component from icon ID
 */
export function getIconComponent(iconId: SpatialIconId) {
  return ICON_MAP[iconId] || Star;
}

interface SpatialGridProps {
  /** Number of cells in the grid (default: 20) */
  cells?: number;
  /** Callback when a cell is clicked */
  onCellClick?: (index: number) => void;
  /** Array of selected cell indices */
  selectedCells?: number[];
  /** Array of highlighted cell indices (correct answers) */
  highlightedCells?: number[];
  /** Whether the grid is disabled */
  disabled?: boolean;
  /** Icon IDs to display in the grid */
  iconIds?: string[];
  /** Show icons during memorize phase */
  showIcons?: boolean;
  /** Show highlighted cells (for results phase) */
  showHighlight?: boolean;
  className?: string;
}

/**
 * SpatialGrid - A 4x5 grid component for the visual-spatial memory game
 */
export function SpatialGrid({
  cells = 20,
  onCellClick,
  selectedCells = [],
  highlightedCells = [],
  disabled = false,
  iconIds = [],
  showIcons = false,
  showHighlight = false,
  className,
}: SpatialGridProps) {
  const handleCellClick = (index: number) => {
    if (disabled) return;
    onCellClick?.(index);
  };

  return (
    <div
      className={cn(
        'grid gap-1 sm:gap-2 w-full max-w-sm mx-auto',
        'grid-cols-5',
        className
      )}
    >
      {Array.from({ length: cells }).map((_, index) => {
        const isSelected = selectedCells.includes(index);
        const isHighlighted = showHighlight && highlightedCells.includes(index);
        const iconId = iconIds[index] as SpatialIconId | undefined;
        const IconComponent = iconId ? getIconComponent(iconId) : null;

        return (
          <button
            key={index}
            onClick={() => handleCellClick(index)}
            disabled={disabled}
            className={cn(
              // Base styles - smaller aspect square cells
              'aspect-square rounded-md border-2 transition-all duration-200',
              'flex items-center justify-center p-1',
              'focus:outline-none focus:ring-2 focus:ring-offset-1',
              
              // Default state
              'bg-surface border-border-soft',
              'hover:bg-surface-elevated hover:border-border-standard',
              
              // Selected state (user's guess)
              isSelected && [
                'bg-warning-100 border-warning-400',
                'hover:bg-warning-200 hover:border-warning-500',
              ],
              
              // Highlighted state (correct answer - shown in results)
              isHighlighted && [
                'bg-success-100 border-success-400',
              ],
              
              // Both selected and highlighted (correct guess)
              isSelected && isHighlighted && [
                'bg-success-200 border-success-500',
              ],
              
              // Disabled state
              disabled && [
                'opacity-60 cursor-not-allowed',
                'hover:bg-surface hover:border-border-soft',
              ],
              
              // Focus ring
              !disabled && 'focus:ring-warning-400 focus:border-warning-300',
            )}
            aria-label={`Celda ${index + 1}${isSelected ? ' seleccionada' : ''}`}
          >
            {showIcons && IconComponent && (
              <IconComponent
                className={cn(
                  'w-5 h-5 sm:w-6 sm:h-6',
                  isHighlighted ? 'text-success-600' : 'text-warning-600'
                )}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
