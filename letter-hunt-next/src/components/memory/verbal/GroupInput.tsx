'use client';

import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import type { WordGroup } from '@/types/verbal-memory';

interface GroupInputProps {
  groups: WordGroup[];
  userInputs: string[];
  onInputChange: (index: number, value: string) => void;
  className?: string;
}

export function GroupInput({
  groups,
  userInputs,
  onInputChange,
  className,
}: GroupInputProps) {
  return (
    <Card className={cn('p-6', className)}>
      <h2 className="text-lg font-semibold text-text-primary mb-6 text-center">
        Escriba las palabras en el grupo correspondiente
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        {groups.map((group, groupIndex) => (
          <div key={group.id} className="flex flex-col">
            <div className="bg-primary-100 border border-primary-200 rounded-t-lg p-3 text-center">
              <span className="text-sm font-semibold text-primary-700">
                {group.name}
              </span>
            </div>
            <div className="flex-1 bg-surface-elevated border border-t-0 border-border-soft rounded-b-lg p-2 space-y-2 min-h-[200px]">
              {[0, 1, 2, 3].map((inputIndex) => {
                const globalIndex = groupIndex * 4 + inputIndex;
                return (
                  <input
                    key={inputIndex}
                    type="text"
                    value={userInputs[globalIndex] || ''}
                    onChange={(e) => onInputChange(globalIndex, e.target.value)}
                    className={cn(
                      'w-full px-2 py-1.5 rounded text-center text-sm',
                      'bg-white border border-border-standard',
                      'text-text-primary',
                      'placeholder:text-text-tertiary',
                      'focus:outline-none focus:ring-1 focus:ring-primary-300 focus:border-primary-400',
                      'transition-all duration-150'
                    )}
                    placeholder={`Palabra ${inputIndex + 1}`}
                    maxLength={20}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
