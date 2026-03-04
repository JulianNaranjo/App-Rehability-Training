/**
 * Working Memory Game Types
 * 
 * Type definitions for the working memory game mode.
 * 
 * @module working-memory-types
 */

export type CellType = 'input' | 'empty' | 'number';

export interface GridCell {
  row: number;
  col: number;
  type: CellType;
  value: string;
  isCorrect?: boolean;
  isValidated?: boolean;
}

export interface NumberLetterMapping {
  [key: string]: string;
}

export interface ValidationResult {
  totalCells: number;
  correctCells: number;
  incorrectCells: number;
  emptyCells: number;
  percentage: number;
  timeElapsed: number;
  penaltyApplied: boolean;
}

export interface ReferenceValidationResult {
  correct: number;
  incorrect: number;
  letters: {
    number: string;
    userLetter: string;
    correctLetter: string;
    isCorrect: boolean;
  }[];
}

export interface SyllableMapping {
  [key: string]: string; // '1' -> 'TA', '2' -> 'PE', etc.
}

export interface SymbolMapping {
  [key: string]: string; // '1' -> '+', '2' -> '-', etc.
}

export type GameType = 'numbers' | 'syllables' | 'symbols' | 'series';
export type Level3Phase = 1 | 2;
export type Level4Phase = 1 | 2;

export type SeriesPhase = 'showing' | 'input-normal' | 'input-reverse' | 'success';

export interface SeriesState {
  currentSeries: number[];
  currentSeriesLength: number;
  userInputs: string[];
  seriesCorrect: number;
  totalSeries: number;
  phase: SeriesPhase;
  currentDigitIndex: number;
  isAnimating: boolean;
}

export interface WorkingMemoryState {
  currentLevel: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  gameType: GameType;
  mapping: NumberLetterMapping | SyllableMapping | SymbolMapping;
  grid: GridCell[][];
  userReferenceInputs: string[];
  referenceTableValidated: boolean;
  referenceValidationResult: ReferenceValidationResult | null;
  startTime: number | null;
  endTime: number | null;
  isCompleted: boolean;
  isValidated: boolean;
  validationResult: ValidationResult | null;
  // Level 3 specific
  level3Phase: Level3Phase;
  // Level 4 specific
  level4Phase: Level4Phase;
  // Level 7 specific
  seriesState: SeriesState;
  unlockedLevels: number[];
}

export const GRID_ROWS = 42;
export const GRID_COLS = 12;
export const NUMBERS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Syllable generation constants
export const CONSONANTS = ['B', 'C', 'D', 'F', 'G', 'H', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'V'];
export const VOWELS = ['A', 'E', 'I', 'O', 'U'];

export const EMPTY_PENALTY_PERCENTAGE = 5;

// Symbols for levels 5 and 6 (keyboard-accessible)
export const SYMBOLS = '+-/%$¿?!@#' as const;

// Series game constants
export const SERIES_DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
export const SERIES_MIN_LENGTH = 3;
export const SERIES_MAX_LENGTH = 7;
export const SERIES_SHOW_TIME_MS = 1000; // 1 second per digit
export const SERIES_REQUIRED_CORRECT = 3;

export interface WorkingMemoryStats {
  gamesPlayed: number;
  averageAccuracy: number;
  bestTime: number | null;
  totalTime: number;
}
