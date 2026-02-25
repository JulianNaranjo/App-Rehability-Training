'use client';

import { useState, useEffect } from 'react';
import { VisoVerbalItem } from '@/types/visual-verbal';
import { cn } from '@/lib/utils';

interface NameInputProps {
  items: VisoVerbalItem[];
  answers: string[];
  onAnswerChange: (index: number, answer: string) => void;
  onSubmit: () => void;
  correctAnswers: string[];
  showResults?: boolean;
  className?: string;
}

export function NameInput({
  items,
  answers,
  onAnswerChange,
  onSubmit,
  correctAnswers,
  showResults = false,
  className,
}: NameInputProps) {
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const allFilled = answers.every(a => a.trim().length > 0);
    setIsValid(allFilled);
  }, [answers]);

  const getInputClass = (index: number) => {
    if (!showResults) return 'border-border-soft';
    
    const userAnswer = answers[index]?.trim().toLowerCase();
    const correct = correctAnswers[index];
    
    if (userAnswer === correct) {
      return 'border-success-500 bg-success-50';
    }
    return 'border-error-500 bg-error-50';
  };

  const getResultIcon = (index: number) => {
    if (!showResults) return null;
    
    const userAnswer = answers[index]?.trim().toLowerCase();
    const correct = correctAnswers[index];
    
    if (userAnswer === correct) {
      return (
        <span className="text-success-500">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </span>
      );
    }
    return (
      <span className="text-error-500">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </span>
    );
  };

  const getCorrectAnswer = (index: number) => {
    if (!showResults) return null;
    const userAnswer = answers[index]?.trim().toLowerCase();
    const correct = correctAnswers[index];
    
    if (userAnswer !== correct) {
      return (
        <span className="text-xs text-success-600 mt-1">
          Correcto: {correctAnswers[index]}
        </span>
      );
    }
    return null;
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        {items.map((item, index) => (
          <div key={item.id} className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-12 h-12 flex items-center justify-center bg-surface-elevated rounded-lg border border-border-soft">
                <img
                  src={item.imageUrl}
                  alt={`Imagen ${index + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              {getResultIcon(index)}
            </div>
            <input
              type="text"
              value={answers[index]}
              onChange={(e) => onAnswerChange(index, e.target.value)}
              placeholder={`Nombre ${index + 1}`}
              disabled={showResults}
              className={cn(
                'w-full px-3 py-2 rounded-lg border-2 bg-white text-text-primary',
                'placeholder:text-text-muted focus:outline-none focus:ring-2',
                'focus:ring-primary-400 focus:border-primary-400',
                getInputClass(index)
              )}
            />
            {getCorrectAnswer(index)}
          </div>
        ))}
      </div>

      {!showResults && (
        <div className="flex justify-center mt-6">
          <button
            onClick={onSubmit}
            disabled={!isValid}
            className={cn(
              'px-8 py-3 rounded-lg font-medium transition-colors',
              isValid
                ? 'bg-primary-500 text-white hover:bg-primary-600'
                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
            )}
          >
            Verificar Respuestas
          </button>
        </div>
      )}
    </div>
  );
}
