'use client';

/**
 * Level Selector Component
 * 
 * Allows user to select between Level 1 (recall) and Level 2 (alphabetical).
 * 
 * @module LevelSelector
 */

import { cn } from '@/lib/utils';
import type { VerbalMemoryLevel } from '@/types/verbal-memory';

interface LevelSelectorProps {
  currentLevel: VerbalMemoryLevel;
  onSelectLevel: (level: VerbalMemoryLevel) => void;
  className?: string;
}

const levels: { id: VerbalMemoryLevel; title: string; description: string }[] = [
  {
    id: 1,
    title: 'Nivel 1',
    description: 'Recordar palabras',
  },
  {
    id: 2,
    title: 'Nivel 2',
    description: 'Ordenar alfabéticamente',
  },
  {
    id: 3,
    title: 'Nivel 3',
    description: 'Crear frases',
  },
  {
    id: 5,
    title: 'Nivel 5',
    description: 'Recordar palabras',
  },
  {
    id: 6,
    title: 'Nivel 6',
    description: 'Agrupar palabras',
  },
];

export function LevelSelector({
  currentLevel,
  onSelectLevel,
  className,
}: LevelSelectorProps) {
  return (
    <div className={cn('flex gap-2', className)}>
      {levels.map((level) => (
        <button
          key={level.id}
          onClick={() => onSelectLevel(level.id)}
          className={cn(
            'flex-1 px-4 py-3 rounded-lg border transition-all duration-200',
            'text-left',
            currentLevel === level.id
              ? 'bg-primary-50 border-primary-300 text-primary-700'
              : 'bg-surface border-border-standard text-text-secondary hover:border-primary-200 hover:bg-primary-25'
          )}
        >
          <div className="font-medium text-sm">{level.title}</div>
          <div className="text-xs opacity-75">{level.description}</div>
        </button>
      ))}
    </div>
  );
}
