'use client';

/**
 * Game Mode Card Component - Clinical Design
 * 
 * Interactive card for selecting a game mode using Next.js Link.
 * Features clean clinical styling with subtle interactions.
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
  Brain,
  type LucideIcon
} from 'lucide-react';

// Map icon names to Lucide components
const iconMap: Record<string, LucideIcon> = {
  MousePointerClick,
  Calculator,
  Eye,
  Layers,
  Brain,
};

interface GameModeCardProps {
  mode: GameModeConfig;
  href: string;
  isComingSoon?: boolean;
  className?: string;
}

export function GameModeCard({ 
  mode, 
  href,
  isComingSoon = false,
  className 
}: GameModeCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const IconComponent = iconMap[mode.icon];

  const cardContent = (
    <>
      <div className="flex flex-col items-center text-center">
        {/* Icon - Clinical subtle */}
        <div className="mb-4">
          {IconComponent && (
            <div className={cn(
              'p-3 rounded-xl transition-all duration-200',
              'bg-primary-50 text-primary-600',
              isHovered && !isComingSoon && 'bg-primary-100'
            )}>
              <IconComponent 
                className="w-8 h-8"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </div>
          )}
        </div>

        {/* Title - Clinical hierarchy */}
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          {mode.title}
        </h3>

        {/* Description - Clinical secondary */}
        <p className="text-sm text-text-secondary leading-relaxed">
          {mode.shortDescription}
        </p>

        {/* Coming Soon Badge - Clinical */}
        {isComingSoon && (
          <span className="mt-4 px-3 py-1 bg-surface-elevated border border-border-soft rounded-full text-xs font-medium text-text-tertiary">
            Próximamente
          </span>
        )}
      </div>
    </>
  );

  const cardClasses = cn(
    // Base styles - Clinical clean
    'relative w-full rounded-xl p-6',
    'bg-surface border border-border-standard',
    'transition-all duration-200 ease-out',
    'focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2',
    
    // Hover effects - Clinical subtle
    isComingSoon 
      ? 'opacity-60 cursor-not-allowed' 
      : 'hover:border-primary-300 hover:shadow-sm cursor-pointer',
    
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
