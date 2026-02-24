'use client';

import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import type { VerbalMemoryLevel } from '@/types/verbal-memory';

interface WordTableInputProps {
  inputCount: number;
  userInputs: string[];
  onInputChange: (index: number, value: string) => void;
  level: VerbalMemoryLevel;
  className?: string;
}

export function WordTableInput({
  inputCount,
  userInputs,
  onInputChange,
  level,
  className,
}: WordTableInputProps) {
  const getTitle = () => {
    return 'Escriba las palabras que recuerde';
  };

  return (
    <Card className={cn('p-6', className)}>
      <h2 className="text-lg font-semibold text-text-primary mb-4 text-center">
        {getTitle()}
      </h2>

      <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
        {Array.from({ length: inputCount }).map((_, index) => (
          <div key={index} className="flex items-center">
            <input
              type="text"
              value={userInputs[index] || ''}
              onChange={(e) => onInputChange(index, e.target.value)}
              className={cn(
                'w-full px-2 py-2 rounded-lg text-center',
                'bg-surface-elevated border border-border-standard',
                'text-text-primary text-base font-medium',
                'placeholder:text-text-tertiary placeholder:text-sm',
                'focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400',
                'transition-all duration-150'
              )}
              placeholder={`${index + 1}`}
              maxLength={20}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
