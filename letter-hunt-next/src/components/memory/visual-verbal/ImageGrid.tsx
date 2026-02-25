'use client';

import { VisoVerbalItem } from '@/types/visual-verbal';
import { cn } from '@/lib/utils';

interface ImageGridProps {
  items: VisoVerbalItem[];
  showNames?: boolean;
  className?: string;
}

export function ImageGrid({ items, showNames = true, className }: ImageGridProps) {
  return (
    <div className={cn('grid grid-cols-2 gap-4 max-w-md mx-auto', className)}>
      {items.map((item) => (
        <div
          key={item.id}
          className="flex flex-col items-center p-4 bg-surface-elevated rounded-xl border border-border-soft"
        >
          <div className="w-32 h-32 flex items-center justify-center mb-3">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
          {showNames && (
            <span className="text-lg font-medium text-text-primary">
              {item.name}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
