/**
 * Verbal Memory Game Types
 * 
 * Type definitions for the verbal memory game mode.
 * 
 * @module verbal-memory-types
 */

export type VerbalMemoryPhase = 'reading' | 'recall' | 'sentences' | 'results';
export type VerbalMemoryLevel = 1 | 2 | 3 | 4;

export interface VerbalMemoryWord {
  number: number;
  word: string;
}

export interface VerbalMemoryResult {
  totalWords: number;
  correctWords: number;
  incorrectWords: number;
  percentage: number;
  timeElapsed: number;
  details: {
    userWord: string;
    correctWord: string;
    isCorrect: boolean;
  }[];
}

export interface SentenceInput {
  sentence: string;
  selectedWords: string[];
  isValid: boolean;
  usedWords: string[];
}

export interface SentenceValidation {
  totalSentences: number;
  correctSentences: number;
  incorrectSentences: number;
  percentage: number;
  timeElapsed: number;
  details: {
    sentence: string;
    selectedWords: string[];
    foundWords: string[];
    missingWords: string[];
    repeatedWords: string[];
    isValid: boolean;
  }[];
}

export interface VerbalMemoryState {
  currentLevel: VerbalMemoryLevel;
  currentPhase: VerbalMemoryPhase;
  words: VerbalMemoryWord[];
  userInputs: string[];
  sentenceInputs: SentenceInput[];
  startTime: number | null;
  endTime: number | null;
  isCompleted: boolean;
  validationResult: VerbalMemoryResult | null;
  sentenceValidation: SentenceValidation | null;
}

export interface VerbalMemoryStats {
  gamesPlayed: number;
  averageAccuracy: number;
  bestScore: number | null;
  totalTime: number;
}

export const WORDS_PER_GAME = 20;
export const SENTENCES_PER_GAME = 10;
export const WORDS_PER_SENTENCE = 2;

export const LEVEL3_EXAMPLE = {
  words: ['NIÑOS', 'BALÓN'],
  sentence: 'Los niños juegan con el balón',
};

export const WORD_BANK: string[] = [
  'ARCO',
  'MUSEO',
  'BALON',
  'PLAYA',
  'CUERDA',
  'NIÑOS',
  'JARRA',
  'COCO',
  'GORRO',
  'RIO',
  'CAMISA',
  'MARIPOSA',
  'HOJAS',
  'ANILLO',
  'LANA',
  'DARDO',
  'SACO',
  'MAR',
  'CARRO',
  'VELA',
  'CASA',
  'PERRO',
  'GATO',
  'FLOR',
  'SOL',
  'LUNA',
  'ARBOL',
  'NUBE',
  'AGUA',
  'FUEGO',
  'TIERRA',
  'CIELO',
  'PUERTA',
  'VENTANA',
  'MESA',
  'SILLA',
  'LIBRO',
  'LAPIZ',
  'RELOJ',
  'ESPEJO',
  'CAMA',
  'COCINA',
  'BAÑO',
  'PARQUE',
  'CALLE',
  'PUENTE',
  'TORRE',
  'CAMPO',
  'ESTRELLA',
  'CORAZON',
];
