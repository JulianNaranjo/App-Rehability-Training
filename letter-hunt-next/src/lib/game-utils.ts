import { GameConfig, BoardPosition, BoardIndex, TileStatus, isTargetLetter, ValidationResults, NUMBERS, SYMBOLS } from '@/types/game';

/**
 * Utility functions for game board manipulation and validation
 */

// Advanced type utilities
export type BoardArray = string[];
export type SolutionSet = Set<number>;
export type SelectionSet = Set<number>;

/**
 * Generate a Fisher-Yates shuffled array
 */
export function fisherYatesShuffle<T>(array: readonly T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get a random integer between min and max (inclusive)
 */
export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Check if a value is a valid number
 */
export function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value) && Number.isFinite(value);
}

/**
 * Get tile status based on game state and position
 */
export function validateCountInput(count: number, maxLetters: number): { valid: boolean; message?: string } {
  if (!isValidNumber(count)) {
    return { valid: false, message: "Por favor ingresa un número válido" };
  }
  
  if (count < 0) {
    return { valid: false, message: "El número no puede ser negativo" };
  }
  
  if (count > maxLetters * 2) {
    return { valid: false, message: `El número no puede ser mayor que ${maxLetters * 2}` };
  }
  
  return { valid: true };
}



/**
 * Convert board index to row/column position
 */
export function indexToPosition(index: number, boardSize: number): BoardPosition {
  return {
    row: Math.floor(index / boardSize),
    col: index % boardSize
  };
}

/**
 * Convert row/column position to board index
 */
export function positionToIndex(position: BoardPosition, boardSize: number): BoardIndex {
  return position.row * boardSize + position.col;
}

/**
 * Check if a position is adjacent (including diagonals)
 */
export function isAdjacent(pos1: BoardPosition, pos2: BoardPosition): boolean {
  const rowDiff = Math.abs(pos1.row - pos2.row);
  const colDiff = Math.abs(pos1.col - pos2.col);
  return rowDiff <= 1 && colDiff <= 1 && (rowDiff > 0 || colDiff > 0);
}

/**
 * Get adjacent positions for a given position
 */
export function getAdjacentPositions(position: BoardPosition, boardSize: number): BoardPosition[] {
  const adjacent: BoardPosition[] = [];
  
  for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
    for (let colOffset = -1; colOffset <= 1; colOffset++) {
      if (rowOffset === 0 && colOffset === 0) continue;
      
      const newRow = position.row + rowOffset;
      const newCol = position.col + colOffset;
      
      if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
        adjacent.push({ row: newRow, col: newCol });
      }
    }
  }
  
  return adjacent;
}

/**
 * Generate a game board with target letters or numbers
 */
export function generateGameBoard(
  config: GameConfig,
  targetLetterTypes: number = 1,    // Number of different letter types (1-4)
  targetLetterCount: number = 56,    // Total target letters (25-30% of board)
  level: number = 1                 // Current level (level 5 uses numbers)
): { board: BoardArray; targetLetters: string[]; solutionIndices: SolutionSet } {
  const { BOARD_SIZE, ALPHABET } = config;
  const totalTiles = BOARD_SIZE * BOARD_SIZE;
  
  // LEVEL 5: Use numbers as targets (4 unique numbers from 0-9)
  const isLevel5 = level === 5;
  // LEVEL 6: Use symbols as targets (4 unique symbols from 15 available)
  const isLevel6 = level === 6;
  
  let targetItems: string[];
  let availableFillers: string[];
  
  if (isLevel5) {
    // Select 4 unique numbers randomly from 0-9
    const shuffledNumbers = fisherYatesShuffle(NUMBERS.split(''));
    targetItems = shuffledNumbers.slice(0, 4); // Exactly 4 unique numbers
    
    // Create filler pool: mix of letters (excluding nothing, all letters are valid) and non-target numbers
    const allLetters = ALPHABET.split('');
    const nonTargetNumbers = NUMBERS.split('').filter(num => !targetItems.includes(num));
    // 50% letters, 50% non-target numbers for balanced distribution
    availableFillers = [...allLetters, ...nonTargetNumbers];
  } else if (isLevel6) {
    // LEVEL 6: Use symbols as targets (4 unique symbols from 15 available)
    const shuffledSymbols = fisherYatesShuffle(SYMBOLS.split(''));
    targetItems = shuffledSymbols.slice(0, 4); // Exactly 4 unique symbols
    
    // Create filler pool: only non-target symbols (no letters, no numbers)
    const nonTargetSymbols = SYMBOLS.split('').filter(sym => !targetItems.includes(sym));
    availableFillers = nonTargetSymbols;
  } else {
    // Levels 1-4: Use letters as targets
    const shuffledAlphabet = fisherYatesShuffle(ALPHABET.split(''));
    targetItems = shuffledAlphabet.slice(0, targetLetterTypes);
    
    // Create board with all non-target letters
    availableFillers = ALPHABET.split('').filter(letter => !targetItems.includes(letter));
  }
  
  // Fill board with filler items first
  const filledBoard: BoardArray = Array(totalTiles).fill(null).map(() => 
    availableFillers[Math.floor(Math.random() * availableFillers.length)]
  );
  
  // Randomly select positions for target items
  const allIndices = Array.from({ length: totalTiles }, (_, i) => i);
  const targetIndices = new Set(
    fisherYatesShuffle(allIndices).slice(0, targetLetterCount)
  );
  
  // Place target items with RANDOM distribution between types
  const board: BoardArray = [...filledBoard];
  const indicesArray = Array.from(targetIndices);
  indicesArray.forEach((index) => {
    // Choose randomly which target item type to place
    const randomTargetIndex = Math.floor(Math.random() * targetItems.length);
    board[index] = targetItems[randomTargetIndex];
  });
  
  // Log distribution for debugging
  const distribution = targetItems.map(item => {
    const count = indicesArray.filter(i => board[i] === item).length;
    return `${item}: ${count}`;
  });
  
  console.log("🔢 GENERATE BOARD INPUTS:", { targetLetterTypes, targetLetterCount, level, isLevel5, isLevel6, config });
  const levelLabel = isLevel6 ? '🎲 LEVEL 6 BOARD GENERATION (SYMBOLS):' : 
                     isLevel5 ? '🎲 LEVEL 5 BOARD GENERATION (NUMBERS):' : 
                     '🎲 BOARD GENERATION (LETTERS):';
  console.log(levelLabel, {
    targetLetterTypes,
    targetLetterCount,
    actualTargetCount: targetIndices.size,
    targetItems,
    distribution,
    level
  });
  
  return {
    board,
    targetLetters: targetItems,
    solutionIndices: targetIndices,
  };
}

