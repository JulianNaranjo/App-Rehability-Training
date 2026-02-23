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
  SyllableMapping,
  SymbolMapping,
  GameType,
  Level3Phase,
  Level4Phase,
  SeriesState,
  GridCell,
  ValidationResult,
  ReferenceValidationResult,
  GRID_ROWS,
  GRID_COLS,
  NUMBERS,
  ALPHABET,
  CONSONANTS,
  VOWELS,
  SYMBOLS,
  EMPTY_PENALTY_PERCENTAGE,
  WorkingMemoryStats,
  SERIES_DIGITS,
  SERIES_MIN_LENGTH,
  SERIES_MAX_LENGTH,
  SERIES_REQUIRED_CORRECT,
} from '@/types/working-memory';

interface WorkingMemoryStore extends WorkingMemoryState {
  // Stats
  stats: WorkingMemoryStats;

  // Actions
  generateNewGame: (level?: 1 | 2 | 3 | 4 | 5 | 6 | 7) => void;
  updateCell: (row: number, col: number, value: string) => void;
  validateAnswers: () => ValidationResult;
  resetGame: () => void;
  getTimeElapsed: () => number;

  // Level 2 actions
  updateReferenceCell: (index: number, letter: string) => void;
  validateReferenceTable: () => ReferenceValidationResult;
  continueToLevel2: () => void;

  // Level 3 actions
  continueToLevel3: () => void;
  updateLevel3Phase: (phase: Level3Phase) => void;

  // Level 4 actions
  continueToLevel4: () => void;
  updateLevel4Phase: (phase: Level4Phase) => void;

  // Level 5 actions
  continueToLevel5: () => void;

  // Level 6 actions
  continueToLevel6: () => void;

  // Level 7 actions (Series Game)
  continueToLevel7: () => void;
  generateNewSeries: () => void;
  startShowingSeries: () => void;
  advanceDigitIndex: () => void;
  finishShowingSeries: () => void;
  updateSeriesInput: (index: number, value: string) => void;
  validateSeriesNormal: () => boolean;
  validateSeriesReverse: () => boolean;
  handleCorrectNormal: () => void;
  handleCorrectReverse: () => void;
  handleIncorrectSeries: () => void;
  resetSeriesInputs: () => void;

  unlockLevel: (level: number) => void;
  loadUnlockedLevels: () => void;

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

// Generate 10 random syllables (consonant + vowel), all with distinct consonants and vowels
function generateRandomSyllables(): string[] {
  const shuffledConsonants = [...CONSONANTS].sort(() => Math.random() - 0.5);
  const shuffledVowels = [...VOWELS].sort(() => Math.random() - 0.5);
  
  const syllables: string[] = [];
  for (let i = 0; i < 10; i++) {
    const consonant = shuffledConsonants[i % shuffledConsonants.length];
    const vowel = shuffledVowels[i % shuffledVowels.length];
    syllables.push(`${consonant}${vowel}`);
  }
  
  return syllables;
}

function generateSyllableMapping(): SyllableMapping {
  const syllables = generateRandomSyllables();
  const mapping: SyllableMapping = {};
  NUMBERS.forEach((num, index) => {
    mapping[num] = syllables[index];
  });
  return mapping;
}

function generateSymbolMapping(): SymbolMapping {
  const shuffledSymbols = [...SYMBOLS].sort(() => Math.random() - 0.5);
  const mapping: SymbolMapping = {};
  NUMBERS.forEach((num, index) => {
    mapping[num] = shuffledSymbols[index];
  });
  return mapping;
}

function generateRandomSeries(length: number = SERIES_MIN_LENGTH): number[] {
  const series: number[] = [];
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * SERIES_DIGITS.length);
    series.push(SERIES_DIGITS[randomIndex]);
  }
  return series;
}

