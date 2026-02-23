'use client';

/**
 * Series Input Component
 *
 * Input fields for the user to enter the series.
 * Used for both normal and reverse order input.
 *
 * @module SeriesInput
 */

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { CheckCircle2 } from 'lucide-react';

interface SeriesInputProps {
  inputs: string[];
  label: string;
  onInputChange: (index: number, value: string) => void;
  onValidate: () => void;
  className?: string;
}

export function SeriesInput({
  inputs,
  label,
  onInputChange,
  onValidate,
  className,
}: SeriesInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const allFilled = inputs.every(input => input.length > 0);
  const length = inputs.length;

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !inputs[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'Enter' && allFilled) {
      onValidate();
    }
  };

  const handleChange = (index: number, value: string) => {
    const digitValue = value.replace(/[^0-9]/g, '').slice(-1);
    onInputChange(index, digitValue);
    
    if (digitValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  return (
    <div className={cn('flex flex-col items-center gap-6', className)}>
      <div className="text-center">
        <h2 className="text-lg font-semibold text-text-primary mb-2">
          {label}
        </h2>
        <p className="text-sm text-text-secondary">
          Ingresa los {length} dígitos
        </p>
      </div>

      <div className="flex items-center justify-center gap-4">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={inputs[index] || ''}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={cn(
              'w-20 h-20 rounded-xl',
              'text-4xl font-bold text-center',
              'bg-surface-elevated border-4 border-border-standard',
              'focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200',
              'transition-all duration-200',
              inputs[index] && 'border-primary-300 bg-primary-50'
            )}
            aria-label={`Dígito ${index + 1}`}
          />
        ))}
      </div>

      <Button
        onClick={onValidate}
        disabled={!allFilled}
        size="lg"
        className="min-w-[200px] mt-4"
      >
        <CheckCircle2 className="w-5 h-5 mr-2" />
        Validar
      </Button>

      {!allFilled && (
        <p className="text-sm text-text-secondary">
          Completa todos los dígitos para validar
        </p>
      )}
    </div>
  );
}
