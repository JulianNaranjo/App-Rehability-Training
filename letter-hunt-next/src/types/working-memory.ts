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

export interface WorkingMemoryState {
  currentLevel: 1 | 2;
  mapping: NumberLetterMapping;
  grid: GridCell[][];
  userReferenceInputs: string[];
  referenceTableValidated: boolean;
  referenceValidationResult: ReferenceValidationResult | null;
  startTime: number | null;
  endTime: number | null;
  isCompleted: boolean;
  isValidated: boolean;
  validationResult: ValidationResult | null;
}

export const GRID_ROWS = 42;
export const GRID_COLS = 12;
export const NUMBERS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const EMPTY_PENALTY_PERCENTAGE = 5;

export interface WorkingMemoryStats {
  gamesPlayed: number;
  averageAccuracy: number;
  bestTime: number | null;
  totalTime: number;
}
