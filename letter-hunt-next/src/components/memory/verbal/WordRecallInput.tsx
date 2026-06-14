'use client';

/**
 * Word Recall Input Component
 * 
 * Input fields for the user to write the words they remember.
 * 
 * @module WordRecallInput
 */

import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import type { VerbalMemoryLevel } from '@/types/verbal-memory';

interface WordRecallInputProps {
  inputCount: number;
  userInputs: string[];
  onInputChange: (index: number, value: string) => void;
  level: VerbalMemoryLevel;
  className?: string;
}

export function WordRecallInput({
  inputCount,
  userInputs,
  onInputChange,
  level,
  className,
}: WordRecallInputProps) {
  const getTitle = () => {
    return level === 1
      ? 'Escriba las palabras que recuerde'
      : 'Ordene las palabras alfabéticamente';
  };

  const getSubtitle = () => {
    return level === 1
      ? 'Ingrese las palabras en el orden que las recuerde'
      : 'Escriba las palabras en orden alfabético (A-Z)';
  };

  return (
    <Card className={cn('p-6', className)}>
      <h2 className="text-lg font-semibold text-text-primary mb-4 text-center">
        {getTitle()}
      </h2>

      <p className="text-sm text-text-secondary mb-6 text-center">
        {getSubtitle()}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Array.from({ length: inputCount }).map((_, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className="text-sm font-medium text-text-secondary w-6 text-right flex-shrink-0">
              {index + 1}.
            </span>
            <input
              type="text"
              value={userInputs[index] || ''}
              onChange={(e) => onInputChange(index, e.target.value)}
              className={cn(
                'flex-1 px-3 py-2 rounded-lg',
                'bg-surface-elevated border border-border-standard',
                'text-text-primary text-base',
                'placeholder:text-text-tertiary',
                'focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400',
                'transition-all duration-150'
              )}
              placeholder={`Palabra ${index + 1}`}
              maxLength={20}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
