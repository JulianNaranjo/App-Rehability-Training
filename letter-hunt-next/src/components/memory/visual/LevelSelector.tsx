'use client';

import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Eye } from 'lucide-react';

interface LevelSelectorProps {
  currentLevel: 1;
  onSelectLevel: (level: 1) => void;
  className?: string;
}

const levelConfig = {
  1: {
    title: 'Nivel 1',
    subtitle: 'Figuras Básicas',
    description: 'Memoriza 9 figuras geométricas',
    icon: Eye,
    color: 'bg-warning-100 text-warning-700 border-warning-200',
    hoverColor: 'hover:bg-warning-200',
  },
};

export function LevelSelector({
  currentLevel,
  onSelectLevel,
  className,
}: LevelSelectorProps) {
  const levels: 1[] = [1];

  return (
    <Card className={cn('p-4', className)}>
      <h3 className="text-sm font-semibold text-text-secondary mb-3 uppercase tracking-wide">
        Seleccionar Nivel
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
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
                isActive && 'ring-2 ring-offset-2 ring-warning-400'
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
        Memoriza las figuras y luego dibújalas en la pizarra
      </p>
    </Card>
  );
}
