'use client';

/**
 * Word List Display Component
 * 
 * Displays the list of words to memorize.
 * 
 * @module WordListDisplay
 */

import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import type { VerbalMemoryWord } from '@/types/verbal-memory';

interface WordListDisplayProps {
  words: VerbalMemoryWord[];
  className?: string;
}

export function WordListDisplay({ words, className }: WordListDisplayProps) {
  return (
    <Card className={cn('p-6', className)}>
      <h2 className="text-lg font-semibold text-text-primary mb-4 text-center">
        LEA CON ATENCIÓN LAS SIGUIENTES PALABRAS
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {words.map((item) => (
          <div
            key={item.number}
            className="flex items-center gap-3 p-2 rounded-lg bg-surface-elevated border border-border-soft"
          >
            <span className="text-sm font-medium text-text-secondary w-6 text-right">
              {item.number}.
            </span>
            <span className="text-base font-medium text-text-primary">
              {item.word}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
