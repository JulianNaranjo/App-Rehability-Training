"use client";

/**
 * Game Sidebar Controls Component
 *
 * Contextual control buttons displayed in a sidebar.
 * Only shows relevant buttons based on game state.
 *
 * @module GameSidebarControls
 */

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { Check, RotateCcw, ArrowLeft, Play, Trophy } from "lucide-react";
import type { GameMode } from "@/types/game";
import { SYMBOLS, EVEN_NUMBERS, ODD_NUMBERS } from "@/types/game";

interface GameSidebarControlsProps {
  /** Current game state */
  gameState: "idle" | "playing" | "checking" | "won" | "lost" | "paused";
  /** Current game mode */
  gameMode: GameMode;
  /** Whether verify action can be performed */
  canVerify: boolean;
  /** Whether verification is in progress */
  isChecking: boolean;
  /** Whether to show name input (for leaderboard) */
  showNameInput: boolean;
  /** User's count in count mode */
  userCount?: number;
  /** Target letters/numbers to detect level 5 */
  targetLetters?: string[];
  /** Callback for verify action */
  onVerify: () => void;
  /** Callback for new game action */
  onNewGame: () => void;
  /** Callback for next level action */
  onNextLevel?: () => void;
  /** Callback for reset action */
  onReset: () => void;
  /** Callback for return to dashboard */
  onReturn: () => void;
  /** Callback to show name input */
  onShowNameInput: () => void;
  /** Callback for count input change */
  onCountChange?: (value: string) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Game Sidebar Controls - Contextual control buttons
 *
 * Shows different buttons based on game state:
 * - Playing: Verificar, Reiniciar, Volver
 * - Won/Lost: Nuevo Juego, Guardar Puntuación (if won), Volver
 * - Checking: Disabled state
 */
export function GameSidebarControls({
  gameState,
  gameMode,
  canVerify,
  isChecking,
  showNameInput,
  userCount,
  targetLetters,
  onVerify,
  onNewGame,
  onNextLevel,
  onReset,
  onReturn,
  onShowNameInput,
  onCountChange,
  className,
}: GameSidebarControlsProps) {
  const isPlaying = gameState === "playing";
  const isWon = gameState === "won";
  const isLost = gameState === "lost";
  const checkingState = gameState === "checking" || isChecking;

  // Check if these are numbers (level 5) or symbols (level 6)
  const isNumbers =
    targetLetters &&
    targetLetters.length > 0 &&
    /^[0-9]$/.test(targetLetters[0]);
  const isSymbols =
    targetLetters &&
    targetLetters.length > 0 &&
    SYMBOLS.includes(targetLetters[0]);
  // Check if level 7 (even numbers) or level 8 (odd numbers)
  const isEven =
    targetLetters &&
    targetLetters.length === 5 &&
    targetLetters.every((l) => EVEN_NUMBERS.includes(l));
  const isOdd =
    targetLetters &&
    targetLetters.length === 5 &&
    targetLetters.every((l) => ODD_NUMBERS.includes(l));

  return (
    <div
      className={cn("flex flex-col gap-3", className)}
      role="toolbar"
      aria-label="Controles del juego"
    >
      {/* Primary Actions - Contextual */}

      {/* Playing State */}
      {isPlaying && (
        <>
          {/* Count Mode: Number Input + Verify Button */}
          {gameMode === "count" && (
            <div className="space-y-2">
              <Input
                type="number"
                min="0"
                max="225"
                placeholder={
                  isEven
                    ? "¿Cuántos números pares ves?"
                    : isOdd
                      ? "¿Cuántos números impares ves?"
                      : isSymbols
                        ? "¿Cuántos símbolos ves?"
                        : isNumbers
                          ? "¿Cuántos números ves?"
                          : "¿Cuántas letras ves?"
                }
                value={userCount || ""}
                onChange={(e) => onCountChange?.(e.target.value)}
                className="w-full"
                aria-label={
                  isEven
                    ? "Ingresa el conteo de números pares"
                    : isOdd
                      ? "Ingresa el conteo de números impares"
                      : isSymbols
                        ? "Ingresa el conteo de símbolos objetivo"
                        : isNumbers
                          ? "Ingresa el conteo de números objetivo"
                          : "Ingresa el conteo de letras objetivo"
                }
              />
            </div>
          )}

          <Button
            onClick={onVerify}
            disabled={!canVerify || checkingState}
            loading={checkingState}
            variant="primary"
            className={cn(
              "w-full",
              gameMode === "count" &&
                "bg-secondary-600 hover:bg-secondary-700 focus:ring-secondary-500 shadow-secondary-500/25",
            )}
          >
            <Check className="w-4 h-4 mr-2" aria-hidden="true" />
            {checkingState ? "Verificando..." : "Verificar"}
          </Button>
        </>
      )}

      {/* Won State */}
      {isWon && (
        <div className="grid grid-cols-2 gap-3">
          {/* Next Level - Only when won */}
          <Button onClick={onNextLevel} variant="primary" className="w-full">
            <Play className="w-4 h-4" aria-hidden="true" />
            Siguiente nivel
          </Button>

          {/* Play Again - Available for both win and lose */}
          <Button onClick={onNewGame} variant="secondary" className="w-full">
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            Jugar de nuevo
          </Button>

          {!showNameInput && (
            <div className="col-span-2">
              <Button
                onClick={onShowNameInput}
                variant="secondary"
                className="w-full"
              >
                <Trophy className="w-4 h-4" aria-hidden="true" />
                Guardar Puntuación
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Lost State */}
      {isLost && (
        <Button onClick={onNewGame} variant="primary" className="w-full">
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          Jugar de nuevo
        </Button>
      )}

      {/* Secondary Actions - Always Available */}

      {/* Reset - Only show when playing or finished */}
      {isPlaying && (
        <Button onClick={onReset} variant="ghost" className="w-full">
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          Reiniciar
        </Button>
      )}

      {/* Return to Dashboard - Always available */}
      <Button onClick={onReturn} variant="secondary" className="w-full">
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Volver al Dashboard
      </Button>
    </div>
  );
}
