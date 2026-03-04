'use client';

/**
 * Series Game Component
 *
 * Main component for Level 7 - Series Memorization Game.
 * 
 * Flow:
 * 1. Show series (1 digit per second)
 * 2. Input normal order
 * 3. If correct -> Input reverse order
 * 4. If correct -> Next series (need 3 consecutive correct)
 * 5. After 3 series, increase series length (3→4→5→6→7)
 * 6. If incorrect -> Restart from showing
 *
 * @module SeriesGame
 */

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useWorkingMemoryStore } from '@/store/working-memory-store';
import { SeriesDisplay } from './SeriesDisplay';
import { SeriesInput } from './SeriesInput';
import { SeriesProgress } from './SeriesProgress';
import { cn } from '@/lib/utils';
import { RotateCcw, Trophy, AlertCircle } from 'lucide-react';

interface SeriesGameProps {
  className?: string;
}

export function SeriesGame({ className }: SeriesGameProps) {
  const {
    seriesState,
    isCompleted,
    advanceDigitIndex,
    updateSeriesInput,
    validateSeriesNormal,
    validateSeriesReverse,
    resetGame,
    generateNewGame,
  } = useWorkingMemoryStore();

  const { currentSeries, userInputs, seriesCorrect, totalSeries, phase, currentDigitIndex, currentSeriesLength } = seriesState;

  const handleNewGame = () => {
    resetGame();
    generateNewGame(7);
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Progress */}
      <Card className="p-4">
        <SeriesProgress 
          current={seriesCorrect} 
          total={totalSeries} 
          currentSeriesLength={currentSeriesLength}
        />
      </Card>

      {/* Main Game Area */}
      {!isCompleted ? (
        <Card className="p-8">
          {/* Phase: Showing Series */}
          {phase === 'showing' && (
            <SeriesDisplay
              series={currentSeries}
              currentIndex={currentDigitIndex}
              onAdvance={advanceDigitIndex}
            />
          )}

          {/* Phase: Input Normal */}
          {phase === 'input-normal' && (
            <SeriesInput
              inputs={userInputs}
              label="Ingresa la serie en orden"
              onInputChange={updateSeriesInput}
              onValidate={validateSeriesNormal}
            />
          )}

          {/* Phase: Input Reverse */}
          {phase === 'input-reverse' && (
            <div className="space-y-4">
              <div className="bg-success-50 border border-success-200 rounded-lg p-4 text-center">
                <p className="text-success-700 font-medium">
                  ¡Correcto! Ahora ingresa la serie al revés
                </p>
              </div>
              <SeriesInput
                inputs={userInputs}
                label="Ingresa la serie AL REVÉS"
                onInputChange={updateSeriesInput}
                onValidate={validateSeriesReverse}
              />
            </div>
          )}
        </Card>
      ) : (
        /* Success Screen */
        <Card className="p-8 bg-success-50 border-success-200">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-success-100">
              <Trophy className="w-16 h-16 text-success-500" />
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-success-700 mb-2">
                ¡Felicitaciones!
              </h2>
              <p className="text-success-600">
                Has completado el Nivel 7 - Memorización de Series
              </p>
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <Button
                onClick={handleNewGame}
                size="lg"
                variant="secondary"
                className="min-w-[200px]"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Jugar de Nuevo
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Instructions */}
      {!isCompleted && (
        <Card className="bg-primary-50 border-primary-200">
          <div className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-medium text-primary-800 mb-1">
                  Instrucciones
                </h3>
                <ol className="text-sm text-primary-700 space-y-1 list-decimal list-inside">
                  <li>Memoriza la serie de {currentSeriesLength} números que aparece en pantalla</li>
                  <li>Ingresa los números en el orden correcto</li>
                  <li>Si aciertas, ingresa la serie en orden inverso</li>
                  <li>Necesitas {totalSeries} series correctas consecutivas para pasar a la siguiente fase</li>
                  <li>Completarás series de 3, 4, 5, 6 y finalmente 7 dígitos</li>
                </ol>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
