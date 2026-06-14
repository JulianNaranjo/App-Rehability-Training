'use client';

import { useEffect, useState } from 'react';
import { useVisualMemoryStore } from '@/store/visual-memory-store';
import { ShapesDisplay } from './ShapesDisplay';
import { ShapeSelector } from './ShapeSelector';
import { DrawingBoard } from './DrawingBoard';
import { LevelSelector } from './LevelSelector';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import {
  Timer,
  RotateCcw,
  Eye,
  ArrowRight,
} from 'lucide-react';

interface VisualMemoryGameProps {
  className?: string;
}

export function VisualMemoryGame({ className }: VisualMemoryGameProps) {
  const {
    currentLevel,
    currentPhase,
    shapes,
    drawingDataUrl,
    selectedShapes,
    startTime,
    startGame,
    selectLevel,
    continueToRecall,
    setDrawingDataUrl,
    toggleSelectedShape,
    submitSelfEvaluation,
    resetGame,
    getTimeElapsed,
    loadStats,
    stats,
  } = useVisualMemoryStore();

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

  const handleLevelSelect = (level: 1) => {
    selectLevel(level);
    setElapsedTime(0);
  };

  const handleFinishDrawing = (dataUrl: string) => {
    setDrawingDataUrl(dataUrl);
    setTimeout(() => {
      const { submitSelfEvaluation } = useVisualMemoryStore.getState();
      submitSelfEvaluation(true);
    }, 100);
  };

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimeMs = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    return `${seconds}s`;
  };

  return (
    <div className={cn('space-y-6', className)}>
      <LevelSelector
        currentLevel={currentLevel}
        onSelectLevel={handleLevelSelect}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-warning-100 rounded-lg">
            <Eye className="w-6 h-6 text-warning-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-text-primary">
              Memoria Visual - Nivel {currentLevel}
            </h1>
            <p className="text-sm text-text-secondary">
              Figuras geométricas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-surface-elevated px-4 py-2 rounded-lg border border-border-soft">
          <Timer className="w-5 h-5 text-warning-500" />
          <span className="text-lg font-mono font-semibold text-text-primary">
            {formatTime(elapsedTime)}
          </span>
        </div>
      </div>

      {currentPhase === 'memorize' && (
        <>
          <Card className="bg-warning-50 border-warning-200">
            <div className="p-4">
              <h3 className="font-medium text-warning-800 mb-2">
                Instrucciones
              </h3>
              <p className="text-sm text-warning-700">
                Observa con atención las siguientes figuras. Tómate el tiempo que necesites para memorizarlas. 
                Cuando estés listo, presiona el botón &quot;Continuar&quot; para pasar a dibujar.
              </p>
            </div>
          </Card>

          <ShapesDisplay shapes={shapes} />

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
          <Card className="bg-warning-50 border-warning-200">
            <div className="p-4">
              <h3 className="font-medium text-warning-800 mb-2">
                Ahora dibuja
              </h3>
              <p className="text-sm text-warning-700">
                Intenta dibujar las figuras que memorizaste en la pizarra de abajo. 
                Cuando hayas terminado, presiona &quot;Ya terminé&quot;.
              </p>
            </div>
          </Card>

          <DrawingBoard onFinish={handleFinishDrawing} />

          {drawingDataUrl && (
            <Card className="bg-success-50 border-success-200 p-4">
              <div className="flex items-center gap-2 text-success-700">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">Dibujo guardado</span>
              </div>
            </Card>
          )}
        </>
      )}

      {currentPhase === 'results' && (
        <Card className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              Resultados
            </h2>

            <p className="text-text-secondary">
              Selecciona las figuras que lograste dibujar:
            </p>
          </div>

          {drawingDataUrl && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-text-secondary mb-3 text-center">
                Tu dibujo:
              </h3>
              <div className="flex justify-center">
                <img
                  src={drawingDataUrl}
                  alt="Tu dibujo"
                  className="max-w-sm w-full border-2 border-border-soft rounded-lg bg-white"
                />
              </div>
            </div>
          )}

          <div className="mb-6">
            <div className="text-center mb-3">
              <span className="text-lg font-semibold text-warning-600">
                {selectedShapes.length} de {shapes.length} figuras
              </span>
            </div>
            <ShapeSelector
              shapes={shapes}
              selectedShapes={selectedShapes}
              onToggle={toggleSelectedShape}
            />
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-surface-elevated rounded-lg p-4 text-center border border-border-soft">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Timer className="w-4 h-4 text-warning-500" />
                <span className="text-sm text-text-secondary">Último tiempo</span>
              </div>
              <p className="text-2xl font-bold text-text-primary">
                {startTime ? formatTimeMs(elapsedTime) : '0s'}
              </p>
            </div>

            <div className="bg-surface-elevated rounded-lg p-4 text-center border border-border-soft">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Timer className="w-4 h-4 text-success-500" />
                <span className="text-sm text-text-secondary">Aciertos</span>
              </div>
              <p className="text-2xl font-bold text-text-primary">
                {selectedShapes.length}/{shapes.length}
              </p>
            </div>

            <div className="bg-surface-elevated rounded-lg p-4 text-center border border-border-soft">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Timer className="w-4 h-4 text-text-secondary" />
                <span className="text-sm text-text-secondary">Promedio</span>
              </div>
              <p className="text-2xl font-bold text-text-primary">
                {stats.averageTime}s
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={() => {
                const success = selectedShapes.length >= Math.ceil(shapes.length * 0.8);
                submitSelfEvaluation(success);
                resetGame();
                startGame(currentLevel);
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
