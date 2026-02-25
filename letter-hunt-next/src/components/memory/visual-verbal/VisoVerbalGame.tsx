'use client';

import { useEffect, useState } from 'react';
import { useVisoVerbalStore } from '@/store/visual-verbal-store';
import { ImageGrid } from './ImageGrid';
import { NameInput } from './NameInput';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { Timer, RotateCcw, Eye, ArrowRight } from 'lucide-react';

interface VisoVerbalGameProps {
  className?: string;
}

export function VisoVerbalGame({ className }: VisoVerbalGameProps) {
  const {
    currentPhase,
    items,
    userAnswers,
    correctAnswers,
    startTime,
    score,
    stats,
    startGame,
    continueToRecall,
    setUserAnswer,
    submitAnswers,
    resetGame,
    getTimeElapsed,
    loadStats,
  } = useVisoVerbalStore();

  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    loadStats();
    startGame();
  }, [loadStats, startGame]);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(getTimeElapsed());
    }, 1000);

    return () => clearInterval(interval);
  }, [getTimeElapsed]);

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    return `${seconds}s`;
  };

  const getCorrectCount = () => {
    let correct = 0;
    userAnswers.forEach((answer, index) => {
      if (answer.trim().toLowerCase() === correctAnswers[index]) {
        correct++;
      }
    });
    return correct;
  };

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Eye className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-text-primary">
              Memoria Viso-Verbal
            </h1>
            <p className="text-sm text-text-secondary">
              Relaciona imágenes con nombres
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-surface-elevated px-4 py-2 rounded-lg border border-border-soft">
          <Timer className="w-5 h-5 text-primary-500" />
          <span className="text-lg font-mono font-semibold text-text-primary">
            {formatTime(elapsedTime)}
          </span>
        </div>
      </div>

      {currentPhase === 'memorize' && (
        <>
          <Card className="bg-primary-50 border-primary-200">
            <div className="p-4">
              <h3 className="font-medium text-primary-800 mb-2">
                Instrucciones
              </h3>
              <p className="text-sm text-primary-700">
                Observa con atención las siguientes imágenes y sus nombres. 
                Tómate el tiempo que necesites para memorizarlos. 
                Cuando estés listo, presiona el botón "Continuar" para escribir los nombres de memoria.
              </p>
            </div>
          </Card>

          <ImageGrid items={items} showNames={true} />

          <div className="flex justify-center">
            <Button
              onClick={continueToRecall}
              size="lg"
              className="min-w-[200px]"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Continuar
            </Button>
          </div>
        </>
      )}

      {currentPhase === 'recall' && (
        <>
          <Card className="bg-primary-50 border-primary-200">
            <div className="p-4">
              <h3 className="font-medium text-primary-800 mb-2">
                Escribe los nombres
              </h3>
              <p className="text-sm text-primary-700">
                Sin mirar las imágenes anteriores, escribe el nombre de cada objeto mostrado.
              </p>
            </div>
          </Card>

          <NameInput
            items={items}
            answers={userAnswers}
            onAnswerChange={setUserAnswer}
            onSubmit={submitAnswers}
            correctAnswers={correctAnswers}
            showResults={false}
          />
        </>
      )}

      {currentPhase === 'results' && (
        <Card className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              Resultados
            </h2>
            <p className="text-3xl font-bold text-primary-600">
              {score}%
            </p>
            <p className="text-text-secondary">
              {getCorrectCount()} de {items.length} correctos
            </p>
          </div>

          <NameInput
            items={items}
            answers={userAnswers}
            onAnswerChange={() => {}}
            onSubmit={() => {}}
            correctAnswers={correctAnswers}
            showResults={true}
          />

          <div className="grid grid-cols-3 gap-4 mb-6 mt-6">
            <div className="bg-surface-elevated rounded-lg p-4 text-center border border-border-soft">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Timer className="w-4 h-4 text-primary-500" />
                <span className="text-sm text-text-secondary">Último tiempo</span>
              </div>
              <p className="text-2xl font-bold text-text-primary">
                {startTime ? formatTime(elapsedTime) : '0s'}
              </p>
            </div>

            <div className="bg-surface-elevated rounded-lg p-4 text-center border border-border-soft">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Timer className="w-4 h-4 text-success-500" />
                <span className="text-sm text-text-secondary">Mejor puntuación</span>
              </div>
              <p className="text-2xl font-bold text-text-primary">
                {stats.bestScore}%
              </p>
            </div>

            <div className="bg-surface-elevated rounded-lg p-4 text-center border border-border-soft">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Timer className="w-4 h-4 text-text-secondary" />
                <span className="text-sm text-text-secondary">Promedio</span>
              </div>
              <p className="text-2xl font-bold text-text-primary">
                {stats.averageScore}%
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={() => {
                resetGame();
                setElapsedTime(0);
              }}
              size="lg"
              className="min-w-[200px]"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Jugar de Nuevo
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
