'use client';

/**
 * Game Board Container Component
 *
 * Main wrapper for the game board with dashboard-style design.
 * Integrates: target letters display, progress, timer/score, board, and controls.
 *
 * @module GameBoardContainer
 */

import { useRouter } from 'next/navigation';
import { GameBoard } from '@/components/GameBoard';
import { TargetLettersDisplay } from './TargetLettersDisplay';
import { GameProgress } from './GameProgress';
import { GameTimerScore } from './GameTimerScore';
import { GameSidebarControls } from './GameSidebarControls';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useGameStore } from '@/store/game-store';
import { cn } from '@/lib/utils';
import { useState, useCallback, useEffect } from 'react';
import { Trophy } from 'lucide-react';

interface GameBoardContainerProps {
  /** Additional CSS classes */
  className?: string;
}

/**
 * Game Board Container - Dashboard-style game interface
 *
 * Layout:
 * - Top section: Dashboard-style card with letters, progress, timer
 * - Middle: Game board (left) + Sidebar controls (right)
 * - On mobile: Board above, controls below
 */
export function GameBoardContainer({
  className,
}: GameBoardContainerProps) {
  const router = useRouter();
  const {
    targetLetters,
    selectedIndices,
    solutionIndices,
    elapsedTime,
    score,
    currentLevel,
    gameState,
    gameMode,
    userCount,
    checkAnswer,
    generateNewGame,
    nextLevel,
    resetGame,
    addToLeaderboard,
    setUserCount,
  } = useGameStore();

  const [isChecking, setIsChecking] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [playerName, setPlayerName] = useState('');

  const isPlaying = gameState === 'playing';
  const isWon = gameState === 'won';
  const isLost = gameState === 'lost';

  // Timer effect - update elapsed time every 100ms while playing
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      useGameStore.getState().updateElapsedTime();
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const targetCount = solutionIndices.size;
  const selectedCount = selectedIndices.size;
  const canVerify = gameMode === 'selection' 
    ? selectedCount > 0 
    : userCount !== undefined && userCount > 0;

  // Handle verify answer
  const handleVerify = useCallback(() => {
    if (!canVerify || isChecking) return;

    setIsChecking(true);
    checkAnswer();
    setTimeout(() => setIsChecking(false), 1500);
  }, [canVerify, isChecking, checkAnswer]);

  // Handle count input change
  const handleCountChange = useCallback((value: string) => {
    const count = parseInt(value, 10);
    setUserCount(isNaN(count) ? 0 : count);
  }, [setUserCount]);

  // Handle new game
  const handleNewGame = useCallback(() => {
    setShowNameInput(false);
    setPlayerName('');
    generateNewGame();
  }, [generateNewGame]);

  // Handle next level
  const handleNextLevel = useCallback(() => {
    setShowNameInput(false);
    setPlayerName('');
    nextLevel();
  }, [nextLevel]);

  // Handle reset
  const handleReset = useCallback(() => {
    setShowNameInput(false);
    setPlayerName('');
    resetGame();
  }, [resetGame]);

  // Handle return to dashboard - uses Next.js router
  const handleReturnToDashboard = useCallback(() => {
    resetGame();
    router.push('/dashboard');
  }, [resetGame, router]);

  // Handle submit score
  const handleSubmitScore = useCallback(() => {
    if (playerName.trim()) {
      addToLeaderboard(playerName.trim());
      setShowNameInput(false);
      setPlayerName('');
      handleNewGame();
    }
  }, [playerName, addToLeaderboard, handleNewGame]);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Dashboard-style Header Section */}
      <section
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8"
        aria-label="Información del juego"
      >
        {/* Section Title */}
        <div className="mb-6 text-center">
          <h2 className={cn(
            "text-2xl md:text-3xl font-bold mb-2",
            gameMode === 'count'
              ? "text-secondary-600 dark:text-secondary-400"
              : "text-primary-600 dark:text-primary-400"
          )}>
            Mejora atención - Modo {gameMode === 'count' ? 'Conteo' : 'Selección'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Nivel {currentLevel}
          </p>
        </div>

        {/* Target Letters Card */}
        <div className="mb-6">
          <TargetLettersDisplay letters={targetLetters} gameMode={gameMode} />
        </div>

        {/* Progress - Only show in selection mode */}
        {gameMode === 'selection' && (
          <div className="mb-4">
            <GameProgress
              selectedCount={selectedCount}
              targetCount={targetCount}
            />
          </div>
        )}

        {/* Timer and Score */}
        <GameTimerScore elapsedTime={elapsedTime} score={score} />
      </section>

      {/* Game Area - Board + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Game Board - Takes 2/3 on desktop */}
        <div className="lg:col-span-2">
          <GameBoard />
        </div>

        {/* Sidebar Controls - Takes 1/3 on desktop, full width on mobile */}
        <div className="space-y-4">
          {/* Game Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Controles
            </h3>

            <GameSidebarControls
              gameState={gameState}
              gameMode={gameMode}
              canVerify={canVerify}
              isChecking={isChecking}
              showNameInput={showNameInput}
              userCount={userCount}
              onVerify={handleVerify}
              onNewGame={handleNewGame}
              onNextLevel={handleNextLevel}
              onReset={handleReset}
              onReturn={handleReturnToDashboard}
              onShowNameInput={() => setShowNameInput(true)}
              onCountChange={handleCountChange}
            />
          </div>

          {/* Leaderboard Name Input - Only when won and name input shown */}
          {isWon && showNameInput && (
            <div className="bg-success-50 dark:bg-success-900/20 rounded-2xl p-6 border border-success-200 dark:border-success-800">
              <h3 className="text-lg font-semibold text-success-700 dark:text-success-300 mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5" aria-hidden="true" />
                ¡Guarda tu puntuación!
              </h3>

              <Input
                label="Tu nombre"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Ingresa tu nombre"
                maxLength={30}
                className="mb-4"
              />

              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleSubmitScore}
                  disabled={!playerName.trim()}
                  variant="success"
                  className="w-full"
                >
                  Guardar Puntuación
                </Button>
                <Button
                  onClick={() => {
                    setShowNameInput(false);
                    setPlayerName('');
                  }}
                  variant="ghost"
                  className="w-full"
                >
                  Omitir
                </Button>
              </div>
            </div>
          )}

          {/* Success/Error Messages */}
          {isWon && !showNameInput && (
            <div className="bg-success-50 dark:bg-success-900/20 rounded-xl p-4 border border-success-200 dark:border-success-800 text-center">
              <p className="text-success-700 dark:text-success-300 font-semibold">
                ¡Felicidades! ¡Completado!
              </p>
            </div>
          )}

          {isLost && (
            <div className="bg-error-50 dark:bg-error-900/20 rounded-xl p-4 border border-error-200 dark:border-error-800 text-center">
              <p className="text-error-700 dark:text-error-300 font-semibold">
                ¡No te rindas! Inténtalo de nuevo.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
