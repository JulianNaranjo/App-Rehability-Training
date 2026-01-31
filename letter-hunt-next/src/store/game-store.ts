import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { 
  GameState, 
  GameStatus,
  GameMode,
  GameStats, 
  LeaderboardEntry, 
  GameSettings, 
  AccessibilitySettings,
  GameEvent,
  GameEventListener,
  ValidationResults,
  DEFAULT_GAME_CONFIG
} from '@/types/game';
import { 
  generateGameBoard, 
  checkSelection, 
  calculateScore,
  calculateCountScore,
  gameStorage
} from '@/lib/game-utils';
import { soundManager } from '@/lib/sounds';

/**
 * Determine target letter TYPES based on level (1-4 different letters)
 */
const getLevelTargetTypes = (level: number): number => {
  if (level === 1) return 1;        // Nivel 1: 1 tipo de letra
  if (level === 2) return 2;        // Nivel 2: 2 tipos de letras
  if (level === 3) return 3;        // Nivel 3: 3 tipos de letras
  return 4;                         // Nivel 4+: 4 tipos de letras (máximo)
};

/**
 * Calculate total target letters (25-30% of board)
 */
const getTargetLetterCount = (): number => {
  const totalTiles = DEFAULT_GAME_CONFIG.BOARD_SIZE * DEFAULT_GAME_CONFIG.BOARD_SIZE; // 15x15 = 225
  const minPercentage = DEFAULT_GAME_CONFIG.MIN_TARGET_PERCENTAGE; // 0.25 = 25%
  const maxPercentage = DEFAULT_GAME_CONFIG.MAX_TARGET_PERCENTAGE; // 0.30 = 30%
  const randomPercentage = minPercentage + Math.random() * (maxPercentage - minPercentage);
  const calculatedCount = Math.round(totalTiles * randomPercentage);
  
  // Validate the result is within expected range
  const minExpected = Math.round(totalTiles * minPercentage); // 56
  const maxExpected = Math.round(totalTiles * maxPercentage); // 68
  const finalCount = Math.max(minExpected, Math.min(maxExpected, calculatedCount));
  
  console.log('🎯 getTargetLetterCount DEBUG:', {
    totalTiles,
    minPercentage,
    maxPercentage,
    randomPercentage,
    calculatedCount,
    minExpected,
    maxExpected,
    finalCount
  });
  
  return finalCount;
};

interface GameStore extends GameState {
  // Actions
  generateNewGame: (level?: number, targetLetterCount?: number, gameMode?: GameMode) => void;
  selectTile: (index: number) => void;
  deselectTile: (index: number) => void;
  checkAnswer: () => void;
  resetGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  setLevel: (level: number) => void;
  setTargetLetterCount: (count: number) => void;
  nextLevel: () => void;
  setUserCount: (count: number) => void;
  
  // Stats and persistence
  stats: GameStats;
  updateStats: () => void;
  loadStats: () => void;
  accuracy: number;
  
  // Leaderboard
  leaderboard: LeaderboardEntry[];
  loadLeaderboard: () => void;
  addToLeaderboard: (name: string) => void;
  
  // Settings
  settings: GameSettings;
  updateSettings: (settings: Partial<GameSettings>) => void;
  loadSettings: () => void;
  
  // Event system
  eventListeners: Set<GameEventListener>;
  addEventListener: (listener: GameEventListener) => () => void;
  removeEventListener: (listener: GameEventListener) => void;
  notifyListeners: (event: GameEvent) => void;
  
  // Utility
  elapsedTime: number;
  updateElapsedTime: () => void;
}

const initialGameState: Omit<GameState, 'board' | 'targetLetters' | 'targetLetterCount' | 'solutionIndices' | 'selectedIndices' | 'userCount' | 'isCountSubmitted' | 'validationResults'> = {
  currentLevel: 1,
  score: 0,
  moveCount: 0,
  gameState: 'idle',
  startTime: null,
  endTime: null,
  gameMode: 'selection', // Default mode
  targetLetterTypes: 1, // Default to 1 type
};

const initialStats: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  bestTime: null,
  averageTime: 0,
  totalMoves: 0,
  accuracy: 0,
};

const initialSettings: GameSettings = {
  theme: {
    name: 'default',
    colors: {
      primary: '#8b5cf6',
      secondary: '#14b8a6',
      accent: '#f97316',
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      background: '#0a0a0a',
      surface: '#1a1a1a',
      text: '#fafafa',
    },
    fonts: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif',
      mono: 'JetBrains Mono, monospace',
    },
  },
  soundEnabled: true,
  animationsEnabled: true,
  accessibility: {
    reducedMotion: false,
    highContrast: false,
    screenReader: false,
    keyboardOnly: false,
    fontSize: 'medium',
  },
  autoSave: true,
  showHints: false,
};

