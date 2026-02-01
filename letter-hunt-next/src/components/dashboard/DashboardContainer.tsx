'use client';

/**
 * Dashboard Container Component
 * 
 * Main dashboard layout containing all rehabilitation sections.
 * Implements the "Mejora atención" and "Mejorar memoria" sections
 * with game mode cards and instructions.
 * 
 * @module DashboardContainer
 */

import { GameModeCard } from './GameModeCard';
import { GameInstructions } from './GameInstructions';
import { dashboardConfig, isAttentionGameMode } from '@/skills/dashboard/dashboard-logic';
import { cn } from '@/lib/utils';

interface DashboardContainerProps {
  className?: string;
}

/**
 * Dashboard Container - Main rehabilitation dashboard
 * 
 * Displays sections for attention and memory improvement
 * with interactive game mode cards that navigate to game pages.
 */
export function DashboardContainer({ className }: DashboardContainerProps) {
  /**
   * Get the route URL for a game mode
   */
  const getModeHref = (modeId: string): string => {
    if (isAttentionGameMode(modeId)) {
      return `/game/${modeId}`;
    }
    // Memory modes - no route yet, return empty string
    return '';
  };

  /**
   * Check if a mode is available (implemented)
   */
  const isModeAvailable = (modeId: string): boolean => {
    return isAttentionGameMode(modeId);
  };

  return (
    <div className={cn('space-y-8', className)}>
      {/* Dashboard Title */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
          {dashboardConfig.appTitle}
        </h1>
      </header>

      {/* Sections */}
      <div className="space-y-12">
        {dashboardConfig.sections.map((section) => (
          <section
            key={section.id}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8"
            aria-labelledby={`section-${section.id}`}
          >
            {/* Section Header */}
            <div className="mb-6">
              <h2
                id={`section-${section.id}`}
                className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2"
              >
                {section.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                {section.description}
              </p>
            </div>

            {/* Game Mode Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {section.gameModes.map((mode) => (
                <GameModeCard
                  key={mode.id}
                  mode={mode}
                  href={getModeHref(mode.id)}
                  isComingSoon={!isModeAvailable(mode.id)}
                />
              ))}
            </div>

            {/* Instructions */}
            <div className="space-y-4">
              {section.gameModes.map((mode) => (
                <GameInstructions
                  key={`${section.id}-${mode.id}`}
                  mode={mode}
                  bgLight={section.instructionBgLight}
                  bgDark={section.instructionBgDark}
                  textLight={section.instructionTextLight}
                  textDark={section.instructionTextDark}
                  titleLight={section.instructionTitleLight}
                  titleDark={section.instructionTitleDark}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
