'use client';

import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, Lightbulb } from 'lucide-react';
import type { SentenceInput, VerbalMemoryWord } from '@/types/verbal-memory';

interface SentenceInputProps {
  words: VerbalMemoryWord[];
  sentenceInputs: SentenceInput[];
  onSentenceChange: (index: number, sentence: string, detectedWords: string[]) => void;
  className?: string;
}

export function SentenceInputComponent({
  words,
  sentenceInputs,
  onSentenceChange,
  className,
}: SentenceInputProps) {
  const wordOptions = words.map(w => w.word.toUpperCase());

  const getUsedWordsFromOtherSentences = (currentIndex: number): string[] => {
    const used: string[] = [];
    sentenceInputs.forEach((input, index) => {
      if (index !== currentIndex) {
        const wordsInSentence = detectWordsInSentence(input.sentence);
        used.push(...wordsInSentence);
      }
    });
    return [...new Set(used)];
  };

  const detectWordsInSentence = (sentence: string): string[] => {
    const sentenceUpper = sentence.toUpperCase();
    const found: string[] = [];
    
    const wordsInSentence = sentenceUpper.split(/\s+/);
    const uniqueWords = [...new Set(wordsInSentence)];
    
    uniqueWords.forEach(word => {
      if (wordOptions.includes(word)) {
        found.push(word);
      }
    });
    
    return found;
  };

  const handleSentenceChange = (sentenceIndex: number, value: string) => {
    const detectedWords = detectWordsInSentence(value);
    onSentenceChange(sentenceIndex, value, detectedWords);
  };

  const getValidationStatus = (input: SentenceInput, usedWords: string[], currentIndex: number) => {
    const detectedWords = detectWordsInSentence(input.sentence);
    const hasSentence = input.sentence.trim().length > 0;
    
    if (!hasSentence) {
      return { status: 'pending', detectedWords: [] as string[], repeatedWords: [] as string[], missing: false };
    }

    const uniqueDetected = [...new Set(detectedWords)];
    const repeatedInOther = uniqueDetected.filter(w => usedWords.includes(w));
    
    if (uniqueDetected.length < 2) {
      return { status: 'incomplete', detectedWords: uniqueDetected, repeatedWords: repeatedInOther, missing: true };
    }

    if (repeatedInOther.length > 0) {
      return { status: 'error', detectedWords: uniqueDetected, repeatedWords: repeatedInOther, missing: false };
    }

    return { status: 'valid', detectedWords: uniqueDetected, repeatedWords: [], missing: false };
  };

  return (
    <Card className={cn('p-6', className)}>
      <div className="mb-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
        <div className="flex items-start gap-2">
          <Lightbulb className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-primary-800 font-medium mb-1">
              Cómo funciona:
            </p>
            <p className="text-sm text-primary-700">
              Escriba oraciones que contengan <strong>2 palabras diferentes</strong> de la lista. 
              No repita palabras entre oraciones. El sistema detectará automáticamente las palabras usadas.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {sentenceInputs.map((input, sentenceIndex) => {
          const usedWords = getUsedWordsFromOtherSentences(sentenceIndex);
          const validation = getValidationStatus(input, usedWords, sentenceIndex);

          return (
            <div key={sentenceIndex} className={cn(
              'p-4 rounded-lg border transition-all',
              validation.status === 'valid' 
                ? 'bg-success-50 border-success-200'
                : validation.status === 'error' 
                  ? 'bg-error-50 border-error-200'
                  : validation.status === 'incomplete'
                    ? 'bg-warning-50 border-warning-200'
                    : 'bg-surface-elevated border-border-soft'
            )}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-medium text-text-secondary flex-shrink-0">
                  Oración {sentenceIndex + 1}:
                </span>
                
                {validation.status === 'valid' && (
                  <div className="flex items-center gap-1 text-success-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs">Válida</span>
                  </div>
                )}
                {validation.status === 'error' && (
                  <div className="flex items-center gap-1 text-error-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-xs">Palabra ya usada</span>
                  </div>
                )}
                {validation.status === 'incomplete' && (
                  <div className="flex items-center gap-1 text-warning-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-xs">Necesitas 2 palabras</span>
                  </div>
                )}

                {validation.detectedWords.length > 0 && (
                  <div className="ml-auto flex gap-1">
                    {validation.detectedWords.map(word => (
                      <span 
                        key={word}
                        className={cn(
                          'text-xs px-2 py-0.5 rounded',
                          usedWords.includes(word) 
                            ? 'bg-error-100 text-error-700'
                            : 'bg-primary-100 text-primary-700'
                        )}
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <input
                type="text"
                value={input.sentence}
                onChange={(e) => handleSentenceChange(sentenceIndex, e.target.value)}
                className={cn(
                  'w-full px-3 py-2 rounded-lg',
                  'bg-white border',
                  'text-text-primary text-base',
                  'placeholder:text-text-tertiary',
                  'focus:outline-none focus:ring-2',
                  validation.status === 'error' || validation.status === 'incomplete'
                    ? 'border-error-300 focus:ring-error-200' 
                    : 'border-border-standard focus:ring-primary-300 focus:border-primary-400',
                  'transition-all duration-150'
                )}
                placeholder={`Escriba su oración aquí...`}
              />

              {validation.status === 'error' && validation.repeatedWords.length > 0 && (
                <div className="mt-2 text-sm text-error-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>
                    Las palabras {validation.repeatedWords.join(', ')} ya fueron usadas en otras oraciones
                  </span>
                </div>
              )}

              {validation.status === 'incomplete' && (
                <div className="mt-2 text-sm text-warning-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>
                    Esta oración necesita 2 palabras diferentes de la lista ({validation.detectedWords.length}/2 encontradas)
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