export const useGameStore = create<GameStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    ...initialGameState,
    board: [],
    targetLetters: [],
    targetLetterCount: 56,
    targetLetterTypes: 1,
    solutionIndices: new Set(),
    selectedIndices: new Set(),
    accuracy: 0,
    validationResults: null,
    
    stats: initialStats,
    leaderboard: [],
    settings: initialSettings,
    elapsedTime: 0,
    eventListeners: new Set<GameEventListener>(),
    
    // Actions
    generateNewGame: (level?: number, targetLetterCount?: number, gameMode?: GameMode) => {
      const currentLevel = level ?? get().currentLevel;
      const targetTypes = getLevelTargetTypes(currentLevel);
      const targetCount = targetLetterCount ?? getTargetLetterCount(); console.log("🎯 TARGET COUNT DEBUG:", { targetLetterCount, calculated: getTargetLetterCount(), final: targetCount });
      const selectedGameMode = gameMode ?? get().gameMode ?? 'selection';
      const { board, targetLetters, solutionIndices } = generateGameBoard(
        DEFAULT_GAME_CONFIG, 
        targetTypes,
        targetCount
      );
      
      const startTime = Date.now();
      const { settings } = get();
      
      set({
        board,
        targetLetters,
        targetLetterCount: targetCount,
        targetLetterTypes: targetTypes,
        solutionIndices,
        selectedIndices: new Set(),
        currentLevel,
        gameState: 'playing',
        startTime,
        endTime: null,
        elapsedTime: 0,
        moveCount: 0,

        gameMode: selectedGameMode,
        userCount: undefined,
        isCountSubmitted: false,
      });
      
      // Play sound effect
      if (settings.soundEnabled) {
        soundManager.playNewGame();
      }
      
      get().notifyListeners({
        type: 'GAME_STARTED',
        payload: { level: currentLevel, targetLetters }
      });
    },
    
    selectTile: (index: number) => {
      const { gameState, selectedIndices, board, settings, gameMode } = get();
      
      if (gameState !== 'playing' || gameMode !== 'selection') return;
      
      const newSelected = new Set(selectedIndices);
      newSelected.add(index);
      
      set({ 
        selectedIndices: newSelected,
        moveCount: get().moveCount + 1
      });
      
      // Play sound effect
      if (settings.soundEnabled) {
        soundManager.playTileSelect();
      }
      
      get().notifyListeners({
        type: 'TILE_SELECTED',
        payload: { index, letter: board[index] }
      });
    },
    
    deselectTile: (index: number) => {
      const { gameState, selectedIndices, settings } = get();
      
      if (gameState !== 'playing') return;
      
      const newSelected = new Set(selectedIndices);
      newSelected.delete(index);
      
      set({ selectedIndices: newSelected });
      
      // Play sound effect
      if (settings.soundEnabled) {
        soundManager.playTileDeselect();
      }
      
      get().notifyListeners({
        type: 'TILE_DESELECTED',
        payload: { index }
      });
    },
    
    checkAnswer: () => {
      const { selectedIndices, solutionIndices, currentLevel, startTime, gameMode, userCount, targetLetterCount } = get();
      
      set({ gameState: 'checking' });
      
      let correct = false;
      let accuracy = 0;
      let score = 0;
      
      if (gameMode === 'selection') {
        const result = checkSelection(
          selectedIndices,
          solutionIndices,
          DEFAULT_GAME_CONFIG.BOARD_SIZE
        );
        correct = result.correct;
        accuracy = result.accuracy;
        
        // Store validation results for UI
        set({ validationResults: result });
        
        const endTime = Date.now();
        const timeInSeconds = startTime ? (endTime - startTime) / 1000 : 0;
        score = calculateScore(accuracy, timeInSeconds, currentLevel, selectedIndices.size, solutionIndices.size);
      } else if (gameMode === 'count') {
        // Count mode: check if user count matches actual target letters on board
        set({ validationResults: null });
        const actualTargetCount = solutionIndices.size;
        console.log('🧮 COUNT VALIDATION:', {
          userCount,
          actualTargetCount,
          targetLetterCount: targetLetterCount,
          solutionIndicesSize: solutionIndices.size
        });
        correct = userCount === actualTargetCount;
        accuracy = correct ? 100 : 0;
        
        const endTime = Date.now();
        const timeInSeconds = startTime ? (endTime - startTime) / 1000 : 0;
        score = calculateCountScore(correct, timeInSeconds, currentLevel, targetLetterCount);
      }
      
      const endTime = Date.now();
      const finalTimeInSeconds = startTime ? (endTime - startTime) / 1000 : 0;
      
      setTimeout(() => {
        const { settings } = get();
        
        set({
          gameState: correct ? 'won' : 'lost',
          endTime,
          score,
          accuracy,
        });
        
        // Play sound effect
        if (settings.soundEnabled) {
          if (correct) {
            soundManager.playWin();
          } else {
            soundManager.playLose();
          }
        }
        
        get().notifyListeners({
          type: 'ANSWER_CHECKED',
          payload: { correct, score }
        });
        
        if (correct) {
          get().updateStats();
          get().notifyListeners({
            type: 'GAME_COMPLETED',
            payload: { time: finalTimeInSeconds, score }
          });
        }
      }, 1500); // Dramatic pause for animation
    },
    
    resetGame: () => {
      set({
        ...initialGameState,
        board: [],
        targetLetters: [],
    targetLetterCount: getTargetLetterCount(), // Calculate dynamically (25-30% of board)
        solutionIndices: new Set(),
        selectedIndices: new Set(),
        accuracy: 0,

        elapsedTime: 0,
      });
    },
    
    pauseGame: () => {
      if (get().gameState === 'playing') {
        set({ gameState: 'paused' });
        get().notifyListeners({ type: 'GAME_PAUSED' });
      }
    },
    
    resumeGame: () => {
      if (get().gameState === 'paused') {
        set({ gameState: 'playing' });
        get().notifyListeners({ type: 'GAME_RESUMED' });
      }
    },
    
    setLevel: (level: number) => {
      set({ currentLevel: Math.max(1, level) });
    },
    
    setTargetLetterCount: (count: number) => {
      // Validate count is within expected range (25-30% of 225 tiles = 56-67)
      const minCount = Math.round(225 * 0.25); // 56
      const maxCount = Math.round(225 * 0.30); // 68
      const validCount = Math.max(minCount, Math.min(maxCount, count));
      console.log('🔧 setTargetLetterCount:', { input: count, result: validCount, range: `${minCount}-${maxCount}` });
      set({ targetLetterCount: validCount });
    },
    
    nextLevel: () => {
      const currentLevel = get().currentLevel;
      const gameMode = get().gameMode;
      const newLevel = currentLevel + 1;
      set({ currentLevel: newLevel });
      get().generateNewGame(newLevel, undefined, gameMode); // Will auto-calculate
    },
    
    setUserCount: (count: number) => {
      set({ userCount: count });
    },
    
    // Stats management
    updateStats: () => {
      const { stats, elapsedTime, accuracy } = get();
      
      const newStats: GameStats = {
        gamesPlayed: stats.gamesPlayed + 1,
        gamesWon: stats.gamesWon + 1,
        bestTime: stats.bestTime === null || elapsedTime < stats.bestTime 
          ? elapsedTime 
          : stats.bestTime,
        averageTime: (stats.averageTime * stats.gamesWon + elapsedTime) / (stats.gamesWon + 1),
        totalMoves: stats.totalMoves + get().moveCount,
        accuracy: (stats.accuracy * stats.gamesWon + accuracy) / (stats.gamesWon + 1),
      };
      
      set({ stats: newStats });
      
      if (get().settings.autoSave) {
        gameStorage.set('letter-hunt-stats', newStats);
      }
    },
    
    loadStats: () => {
      const stats = gameStorage.get('letter-hunt-stats', initialStats);
      set({ stats });
    },
    
    // Leaderboard management
    loadLeaderboard: () => {
      const leaderboard = gameStorage.get('letter-hunt-leaderboard', [] as LeaderboardEntry[]);
      set({ leaderboard });
    },
    
    addToLeaderboard: (name: string) => {
      const { score, elapsedTime, currentLevel } = get();
      const entry: LeaderboardEntry = {
        id: Date.now().toString(),
        playerName: name,
        score,
        time: elapsedTime,
        level: currentLevel,
        date: new Date().toISOString(),
      };
      
      const leaderboard = [...get().leaderboard, entry]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10); // Keep top 10
      
      set({ leaderboard });
      gameStorage.set('letter-hunt-leaderboard', leaderboard);
    },
    
    // Settings management
    updateSettings: (newSettings: Partial<GameSettings>) => {
      const updatedSettings = { ...get().settings, ...newSettings };
      set({ settings: updatedSettings });
      gameStorage.set('letter-hunt-settings', updatedSettings);
    },
    
    loadSettings: () => {
      const settings = gameStorage.get('letter-hunt-settings', initialSettings);
      set({ settings });
    },
    
    // Event system
    addEventListener: (listener: GameEventListener) => {
      const listeners = get().eventListeners as Set<GameEventListener>;
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    
    removeEventListener: (listener: GameEventListener) => {
      (get().eventListeners as Set<GameEventListener>).delete(listener);
    },
    
    notifyListeners: (event: GameEvent) => {
      (get().eventListeners as Set<GameEventListener>).forEach(listener => {
        try {
          listener(event);
        } catch (error) {
          console.error('Error in game event listener:', error);
        }
      });
    },
    
    // Utility
    updateElapsedTime: () => {
      const { gameState, startTime } = get();
      if (gameState === 'playing' && startTime) {
        set({ elapsedTime: (Date.now() - startTime) / 1000 });
      }
    },
  }))
);

// Auto-load persisted data on store initialization
if (typeof window !== 'undefined') {
  useGameStore.getState().loadStats();
  useGameStore.getState().loadSettings();
  useGameStore.getState().loadLeaderboard();
  
  // Save settings when they change
  useGameStore.subscribe(
    (state) => state.settings,
    (settings) => {
      const currentState = useGameStore.getState();
      if (currentState.settings.autoSave) {
        gameStorage.set('letter-hunt-settings', settings);
      }
    }
  );
}