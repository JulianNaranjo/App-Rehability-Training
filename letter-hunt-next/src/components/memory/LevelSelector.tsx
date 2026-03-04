'use client';

/**
 * Level Selector Component
 *
 * Allows users to select which level to play (1-7).
 * All levels are available from the start.
 *
 * @module LevelSelector
 */

import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Brain, GraduationCap, Sparkles, Hash, Star, Trophy, Layers } from 'lucide-react';

interface LevelSelectorProps {
  currentLevel: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  onSelectLevel: (level: 1 | 2 | 3 | 4 | 5 | 6 | 7) => void;
  className?: string;
}

const levelConfig = {
  1: {
    title: 'Nivel 1',
    subtitle: 'Números y Letras',
    description: 'Memoriza la tabla de números y letras',
    icon: Brain,
    color: 'bg-primary-100 text-primary-700 border-primary-200',
    hoverColor: 'hover:bg-primary-200',
  },
  2: {
    title: 'Nivel 2',
    subtitle: 'Memoria Pura',
    description: 'Recuerda las letras de memoria',
    icon: GraduationCap,
    color: 'bg-secondary-100 text-secondary-700 border-secondary-200',
    hoverColor: 'hover:bg-secondary-200',
  },
  3: {
    title: 'Nivel 3',
    subtitle: 'Sílabas',
    description: 'Memoriza sílabas (consonante+vocal)',
    icon: Sparkles,
    color: 'bg-warning-100 text-warning-700 border-warning-200',
    hoverColor: 'hover:bg-warning-200',
  },
  4: {
    title: 'Nivel 4',
    subtitle: 'Sílabas Pura',
    description: 'Recuerda las sílabas de memoria',
    icon: Star,
    color: 'bg-accent-100 text-accent-700 border-accent-200',
    hoverColor: 'hover:bg-accent-200',
  },
  5: {
    title: 'Nivel 5',
    subtitle: 'Símbolos',
    description: 'Memoriza símbolos matemáticos',
    icon: Hash,
    color: 'bg-error-100 text-error-700 border-error-200',
    hoverColor: 'hover:bg-error-200',
  },
  6: {
    title: 'Nivel 6',
    subtitle: 'Símbolos Pura',
    description: 'Recuerda los símbolos de memoria',
    icon: Trophy,
    color: 'bg-success-100 text-success-700 border-success-200',
    hoverColor: 'hover:bg-success-200',
  },
  7: {
    title: 'Nivel 7',
    subtitle: 'Series',
    description: 'Memoriza series de números',
    icon: Layers,
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    hoverColor: 'hover:bg-purple-200',
  },
};

export function LevelSelector({
  currentLevel,
  onSelectLevel,
  className,
}: LevelSelectorProps) {
  const levels: (1 | 2 | 3 | 4 | 5 | 6 | 7)[] = [1, 2, 3, 4, 5, 6, 7];

  return (
    <Card className={cn('p-4', className)}>
      <h3 className="text-sm font-semibold text-text-secondary mb-3 uppercase tracking-wide">
        Seleccionar Nivel
      </h3>
      <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
        {levels.map((level) => {
          const config = levelConfig[level];
          const Icon = config.icon;
          const isActive = currentLevel === level;

          return (
            <button
              key={level}
              onClick={() => onSelectLevel(level)}
              className={cn(
                'relative p-3 rounded-lg border-2 transition-all duration-200 text-left cursor-pointer',
                config.color,
                config.hoverColor,
                isActive && 'ring-2 ring-offset-2 ring-primary-400'
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm">{config.title}</p>
                <p className="text-xs opacity-75">{config.subtitle}</p>
              </div>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-text-tertiary mt-3 text-center">
        Completa un nivel con 80% o más para desbloquear el botón de continuar
      </p>
    </Card>
  );
}
