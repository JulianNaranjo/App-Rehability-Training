'use client';

/**
 * Working Memory Store
 * 
 * Zustand store for managing working memory game state.
 * 
 * @module working-memory-store
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import {
  WorkingMemoryState,
  NumberLetterMapping,
  GridCell,
  ValidationResult,
  ReferenceValidationResult,
  GRID_ROWS,
  GRID_COLS,
  NUMBERS,
  ALPHABET,
  EMPTY_PENALTY_PERCENTAGE,
  WorkingMemoryStats,
} from '@/types/working-memory';

interface WorkingMemoryStore extends WorkingMemoryState {
  // Stats
  stats: WorkingMemoryStats;

  // Actions
  generateNewGame: (level?: 1 | 2) => void;
  updateCell: (row: number, col: number, value: string) => void;
  validateAnswers: () => ValidationResult;
  resetGame: () => void;
  getTimeElapsed: () => number;

  // Level 2 actions
  updateReferenceCell: (index: number, letter: string) => void;
  validateReferenceTable: () => ReferenceValidationResult;
  continueToLevel2: () => void;

  // Stats actions
  updateStats: (result: ValidationResult) => void;
  loadStats: () => void;
}

function generateRandomMapping(): NumberLetterMapping {
  const shuffled = ALPHABET.split('').sort(() => Math.random() - 0.5);
  const mapping: NumberLetterMapping = {};
  NUMBERS.forEach((num, index) => {
    mapping[num] = shuffled[index];
  });
  return mapping;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function generateGrid(_mapping: NumberLetterMapping): GridCell[][] {
  const grid: GridCell[][] = [];
  
  for (let row = 0; row < GRID_ROWS; row++) {
    const rowCells: GridCell[] = [];
    const rowGroup = row % 3;
    
    for (let col = 0; col < GRID_COLS; col++) {
      let cell: GridCell;
      
      if (rowGroup === 0) {
        // Input row
        cell = {
          row,
          col,
          type: 'input',
          value: '',
          isCorrect: undefined,
          isValidated: false,
        };
      } else if (rowGroup === 1) {
        // Number row (ahora en posición 1)
        const randomNum = Math.floor(Math.random() * 10).toString();
        cell = {
          row,
          col,
          type: 'number',
          value: randomNum,
          isCorrect: undefined,
          isValidated: false,
        };
      } else {
        // Empty row (spacing) - ahora en posición 2
        cell = {
          row,
          col,
          type: 'empty',
          value: '',
          isCorrect: undefined,
          isValidated: false,
        };
      }
      
      rowCells.push(cell);
    }
    
    grid.push(rowCells);
  }
  
  return grid;
}

function getNumberAboveCell(grid: GridCell[][], row: number, col: number): string | null {
  // Buscar el número en la fila siguiente
  // El patrón es: Input (row) -> Number (row+1) -> Empty (row+2)
  // Entonces el número correspondiente al input en 'row' está en row + 1

  const numberRow = row + 1;
  if (numberRow < grid.length && grid[numberRow][col].type === 'number') {
    return grid[numberRow][col].value;
  }

  return null;
}

const initialStats: WorkingMemoryStats = {
  gamesPlayed: 0,
  averageAccuracy: 0,
  bestTime: null,
  totalTime: 0,
};

const STORAGE_KEY = 'working-memory-stats';

export const useWorkingMemoryStore = create<WorkingMemoryStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    currentLevel: 1,
    mapping: {},
    grid: [],
    userReferenceInputs: Array(10).fill(''),
    referenceTableValidated: false,
    referenceValidationResult: null,
    startTime: null,
    endTime: null,
    isCompleted: false,
    isValidated: false,
    validationResult: null,
    stats: initialStats,

    // Actions
    generateNewGame: (level: 1 | 2 = 1) => {
      const mapping = generateRandomMapping();
      const grid = level === 1 ? generateGrid(mapping) : [];
      const startTime = Date.now();

      set({
        currentLevel: level,
        mapping,
        grid,
        userReferenceInputs: Array(10).fill(''),
        referenceTableValidated: false,
        referenceValidationResult: null,
        startTime,
        endTime: null,
        isCompleted: false,
        isValidated: false,
        validationResult: null,
      });
    },
    
    updateCell: (row: number, col: number, value: string) => {
      const { grid, isValidated } = get();
      
      if (isValidated) return; // No permitir cambios después de validar
      
      const newGrid = grid.map((r, rowIndex) =>
        r.map((cell, colIndex) => {
          if (rowIndex === row && colIndex === col && cell.type === 'input') {
            return { ...cell, value: value.toUpperCase().slice(0, 1) };
          }
          return cell;
        })
      );
      
      set({ grid: newGrid });
    },
    
    validateAnswers: () => {
      const { grid, mapping, startTime } = get();
      
      if (!startTime) {
        throw new Error('Game not started');
      }
      
      const endTime = Date.now();
      const timeElapsed = (endTime - startTime) / 1000; // en segundos
      
      let totalCells = 0;
      let correctCells = 0;
      let incorrectCells = 0;
      let emptyCells = 0;
      
      const validatedGrid = grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          if (cell.type === 'input') {
            totalCells++;
            const numberAbove = getNumberAboveCell(grid, rowIndex, colIndex);
            
            if (!cell.value) {
              emptyCells++;
              return { ...cell, isCorrect: false, isValidated: true };
            }
            
            if (numberAbove && mapping[numberAbove] === cell.value) {
              correctCells++;
              return { ...cell, isCorrect: true, isValidated: true };
            } else {
              incorrectCells++;
              return { ...cell, isCorrect: false, isValidated: true };
            }
          }
          return cell;
        })
      );
      
      // Calcular porcentaje con penalización si hay celdas vacías
      let percentage = totalCells > 0 ? (correctCells / totalCells) * 100 : 0;
      const penaltyApplied = emptyCells > 0;
      
      if (penaltyApplied) {
        percentage = Math.max(0, percentage - EMPTY_PENALTY_PERCENTAGE);
      }
      
      const result: ValidationResult = {
        totalCells,
        correctCells,
        incorrectCells,
        emptyCells,
        percentage: Math.round(percentage * 10) / 10, // Redondear a 1 decimal
        timeElapsed: Math.round(timeElapsed * 10) / 10,
        penaltyApplied,
      };
      
      set({
        grid: validatedGrid,
        endTime,
        isCompleted: true,
        isValidated: true,
        validationResult: result,
      });
      
      // Actualizar estadísticas
      get().updateStats(result);
      
      return result;
    },
    
    resetGame: () => {
      set({
        currentLevel: 1,
        mapping: {},
        grid: [],
        userReferenceInputs: Array(10).fill(''),
        referenceTableValidated: false,
        referenceValidationResult: null,
        startTime: null,
        endTime: null,
        isCompleted: false,
        isValidated: false,
        validationResult: null,
      });
    },

    // Level 2: Update reference table cell
    updateReferenceCell: (index: number, letter: string) => {
      const { userReferenceInputs, referenceTableValidated } = get();
      if (referenceTableValidated) return;

      const newInputs = [...userReferenceInputs];
      newInputs[index] = letter.toUpperCase().slice(0, 1);
      set({ userReferenceInputs: newInputs });
    },

    // Level 2: Validate reference table
    validateReferenceTable: () => {
      const { mapping, userReferenceInputs } = get();
      const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

      let correct = 0;
      let incorrect = 0;
      const letters = numbers.map((num, index) => {
        const userLetter = userReferenceInputs[index] || '';
        const correctLetter = mapping[num];
        const isCorrect = userLetter === correctLetter;

        if (isCorrect) correct++;
        else incorrect++;

        return {
          number: num,
          userLetter,
          correctLetter,
          isCorrect,
        };
      });

      const result: ReferenceValidationResult = {
        correct,
        incorrect,
        letters,
      };

      set({
        referenceTableValidated: true,
        referenceValidationResult: result,
      });

      return result;
    },

    // Level 2: Continue to level 2 (keep mapping, reset timer, generate new grid)
    continueToLevel2: () => {
      const { mapping } = get();
      const grid = generateGrid(mapping);
      const startTime = Date.now();

      set({
        currentLevel: 2,
        grid,
        userReferenceInputs: Array(10).fill(''),
        referenceTableValidated: false,
        referenceValidationResult: null,
        startTime,
        endTime: null,
        isCompleted: false,
        isValidated: false,
        validationResult: null,
      });
    },

    getTimeElapsed: () => {
      const { startTime } = get();
      if (!startTime) return 0;
      return Math.round((Date.now() - startTime) / 1000);
    },
    
    // Stats management
    updateStats: (result: ValidationResult) => {
      const { stats } = get();
      
      const newStats: WorkingMemoryStats = {
        gamesPlayed: stats.gamesPlayed + 1,
        averageAccuracy: (stats.averageAccuracy * stats.gamesPlayed + result.percentage) / (stats.gamesPlayed + 1),
        bestTime: stats.bestTime === null || result.timeElapsed < stats.bestTime 
          ? result.timeElapsed 
          : stats.bestTime,
        totalTime: stats.totalTime + result.timeElapsed,
      };
      
      set({ stats: newStats });
      
      // Guardar en localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
      }
    },
    
    loadStats: () => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            const stats = JSON.parse(stored);
            set({ stats });
          } catch (error) {
            console.error('Error loading working memory stats:', error);
          }
        }
      }
    },
  }))
);

// Auto-load stats on initialization
if (typeof window !== 'undefined') {
  useWorkingMemoryStore.getState().loadStats();
}
