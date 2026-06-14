/**
 * Visual-Spatial Memory Game Types
 *
 * Type definitions for the visual-spatial memory game mode.
 *
 * @module visual-spatial-memory-types
 */

import { LucideIcon } from 'lucide-react';

/**
 * Icon available in the visual-spatial memory game
 */
export interface SpatialIcon {
  id: string;
  icon: LucideIcon;
  name: string;
}

/**
 * Phases of the visual-spatial memory game
 */
export type GamePhase = 'idle' | 'memorize' | 'recall' | 'results';

/**
 * Grid size for the visual-spatial memory game (4x5 = 20 cells)
 */
export const GRID_SIZE = 20;
export const GRID_ROWS = 4;
export const GRID_COLS = 5;

/**
 * Maximum number of levels
 */
export const MAX_LEVEL = 10;

/**
 * Get number of icons for a given level (starts at level 1 = 2 icons)
 */
export function getIconsForLevel(level: number): number {
  return level + 1;
}

/**
 * Get memorize duration in ms for a given level (starts at level 1 = 2000ms)
 */
export function getDurationForLevel(level: number): number {
  return (level + 1) * 1000;
}

/**
 * State for the visual-spatial memory game
 */
export interface VisualSpatialMemoryState {
  currentPhase: GamePhase;
  /** Current level (1-10) */
  level: number;
  /** Array of icon IDs that are displayed in the grid */
  iconPositions: number[];
  /** Array of positions the user has guessed */
  guessedPositions: number[];
  /** Number of correct guesses in current round */
  correctGuesses: number;
  /** Number of rounds completed */
  roundsCompleted: number;
  /** Whether the game is currently active */
  isActive: boolean;
  /** Start time of current round (for timing) */
  roundStartTime: number | null;
}

/**
 * Statistics for the visual-spatial memory game
 */
export interface VisualSpatialMemoryStats {
  gamesPlayed: number;
  roundsCompleted: number;
  averageAccuracy: number;
  bestTime: number | null;
  totalTime: number;
}

/**
 * Result of a single round
 */
export interface GameRoundResult {
  roundNumber: number;
  iconPositions: number[];
  guessedPositions: number[];
  correctGuesses: number;
  timeElapsed: number;
  wasSuccessful: boolean;
}

/**
 * Initial stats when no data exists
 */
export const INITIAL_STATS: VisualSpatialMemoryStats = {
  gamesPlayed: 0,
  roundsCompleted: 0,
  averageAccuracy: 0,
  bestTime: null,
  totalTime: 0,
};

/**
 * Initial state for the game
 */
export const INITIAL_STATE: VisualSpatialMemoryState = {
  currentPhase: 'idle',
  level: 1,
  iconPositions: [],
  guessedPositions: [],
  correctGuesses: 0,
  roundsCompleted: 0,
  isActive: false,
  roundStartTime: null,
};
