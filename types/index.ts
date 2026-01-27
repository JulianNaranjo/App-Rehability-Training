export interface GameConfig {
  boardSize: number;
  minTargetPercentage: number;
  maxTargetPercentage: number;
  alphabet: string;
}

export interface LevelConfig {
  level: number;
  targets: string[];
  targetCount: number;
}

export interface GameState {
  currentLevel: number;
  letters: string[];
  solutionIndices: Set<number>;
  selectedIndices: Set<number>;
  targets: string[];
}

export interface UIState {
  feedback: string;
  feedbackType: 'success' | 'error' | '';
  showContinue: boolean;
  showCheck: boolean;
}

export type TileState = 'default' | 'selected' | 'correct' | 'wrong';

export interface DOMElements {
  boardEl: HTMLElement;
  instructionEl: HTMLElement;
  refreshBtn: HTMLButtonElement;
  inputEl: HTMLInputElement;
  checkBtn: HTMLButtonElement;
  continueBtn: HTMLButtonElement;
  feedbackEl: HTMLElement;
}