const initialSeriesState: SeriesState = {
  currentSeries: [],
  currentSeriesLength: SERIES_MIN_LENGTH,
  userInputs: [],
  seriesCorrect: 0,
  totalSeries: SERIES_REQUIRED_CORRECT,
  phase: 'showing',
  currentDigitIndex: 0,
  isAnimating: false,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function generateGrid(_mapping: NumberLetterMapping | SyllableMapping): GridCell[][] {
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
        // Number row
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
        // Empty row (spacing)
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
const UNLOCKED_LEVELS_KEY = 'working-memory-unlocked-levels';

export const useWorkingMemoryStore = create<WorkingMemoryStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    currentLevel: 1,
    gameType: 'numbers',
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
    level3Phase: 1,
    level4Phase: 1,
    seriesState: initialSeriesState,
    unlockedLevels: [1],
    stats: initialStats,

    // Actions
    generateNewGame: (level: 1 | 2 | 3 | 4 | 5 | 6 | 7 = 1) => {
      const isLevel3 = level === 3;
      const isLevel4 = level === 4;
      const isLevel5 = level === 5;
      const isLevel6 = level === 6;
      const isLevel7 = level === 7;
      
      let mapping: NumberLetterMapping | SyllableMapping | SymbolMapping;
      let gameType: GameType;
      
      if (isLevel3 || isLevel4) {
        mapping = generateSyllableMapping();
        gameType = 'syllables';
      } else if (isLevel5 || isLevel6) {
        mapping = generateSymbolMapping();
        gameType = 'symbols';
      } else if (isLevel7) {
        mapping = {};
        gameType = 'series';
      } else {
        mapping = generateRandomMapping();
        gameType = 'numbers';
      }
      
      // Level 2 and 6 start with reference input (no grid yet)
      // Level 4 also starts with reference input (no grid yet)
      // Level 7 has no grid
      const hasGrid = level === 1 || level === 3 || level === 5;
      const grid = hasGrid ? generateGrid(mapping) : [];
      const startTime = Date.now();

      // For level 7, generate initial series
      const newSeriesState = isLevel7 
        ? { ...initialSeriesState, currentSeries: generateRandomSeries() }
        : initialSeriesState;

      set({
        currentLevel: level,
        gameType,
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
        level3Phase: isLevel3 ? 1 : 1,
        level4Phase: isLevel4 ? 1 : 1,
        seriesState: newSeriesState,
      });
    },
    
    updateCell: (row: number, col: number, value: string) => {
      const { grid, isValidated, gameType } = get();
      
      if (isValidated) return;
      
      const maxLength = gameType === 'syllables' ? 2 : 1;
      
      const newGrid = grid.map((r, rowIndex) =>
        r.map((cell, colIndex) => {
          if (rowIndex === row && colIndex === col && cell.type === 'input') {
            return { ...cell, value: value.toUpperCase().slice(0, maxLength) };
          }
          return cell;
        })
      );
      
      set({ grid: newGrid });
    },
    
    validateAnswers: () => {
      const { grid, mapping, startTime, gameType } = get();
      
      if (!startTime) {
        throw new Error('Game not started');
      }
      
      const endTime = Date.now();
      const timeElapsed = (endTime - startTime) / 1000;
      
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
            
            const expectedValue = numberAbove ? mapping[numberAbove] : null;
            const isCorrect = gameType === 'syllables' 
              ? cell.value === expectedValue
              : cell.value === expectedValue;
            
            if (isCorrect) {
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
        percentage: Math.round(percentage * 10) / 10,
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
      
      get().updateStats(result);
      
      return result;
    },
    
    resetGame: () => {
      set({
        currentLevel: 1,
        gameType: 'numbers',
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
        level3Phase: 1,
        level4Phase: 1,
        seriesState: initialSeriesState,
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

    // Level 2: Continue to level 2
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

    // Level 3: Continue to level 3
    continueToLevel3: () => {
      const mapping = generateSyllableMapping();
      const grid = generateGrid(mapping);
      const startTime = Date.now();

      set({
        currentLevel: 3,
        gameType: 'syllables',
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
        level3Phase: 1,
      });
      
      // Unlock level 3
      get().unlockLevel(3);
    },

    // Level 3: Update phase
    updateLevel3Phase: (phase: Level3Phase) => {
      if (phase === 2) {
        const { mapping } = get();
        const grid = generateGrid(mapping);
        const startTime = Date.now();
        
        set({
          level3Phase: 2,
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
      } else {
        set({ level3Phase: phase });
      }
    },

    // Level 4: Continue to level 4
    continueToLevel4: () => {
      const mapping = generateSyllableMapping();
      const startTime = Date.now();

      set({
        currentLevel: 4,
        gameType: 'syllables',
        mapping,
        grid: [],
        userReferenceInputs: Array(10).fill(''),
        referenceTableValidated: false,
        referenceValidationResult: null,
        startTime,
        endTime: null,
        isCompleted: false,
        isValidated: false,
        validationResult: null,
        level4Phase: 1,
      });
      
      get().unlockLevel(4);
    },

    // Level 4: Update phase
    updateLevel4Phase: (phase: Level4Phase) => {
      if (phase === 2) {
        const { mapping } = get();
        const grid = generateGrid(mapping);
        const startTime = Date.now();
        
        set({
          level4Phase: 2,
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
      } else {
        set({ level4Phase: phase });
      }
    },

    // Level 5: Continue to level 5
    continueToLevel5: () => {
      const mapping = generateSymbolMapping();
      const grid = generateGrid(mapping);
      const startTime = Date.now();

      set({
        currentLevel: 5,
        gameType: 'symbols',
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
      
      get().unlockLevel(5);
    },

    // Level 6: Continue to level 6
    continueToLevel6: () => {
      const mapping = generateSymbolMapping();
      const startTime = Date.now();

      set({
        currentLevel: 6,
        gameType: 'symbols',
        mapping,
        grid: [],
        userReferenceInputs: Array(10).fill(''),
        referenceTableValidated: false,
        referenceValidationResult: null,
        startTime,
        endTime: null,
        isCompleted: false,
        isValidated: false,
        validationResult: null,
      });
      
      get().unlockLevel(6);
    },

    // Level 7: Continue to level 7 (Series Game)
    continueToLevel7: () => {
      const startTime = Date.now();
      const newSeries = generateRandomSeries();

      set({
        currentLevel: 7,
        gameType: 'series',
        mapping: {},
        grid: [],
        userReferenceInputs: Array(10).fill(''),
        referenceTableValidated: false,
        referenceValidationResult: null,
        startTime,
        endTime: null,
        isCompleted: false,
        isValidated: false,
        validationResult: null,
        seriesState: {
          ...initialSeriesState,
          currentSeries: newSeries,
        },
      });
      
      get().unlockLevel(7);
    },

    // Series Game Actions
    generateNewSeries: () => {
      const { seriesState } = get();
      const newSeries = generateRandomSeries(seriesState.currentSeriesLength);
      set({
        seriesState: {
          ...seriesState,
          currentSeries: newSeries,
          userInputs: Array(seriesState.currentSeriesLength).fill(''),
          phase: 'showing',
          currentDigitIndex: 0,
          isAnimating: false,
        },
      });
    },

    startShowingSeries: () => {
      set({
        seriesState: {
          ...get().seriesState,
          phase: 'showing',
          currentDigitIndex: 0,
          isAnimating: true,
        },
      });
    },

    advanceDigitIndex: () => {
      const { seriesState } = get();
      const newIndex = seriesState.currentDigitIndex + 1;
      
      if (newIndex >= seriesState.currentSeries.length) {
        set({
          seriesState: {
            ...seriesState,
            phase: 'input-normal',
            currentDigitIndex: 0,
            isAnimating: false,
          },
        });
      } else {
        set({
          seriesState: {
            ...seriesState,
            currentDigitIndex: newIndex,
          },
        });
      }
    },

    finishShowingSeries: () => {
      set({
        seriesState: {
          ...get().seriesState,
          phase: 'input-normal',
          currentDigitIndex: 0,
          isAnimating: false,
        },
      });
    },

    updateSeriesInput: (index: number, value: string) => {
      const { seriesState } = get();
      const newInputs = [...seriesState.userInputs];
      newInputs[index] = value.slice(-1);
      set({
        seriesState: {
          ...seriesState,
          userInputs: newInputs,
        },
      });
    },

    validateSeriesNormal: () => {
      const { seriesState } = get();
      const { currentSeries, userInputs, currentSeriesLength } = seriesState;
      
      const isCorrect = currentSeries.every(
        (num, idx) => parseInt(userInputs[idx], 10) === num
      );
      
      if (isCorrect) {
        set({
          seriesState: {
            ...seriesState,
            phase: 'input-reverse',
            userInputs: Array(currentSeriesLength).fill(''),
          },
        });
      } else {
        set({
          seriesState: {
            ...seriesState,
            phase: 'showing',
            currentDigitIndex: 0,
            userInputs: Array(currentSeriesLength).fill(''),
            isAnimating: false,
          },
        });
      }
      
      return isCorrect;
    },

    validateSeriesReverse: () => {
      const { seriesState } = get();
      const { currentSeries, userInputs, currentSeriesLength } = seriesState;
      const reversedSeries = [...currentSeries].reverse();
      
      const isCorrect = reversedSeries.every(
        (num, idx) => parseInt(userInputs[idx], 10) === num
      );
      
      if (isCorrect) {
        const newSeriesCorrect = seriesState.seriesCorrect + 1;
        
        if (newSeriesCorrect >= SERIES_REQUIRED_CORRECT) {
          const newLength = currentSeriesLength + 1;
          
          if (newLength > SERIES_MAX_LENGTH) {
            set({
              seriesState: {
                ...seriesState,
                seriesCorrect: newSeriesCorrect,
                phase: 'success',
              },
              isCompleted: true,
            });
          } else {
            const newSeries = generateRandomSeries(newLength);
            set({
              seriesState: {
                ...seriesState,
                seriesCorrect: 0,
                currentSeriesLength: newLength,
                currentSeries: newSeries,
                userInputs: Array(newLength).fill(''),
                phase: 'showing',
                currentDigitIndex: 0,
                isAnimating: false,
              },
            });
          }
        } else {
          const newSeries = generateRandomSeries(currentSeriesLength);
          set({
            seriesState: {
              ...seriesState,
              seriesCorrect: newSeriesCorrect,
              currentSeries: newSeries,
              userInputs: Array(currentSeriesLength).fill(''),
              phase: 'showing',
              currentDigitIndex: 0,
              isAnimating: false,
            },
          });
        }
      } else {
        set({
          seriesState: {
            ...seriesState,
            phase: 'showing',
            currentDigitIndex: 0,
            userInputs: Array(currentSeriesLength).fill(''),
            isAnimating: false,
          },
        });
      }
      
      return isCorrect;
    },

    handleCorrectNormal: () => {
      const { seriesState } = get();
      set({
        seriesState: {
          ...seriesState,
          phase: 'input-reverse',
          userInputs: Array(seriesState.currentSeriesLength).fill(''),
        },
      });
    },

    handleCorrectReverse: () => {
      const { seriesState } = get();
      const { currentSeriesLength } = seriesState;
      const newSeriesCorrect = seriesState.seriesCorrect + 1;
      
      if (newSeriesCorrect >= SERIES_REQUIRED_CORRECT) {
        const newLength = currentSeriesLength + 1;
        
        if (newLength > SERIES_MAX_LENGTH) {
          set({
            seriesState: {
              ...seriesState,
              seriesCorrect: newSeriesCorrect,
              phase: 'success',
            },
            isCompleted: true,
          });
        } else {
          const newSeries = generateRandomSeries(newLength);
          set({
            seriesState: {
              ...seriesState,
              seriesCorrect: 0,
              currentSeriesLength: newLength,
              currentSeries: newSeries,
              userInputs: Array(newLength).fill(''),
              phase: 'showing',
              currentDigitIndex: 0,
              isAnimating: false,
            },
          });
        }
      } else {
        const newSeries = generateRandomSeries(currentSeriesLength);
        set({
          seriesState: {
            ...seriesState,
            seriesCorrect: newSeriesCorrect,
            currentSeries: newSeries,
            userInputs: Array(currentSeriesLength).fill(''),
            phase: 'showing',
            currentDigitIndex: 0,
            isAnimating: false,
          },
        });
      }
    },

    handleIncorrectSeries: () => {
      const { seriesState } = get();
      set({
        seriesState: {
          ...seriesState,
          phase: 'showing',
          currentDigitIndex: 0,
          userInputs: Array(seriesState.currentSeriesLength).fill(''),
          isAnimating: false,
        },
      });
    },

    resetSeriesInputs: () => {
      const { seriesState } = get();
      set({
        seriesState: {
          ...seriesState,
          userInputs: Array(seriesState.currentSeriesLength).fill(''),
        },
      });
    },

    // Unlock level
    unlockLevel: (level: number) => {
      const { unlockedLevels } = get();
      if (!unlockedLevels.includes(level)) {
        const newUnlockedLevels = [...unlockedLevels, level];
        set({ unlockedLevels: newUnlockedLevels });
        
        if (typeof window !== 'undefined') {
          localStorage.setItem(UNLOCKED_LEVELS_KEY, JSON.stringify(newUnlockedLevels));
        }
      }
    },

    // Load unlocked levels
    loadUnlockedLevels: () => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(UNLOCKED_LEVELS_KEY);
        if (stored) {
          try {
            const unlockedLevels = JSON.parse(stored);
            set({ unlockedLevels });
          } catch (error) {
            console.error('Error loading unlocked levels:', error);
          }
        }
      }
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

// Auto-load stats and unlocked levels on initialization
if (typeof window !== 'undefined') {
  useWorkingMemoryStore.getState().loadStats();
  useWorkingMemoryStore.getState().loadUnlockedLevels();
}
