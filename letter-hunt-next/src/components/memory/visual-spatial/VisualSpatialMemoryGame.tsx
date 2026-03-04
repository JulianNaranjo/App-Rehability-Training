'use client';

import { useEffect, useState, useCallback } from 'react';
import { useVisualSpatialMemoryStore } from '@/store/visual-spatial-memory-store';
import { SpatialGrid } from './SpatialGrid';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import {
  Timer,
  RotateCcw,
  Eye,
  CheckCircle,
  XCircle,
  Trophy,
  Star,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { GRID_SIZE, getIconsForLevel, getDurationForLevel, MAX_LEVEL } from '@/types/visual-spatial-memory';
import { SpatialIconId } from './SpatialGrid';

interface VisualSpatialMemoryGameProps {
  className?: string;
}

/**
 * Main component for the Visual-Spatial Memory Game
 * 
 * Game flow:
 * 1. 'memorize' - Show N icons for N seconds (based on level)
 * 2. 'recall' - User guesses the icon positions
 * 3. 'results' - Show score and play again option
 */
export function VisualSpatialMemoryGame({ className }: VisualSpatialMemoryGameProps) {
  const {
    currentPhase,
    level,
    iconPositions,
    guessedPositions,
    correctGuesses,
    startGame,
    startRound,
    submitGuess,
    resetGame,
    loadStats,
    stats,
    setPhase,
    setLevel,
  } = useVisualSpatialMemoryStore();

  const iconsForLevel = getIconsForLevel(level);
  const memorizeDuration = getDurationForLevel(level);
  const [countdown, setCountdown] = useState<number>(iconsForLevel);

  // Load stats and start game on mount
  useEffect(() => {
    loadStats();
    startGame();
  }, [loadStats, startGame]);

  // Reset countdown when entering memorize phase
  useEffect(() => {
    if (currentPhase === 'memorize') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCountdown(iconsForLevel);
    }
  }, [currentPhase, iconsForLevel]);

  // Handle memorize phase countdown
  useEffect(() => {
    if (currentPhase !== 'memorize') {
      return;
    }

    const timer = setTimeout(() => {
      setPhase('recall');
    }, memorizeDuration);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [currentPhase, setPhase, memorizeDuration]);

  const handleCellClick = useCallback((index: number) => {
    if (currentPhase !== 'recall') return;
    submitGuess(index);
  }, [currentPhase, submitGuess]);

  const handlePlayAgain = useCallback(() => {
    startRound();
  }, [startRound]);

  const handleNewGame = useCallback(() => {
    resetGame();
    startGame();
  }, [resetGame, startGame]);

  const getScore = () => {
    return correctGuesses * 10; // 10 points per correct guess
  };

  // Calculate feedback for results
  const isFullyCorrect = correctGuesses === iconsForLevel;
  const hasPartialCorrect = correctGuesses > 0;

  const handleLevelChange = (newLevel: number) => {
    if (newLevel >= 1 && newLevel <= MAX_LEVEL) {
      setLevel(newLevel);
      startRound();
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-warning-100 rounded-lg">
            <Eye className="w-6 h-6 text-warning-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-text-primary">
              Memoria Visual-Espacial
            </h1>
            <p className="text-sm text-text-secondary">
              Nivel {level}: {iconsForLevel} iconos en {memorizeDuration / 1000} seg
            </p>
          </div>
        </div>

        {/* Level Selector */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleLevelChange(level - 1)}
            disabled={level <= 1}
            className="p-2"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2 bg-surface-elevated px-4 py-2 rounded-lg border border-border-soft">
            <Star className="w-4 h-4 text-warning-500" />
            <span className="text-lg font-mono font-semibold text-text-primary">
              {level}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleLevelChange(level + 1)}
            disabled={level >= MAX_LEVEL}
            className="p-2"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center gap-2 bg-surface-elevated px-4 py-2 rounded-lg border border-border-soft">
          <Trophy className="w-5 h-5 text-warning-500" />
          <span className="text-sm font-mono font-semibold text-text-primary">
            {stats.roundsCompleted} rondas
          </span>
        </div>
      </div>

      {/* Phase: Memorize */}
      {currentPhase === 'memorize' && (
        <>
          <Card className="bg-warning-50 border-warning-200">
            <div className="p-4 text-center">
              <h3 className="font-medium text-warning-800 mb-2">
                Fase de Memorización
              </h3>
              <p className="text-sm text-warning-700">
                Observa los iconos que aparecen. Tienes <strong>{countdown}</strong> segundos para memorizar sus posiciones.
              </p>
            </div>
          </Card>

          <div className="flex justify-center items-center gap-2 mb-4">
            <Timer className="w-6 h-6 text-warning-500" />
            <span className="text-3xl font-bold text-warning-600">
              {countdown}
            </span>
          </div>

          <SpatialGrid
            cells={GRID_SIZE}
            highlightedCells={iconPositions}
            showIcons={true}
            showHighlight={false}
            disabled={true}
            iconIds={(() => {
              const ids = new Array(GRID_SIZE).fill('');
              iconPositions.forEach((pos, idx) => {
                const iconPool: SpatialIconId[] = ['star', 'heart', 'sun', 'moon'];
                ids[pos] = iconPool[idx % iconPool.length];
              });
              return ids;
            })()}
          />

          <div className="flex justify-center gap-4 mt-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-warning-100 rounded-lg">
              <Eye className="w-5 h-5 text-warning-600" />
              <span className="text-warning-700 font-medium">
                {iconsForLevel} iconos por recordar
              </span>
            </div>
          </div>
        </>
      )}

      {/* Phase: Recall */}
      {currentPhase === 'recall' && (
        <>
          <Card className="bg-primary-50 border-primary-200">
            <div className="p-4 text-center">
              <h3 className="font-medium text-primary-800 mb-2">
                Fase de Recuperación
              </h3>
              <p className="text-sm text-primary-700">
                Toca las posiciones donde estaban los iconos. 
                Has encontrado <strong>{correctGuesses}</strong> de {iconsForLevel}.
              </p>
            </div>
          </Card>

          <SpatialGrid
            cells={GRID_SIZE}
            onCellClick={handleCellClick}
            selectedCells={guessedPositions}
            disabled={false}
          />

          <div className="flex justify-center gap-4 mt-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-surface-elevated rounded-lg border border-border-soft">
              <span className="text-text-secondary">Intentos restantes:</span>
              <span className="font-bold text-text-primary">
                {3 - guessedPositions.length}
              </span>
            </div>
          </div>
        </>
      )}

      {/* Phase: Results */}
      {currentPhase === 'results' && (
        <Card className="p-6">
          <div className="text-center mb-6">
            {isFullyCorrect ? (
              <>
                <div className="flex justify-center mb-4">
                  <Trophy className="w-16 h-16 text-warning-500" />
                </div>
                <h2 className="text-2xl font-bold text-text-primary mb-2">
                  ¡Excelente!
                </h2>
                <p className="text-text-secondary">
                  Encontraste todas las posiciones correctamente
                </p>
              </>
            ) : hasPartialCorrect ? (
              <>
                <div className="flex justify-center mb-4">
                  <Star className="w-16 h-16 text-success-500" />
                </div>
                <h2 className="text-2xl font-bold text-text-primary mb-2">
                  ¡Bien!
                </h2>
                <p className="text-text-secondary">
                  Encontraste {correctGuesses} de {iconsForLevel} posiciones
                </p>
              </>
            ) : (
              <>
                <div className="flex justify-center mb-4">
                  <XCircle className="w-16 h-16 text-error-500" />
                </div>
                <h2 className="text-2xl font-bold text-text-primary mb-2">
                  Intenta de nuevo
                </h2>
                <p className="text-text-secondary">
                  No encontraste las posiciones correctas
                </p>
              </>
            )}
          </div>

          {/* Score Display */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-surface-elevated rounded-lg p-4 text-center border border-border-soft">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Star className="w-4 h-4 text-warning-500" />
                <span className="text-sm text-text-secondary">Puntos</span>
              </div>
              <p className="text-3xl font-bold text-text-primary">
                {getScore()}
              </p>
            </div>

            <div className="bg-surface-elevated rounded-lg p-4 text-center border border-border-soft">
              <div className="flex items-center justify-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-success-500" />
                <span className="text-sm text-text-secondary">Aciertos</span>
              </div>
              <p className="text-3xl font-bold text-text-primary">
                {correctGuesses}/{iconsForLevel}
              </p>
            </div>
          </div>

          {/* Show the correct positions */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-text-secondary mb-3 text-center">
              Posiciones correctas:
            </h3>
            <SpatialGrid
              cells={GRID_SIZE}
              highlightedCells={iconPositions}
              selectedCells={guessedPositions}
              disabled={true}
              showIcons={true}
              showHighlight={true}
              iconIds={(() => {
                const ids = new Array(GRID_SIZE).fill('');
                iconPositions.forEach((pos, idx) => {
                  const iconPool: SpatialIconId[] = ['star', 'heart', 'sun', 'moon'];
                  ids[pos] = iconPool[idx % iconPool.length];
                });
                return ids;
              })()}
            />
          </div>

          {/* Stats */}
          <div className="mb-6">
            <div className="bg-surface-elevated rounded-lg p-4 border border-border-soft">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Rondas completadas:</span>
                <span className="font-semibold text-text-primary">{stats.roundsCompleted}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-text-secondary">Partidas jugadas:</span>
                <span className="font-semibold text-text-primary">{stats.gamesPlayed}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 flex-wrap">
            {isFullyCorrect && level < MAX_LEVEL && (
              <Button
                onClick={() => handleLevelChange(level + 1)}
                variant="primary"
                size="lg"
                className="min-w-[200px]"
              >
                <ChevronRight className="w-5 h-5 mr-2" />
                Siguiente Nivel
              </Button>
            )}

            <Button
              onClick={handlePlayAgain}
              variant="warning"
              size="lg"
              className="min-w-[200px]"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Jugar de Nuevo
            </Button>

            <Button
              onClick={handleNewGame}
              variant="secondary"
              size="lg"
              className="min-w-[200px]"
            >
              Nuevo Juego
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
