'use client';

import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import type { VerbalMemoryWord } from '@/types/verbal-memory';

interface WordTableDisplayProps {
  words: VerbalMemoryWord[];
  className?: string;
}

export function WordTableDisplay({ words, className }: WordTableDisplayProps) {
  return (
    <Card className={cn('p-6', className)}>
      <h2 className="text-lg font-semibold text-text-primary mb-4 text-center">
        LEA CON ATENCIÓN LAS SIGUIENTES PALABRAS
      </h2>
      
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
        {words.map((item) => (
          <div
            key={item.number}
            className="flex items-center justify-center p-3 rounded-lg bg-surface-elevated border border-border-soft min-h-[50px]"
          >
            <span className="text-base font-medium text-text-primary text-center">
              {item.word}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
