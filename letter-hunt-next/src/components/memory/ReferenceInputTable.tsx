'use client';

/**
 * Reference Input Table Component
 *
 * For Level 2: User must fill in the letters for numbers 1-0 from memory.
 * Shows numbers in first row, inputs in second row.
 *
 * @module ReferenceInputTable
 */

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import type { ReferenceValidationResult } from '@/types/working-memory';

interface ReferenceInputTableProps {
  numbers: string[];
  userInputs: string[];
  isValidated: boolean;
  validationResult: ReferenceValidationResult | null;
  onInputChange: (index: number, value: string) => void;
  onValidate: () => void;
  onContinue: () => void;
  className?: string;
}

export function ReferenceInputTable({
  numbers,
  userInputs,
  isValidated,
  validationResult,
  onInputChange,
  onValidate,
  onContinue,
  className,
}: ReferenceInputTableProps) {
  const allFilled = userInputs.every((input) => input.length > 0);

  return (
    <Card className={cn('p-6', className)}>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-text-primary mb-2">
          Nivel 2: Recuerda las Letras
        </h2>
        <p className="text-text-secondary">
          Escribe la letra que corresponde a cada número. Debes acertar todas para continuar.
        </p>
      </div>

      {/* Numbers row */}
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

      {/* Letters input row */}
      <div className="grid grid-cols-10 gap-2 mb-6">
        {numbers.map((num, index) => {
          const value = userInputs[index] || '';
          let cellStatus = 'empty';

          if (isValidated && validationResult) {
            const letterResult = validationResult.letters[index];
            cellStatus = letterResult.isCorrect ? 'correct' : 'incorrect';
          }

          return (
            <div key={`input-${num}`} className="relative">
              <input
                type="text"
                maxLength={1}
                value={value}
                onChange={(e) => onInputChange(index, e.target.value)}
                disabled={isValidated}
                className={cn(
                  'w-full aspect-square flex items-center justify-center',
                  'text-center text-lg font-bold uppercase rounded-lg',
                  'border-2 transition-all duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-primary-300',
                  cellStatus === 'empty' && [
                    'bg-surface border-border-standard',
                    'text-text-primary',
                    'hover:border-primary-300',
                  ],
                  cellStatus === 'correct' && [
                    'bg-success-100 border-success-500',
                    'text-success-700',
                  ],
                  cellStatus === 'incorrect' && [
                    'bg-error-100 border-error-500',
                    'text-error-700',
                  ]
                )}
                aria-label={`Letra para el número ${num}`}
              />
              {isValidated && cellStatus === 'correct' && (
                <CheckCircle2 className="absolute -top-1 -right-1 w-4 h-4 text-success-500 bg-white rounded-full" />
              )}
              {isValidated && cellStatus === 'incorrect' && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 text-xs text-error-600 font-semibold whitespace-nowrap">
                  {validationResult?.letters[index].correctLetter}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Validation result */}
      {isValidated && validationResult && (
        <div
          className={cn(
            'mb-6 p-4 rounded-lg',
            validationResult.correct === 10
              ? 'bg-success-50 border border-success-200'
              : 'bg-error-50 border border-error-200'
          )}
        >
          <div className="flex items-center gap-2 mb-2">
            {validationResult.correct === 10 ? (
              <CheckCircle2 className="w-5 h-5 text-success-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-error-600" />
            )}
            <span
              className={cn(
                'font-semibold',
                validationResult.correct === 10
                  ? 'text-success-800'
                  : 'text-error-800'
              )}
            >
              {validationResult.correct === 10
                ? '¡Perfecto! Todas las letras son correctas'
                : `Tienes ${validationResult.incorrect} error${validationResult.incorrect === 1 ? '' : 'es'}`}
            </span>
          </div>
          <p className="text-sm text-text-secondary">
            Correctas: {validationResult.correct}/10
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex justify-center gap-4">
        {!isValidated ? (
          <Button
            onClick={onValidate}
            disabled={!allFilled}
            size="lg"
            className="min-w-[200px]"
          >
            <CheckCircle2 className="w-5 h-5 mr-2" />
            Validar Tabla
          </Button>
        ) : validationResult?.correct === 10 ? (
          <Button onClick={onContinue} size="lg" className="min-w-[200px]">
            Continuar al Tablero
          </Button>
        ) : (
          <Button
            onClick={onValidate}
            variant="secondary"
            size="lg"
            className="min-w-[200px]"
          >
            Reintentar
          </Button>
        )}
      </div>

      {!allFilled && !isValidated && (
        <p className="text-center text-sm text-text-secondary mt-4">
          Completa todas las casillas para validar
        </p>
      )}
    </Card>
  );
}