/**
 * Check if player selection is correct
 */
export function checkSelection(
  selectedIndices: SelectionSet,
  solutionIndices: SolutionSet,
  boardSize: number
): ValidationResults {
  // Calculate correct selections
  const correctCount = Array.from(selectedIndices).filter(
    index => solutionIndices.has(index)
  ).length;
  
  const wrongCount = selectedIndices.size - correctCount;
  const missedCount = solutionIndices.size - correctCount;
  const totalCount = solutionIndices.size;
  
  const correct = correctCount === totalCount && wrongCount === 0;
  const accuracy = totalCount > 0 ? correctCount / totalCount : 0;
  
  return {
    correct,
    correctCount,
    wrongCount,
    missedCount,
    totalCount,
    accuracy
  };
}

/**
 * Calculate score based on accuracy, speed, level and difficulty (selection mode)
 */
export function calculateScore(
  accuracy: number,
  timeInSeconds: number,
  level: number,
  moveCount: number,
  targetLetterCount: number
): number {
  const baseScore = accuracy * 1000;
  const timeBonus = Math.max(0, 300 - timeInSeconds) * 2;
  const levelMultiplier = level;
  const efficiencyBonus = Math.max(0, 100 - moveCount) * 5;
  const difficultyBonus = targetLetterCount * 500; // More letters = more points
  
  return Math.round((baseScore + timeBonus + difficultyBonus + efficiencyBonus) * levelMultiplier);
}

/**
 * Calculate score for count mode (simplified scoring without move efficiency)
 */
export function calculateCountScore(
  correct: boolean,
  timeInSeconds: number,
  level: number,
  targetLetterCount: number
): number {
  if (!correct) return 0;
  
  const baseScore = 1000;
  const timeBonus = Math.max(0, 300 - timeInSeconds) * 3; // Higher time bonus for count mode
  const levelMultiplier = level;
  const difficultyBonus = targetLetterCount * 300; // Less than selection mode
  
  return Math.round((baseScore + timeBonus + difficultyBonus) * levelMultiplier);
}

/**
 * Get tile status based on game state and position
 */
export function getTileStatus(
  index: number,
  letter: string,
  targetLetters: string[],
  selectedIndices: SelectionSet,
  solutionIndices: SolutionSet,
  gameState: string
): TileStatus {
  if (letter === '') return 'empty';
  
  const isTarget = solutionIndices.has(index);
  const isSelected = selectedIndices.has(index);
  
  // Durante el juego (playing): todas las seleccionadas son 'selected' (violeta)
  if (gameState === 'playing') {
    if (isSelected) return 'selected';
    // Las target no seleccionadas se ven igual que las normales (sin pistas)
    return 'empty';
  }
  
  // Después de verificar (checking/won/lost): mostrar correctas/incorrectas
  if (gameState === 'checking' || gameState === 'won' || gameState === 'lost') {
    if (isTarget && isSelected) return 'correct';      // Target seleccionada = verde
    if (isSelected && !isTarget) return 'wrong';       // No-target seleccionada = rojo
    // Las target no seleccionadas no se marcan (siguen blancas)
    return 'empty';
  }
  
  return 'empty';
}

/**
 * Generate hints for players
 */
export function generateHints(
  board: BoardArray,
  solutionIndices: SolutionSet,
  count: number = 3
): number[] {
  const shuffled = fisherYatesShuffle(Array.from(solutionIndices));
  return shuffled.slice(0, count);
}

/**
 * Validate user input for game settings
 */
export function validateGameInput<T>(
  value: unknown,
  validator: (val: T) => boolean,
  defaultValue: T
): T {
  if (typeof value !== 'undefined' && validator(value as T)) {
    return value as T;
  }
  return defaultValue;
}

/**
 * Create a debounced function for performance
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function for animations
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Local storage utilities with type safety
 */
export const gameStorage = {
  set: <T>(key: string, value: T): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  },
  
  get: <T>(key: string, defaultValue: T): T => {
    try {
      if (typeof window !== 'undefined') {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      }
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
    }
    return defaultValue;
  },
  
  remove: (key: string): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
    }
  },
  
  clear: (): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }
};