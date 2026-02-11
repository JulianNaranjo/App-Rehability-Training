'use client';

/**
 * Dashboard Container Component - Clinical Design
 * 
 * Main dashboard layout with clean clinical styling.
 * Implements the "Mejora atención" and "Mejorar memoria" sections.
 * 
 * @module DashboardContainer
 */

import { GameModeCard } from './GameModeCard';
import { GameInstructions } from './GameInstructions';
import { dashboardConfig, isAttentionGameMode } from '@/skills/dashboard/dashboard-logic';
import { cn } from '@/lib/utils';
import { Brain, Sparkles } from 'lucide-react';

interface DashboardContainerProps {
  className?: string;
}

export function DashboardContainer({ className }: DashboardContainerProps) {
  const getModeHref = (modeId: string): string => {
    if (isAttentionGameMode(modeId)) {
      return `/game/${modeId}`;
    }
    return '';
  };

  const isModeAvailable = (modeId: string): boolean => {
    return isAttentionGameMode(modeId);
  };

  return (
    <div className={cn('space-y-12', className)}>
      {/* Dashboard Header - Clinical */}
      <header className="text-center py-8">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary-50">
            <Brain className="w-6 h-6 text-primary-600" strokeWidth={1.5} />
          </div>
          <span className="text-sm font-medium text-text-secondary uppercase tracking-wider">
            Rehabilitación Cognitiva
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold text-text-primary tracking-tight">
          {dashboardConfig.appTitle}
        </h1>
        <p className="mt-3 text-text-secondary max-w-2xl mx-auto">
          Ejercicios diseñados para mejorar la atención y memoria de manera estructurada y progresiva.
        </p>
      </header>

      {/* Sections - Clinical spacing */}
      <div className="space-y-10">
        {dashboardConfig.sections.map((section) => (
          <section
            key={section.id}
            className="bg-surface border border-border-standard rounded-xl p-6 md:p-8"
            aria-labelledby={`section-${section.id}`}
          >
            {/* Section Header - Clinical hierarchy */}
            <div className="mb-8 pb-6 border-b border-border-soft">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-1.5 rounded-md bg-surface-elevated">
                  <Sparkles className="w-4 h-4 text-primary-500" strokeWidth={1.5} />
                </div>
                <h2
                  id={`section-${section.id}`}
                  className="text-xl md:text-2xl font-semibold text-text-primary"
                >
                  {section.title}
                </h2>
              </div>
              <p className="text-text-secondary text-base pl-8">
                {section.description}
              </p>
            </div>

            {/* Game Mode Cards Grid - Clinical spacing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {section.gameModes.map((mode) => (
                <GameModeCard
                  key={mode.id}
                  mode={mode}
                  href={getModeHref(mode.id)}
                  isComingSoon={!isModeAvailable(mode.id)}
                />
              ))}
            </div>

            {/* Instructions - Clinical subtle */}
            <div className="space-y-3">
              {section.gameModes.map((mode) => (
                <GameInstructions
                  key={`${section.id}-${mode.id}`}
                  mode={mode}
                  bgLight="bg-surface-elevated"
                  bgDark="bg-surface-elevated"
                  textLight="text-text-secondary"
                  textDark="text-text-secondary"
                  titleLight="text-text-primary"
                  titleDark="text-text-primary"
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
