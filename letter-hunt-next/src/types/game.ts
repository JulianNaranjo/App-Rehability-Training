// Game configuration and type definitions

// Web Audio API type extensions
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}
export interface GameConfig {
  BOARD_SIZE: number;
  MIN_TARGET_PERCENTAGE: number;
  MAX_TARGET_PERCENTAGE: number;
  ALPHABET: string;
  ANIMATION_STAGGER_DELAY: number;
}

export interface GameState {
  board: string[];
  targetLetters: string[];
  targetLetterCount: number;
  targetLetterTypes: number; // Number of different letter types (1-4)
  solutionIndices: Set<number>;
  selectedIndices: Set<number>;
  currentLevel: number;
  score: number;
  moveCount: number;
  gameState: GameStatus;
  startTime: number | null;
  endTime: number | null;
  gameMode: GameMode;
  userCount?: number; // User's count in count mode
  isCountSubmitted?: boolean; // Whether count has been submitted
  validationResults?: ValidationResults | null;
}

export type GameMode = 'selection' | 'count';

export interface ValidationResults {
  correct: boolean;
  correctCount: number;
  wrongCount: number;
  missedCount: number;
  totalCount: number;
  accuracy: number;
}

export type GameStatus = 
  | 'idle' 
  | 'playing' 
  | 'checking' 
  | 'won' 
  | 'lost' 
  | 'paused';

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  bestTime: number | null;
  averageTime: number;
  totalMoves: number;
  accuracy: number;
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  time: number;
  level: number;
  date: string;
}

export interface GameTheme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    error: string;
    warning: string;
    background: string;
    surface: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
    mono: string;
  };
}

export interface TileAnimation {
  index: number;
  type: 'select' | 'deselect' | 'correct' | 'wrong' | 'celebrate';
  duration: number;
}

export interface GameAction {
  type: 'GENERATE_GAME' | 'SELECT_TILE' | 'DESELECT_TILE' | 'CHECK_ANSWER' | 'RESET_GAME' | 'PAUSE_GAME' | 'RESUME_GAME';
  payload?: any;
}

// Advanced type utilities for game logic
export type BoardPosition = { row: number; col: number };
export type BoardIndex = number;

export type PositionToIndex<T extends number> = T extends 15 ? 
  `pos-${T}-${T}` : never;

export type TileStatus = 
  | 'empty'
  | 'target'
  | 'selected'
  | 'correct'
  | 'wrong';

export type GameEvent = 
  | { type: 'GAME_STARTED'; payload: { level: number; targetLetters: string[] } }
  | { type: 'TILE_SELECTED'; payload: { index: number; letter: string } }
  | { type: 'TILE_DESELECTED'; payload: { index: number } }
  | { type: 'ANSWER_CHECKED'; payload: { correct: boolean; score: number } }
  | { type: 'GAME_COMPLETED'; payload: { time: number; score: number } }
  | { type: 'GAME_PAUSED' }
  | { type: 'GAME_RESUMED' };

export type GameEventListener = (event: GameEvent) => void;

export interface AccessibilitySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  screenReader: boolean;
  keyboardOnly: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

export interface GameSettings {
  theme: GameTheme;
  soundEnabled: boolean;
  animationsEnabled: boolean;
  accessibility: AccessibilitySettings;
  autoSave: boolean;
  showHints: boolean;
}

// Type-safe API types
export interface GameAPI {
  createGame: (level: number) => Promise<{ board: string[]; targetLetter: string; solution: number[] }>;
  submitScore: (score: number, time: number, level: number) => Promise<LeaderboardEntry>;
  getLeaderboard: () => Promise<LeaderboardEntry[]>;
  saveStats: (stats: GameStats) => Promise<void>;
  loadStats: () => Promise<GameStats>;
}

// Utility types for game logic
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type GameStateSnapshot = Readonly<GameState>;

export type GameActionCreator<T extends GameAction['type'], P = any> = P extends void ? 
  () => { type: T } : 
  (payload: P) => { type: T; payload: P };

// Type guards
export function isValidGameState(state: any): state is GameState {
  return state && 
         typeof state.board === 'object' &&
         typeof state.targetLetter === 'string' &&
         typeof state.currentLevel === 'number' &&
         ['idle', 'playing', 'checking', 'won', 'lost', 'paused'].includes(state.gameState);
}

export function isValidTileIndex(index: number, boardSize: number): boolean {
  return Number.isInteger(index) && index >= 0 && index < boardSize * boardSize;
}

export function isTargetLetter(letter: string, target: string): boolean {
  return typeof letter === 'string' && 
         typeof target === 'string' && 
         letter.toUpperCase() === target.toUpperCase();
}

// Export default configuration
export const DEFAULT_GAME_CONFIG: GameConfig = {
  BOARD_SIZE: 15,
  MIN_TARGET_PERCENTAGE: 0.25,
  MAX_TARGET_PERCENTAGE: 0.30,
  ALPHABET: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  ANIMATION_STAGGER_DELAY: 0.05,
} as const;