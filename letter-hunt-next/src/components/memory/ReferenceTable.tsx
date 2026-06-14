'use client';

/**
 * Reference Table Component
 *
 * Displays the number-to-letter mapping table (2x10).
 * Used for memorization before playing.
 *
 * @module ReferenceTable
 */

import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';
import type { NumberLetterMapping } from '@/types/working-memory';

interface ReferenceTableProps {
  mapping: NumberLetterMapping;
  isVisible: boolean;
  onToggle: () => void;
  className?: string;
}

export function ReferenceTable({ mapping, isVisible, onToggle, className }: ReferenceTableProps) {
  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  return (
    <div className={cn('w-full max-w-2xl mx-auto', className)}>
      <div
        className={cn(
          'bg-surface-elevated border rounded-xl p-6 shadow-sm transition-all duration-300',
          isVisible ? 'border-border-standard' : 'border-border-soft'
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">
            Tabla de Referencia
          </h3>
          <button
            onClick={onToggle}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              isVisible
                ? 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                : 'bg-surface text-text-secondary hover:bg-surface-elevated border border-border-soft'
            )}
          >
            {isVisible ? (
              <>
                <EyeOff className="w-4 h-4" />
                Ocultar
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Mostrar
              </>
            )}
          </button>
        </div>

        {isVisible ? (
          <>
            {/* Fila de números */}
            <div className="grid grid-cols-10 gap-2 mb-3">
              {numbers.map((num) => (
                <div
                  key={`num-${num}`}
                  className={cn(
                    'aspect-square flex items-center justify-center',
                    'bg-primary-100 text-primary-700',
                    'rounded-lg text-lg font-bold',
                    'border-2 border-primary-200'
                  )}
                >
                  {num}
                </div>
              ))}
            </div>

            {/* Fila de letras */}
            <div className="grid grid-cols-10 gap-2">
              {numbers.map((num) => (
                <div
                  key={`letter-${num}`}
                  className={cn(
                    'aspect-square flex items-center justify-center',
                    'bg-secondary-100 text-secondary-700',
                    'rounded-lg text-lg font-bold',
                    'border-2 border-secondary-200'
                  )}
                >
                  {mapping[num] || '?'}
                </div>
              ))}
            </div>

            <p className="text-center text-sm text-text-secondary mt-4">
              Memoriza esta tabla y ocúltala cuando estés listo
            </p>
          </>
        ) : (
          <div
            onClick={onToggle}
            className="py-12 flex flex-col items-center justify-center cursor-pointer hover:bg-surface rounded-lg transition-colors"
          >
            <Eye className="w-12 h-12 text-text-tertiary mb-3" />
            <p className="text-text-secondary font-medium">
              Tabla oculta
            </p>
            <p className="text-sm text-text-tertiary mt-1">
              Haz clic para mostrar la referencia
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
