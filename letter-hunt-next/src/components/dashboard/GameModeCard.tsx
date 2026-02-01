'use client';

/**
 * Game Mode Card Component
 * 
 * Interactive card for selecting a game mode using Next.js Link.
 * Features gradient background, icon, and hover effects.
 * 
 * @module GameModeCard
 */

import Link from 'next/link';
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
  /** URL to navigate to when clicked */
  href: string;
  /** Whether the mode is coming soon (disabled) */
  isComingSoon?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Game Mode Card - Interactive selection card with Next.js Link
 * 
 * Displays a game mode with gradient background, icon,
 * and interactive hover/click states. Uses Next.js Link
 * for client-side navigation.
 */
export function GameModeCard({ 
  mode, 
  href,
  isComingSoon = false,
  className 
}: GameModeCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Get the icon component
  const IconComponent = iconMap[mode.icon];

  const cardContent = (
    <>
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

        {/* Coming Soon Badge */}
        {isComingSoon && (
          <span className="mt-3 px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
            Próximamente
          </span>
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
    </>
  );

  const cardClasses = cn(
    // Base styles
    'relative w-full rounded-2xl p-6 md:p-8',
    'transition-all duration-200 ease-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    
    // Gradient background - using complete Tailwind classes
    'bg-gradient-to-r',
    mode.gradientFrom,
    mode.gradientTo,
    
    // Hover effects - scale and shadow
    isComingSoon ? 'opacity-60 cursor-not-allowed' : 'hover:scale-[1.02] cursor-pointer',
    
    // Text color for gradient backgrounds
    'text-white',
    
    // Display as block for Link
    'block text-center',
    
    className
  );

  if (isComingSoon) {
    return (
      <div
        className={cardClasses}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {cardContent}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={cardClasses}
      aria-label={`Jugar ${mode.title}: ${mode.shortDescription}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {cardContent}
    </Link>
  );
}
