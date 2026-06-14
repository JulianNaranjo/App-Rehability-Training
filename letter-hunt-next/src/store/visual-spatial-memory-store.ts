'use client';

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import {
  GamePhase,
  VisualSpatialMemoryState,
  VisualSpatialMemoryStats,
  GameRoundResult,
  GRID_SIZE,
  getIconsForLevel,
  INITIAL_STATS,
  INITIAL_STATE,
} from '@/types/visual-spatial-memory';

/**
 * Pool of available icons for the visual-spatial memory game
 */
export const SPATIAL_ICONS = [
  { id: 'star', name: 'Estrella' },
  { id: 'circle', name: 'Círculo' },
  { id: 'square', name: 'Cuadrado' },
  { id: 'triangle', name: 'Triángulo' },
  { id: 'heart', name: 'Corazón' },
  { id: 'diamond', name: 'Diamante' },
  { id: 'hexagon', name: 'Hexágono' },
  { id: 'moon', name: 'Luna' },
  { id: 'sun', name: 'Sol' },
  { id: 'cloud', name: 'Nube' },
  { id: 'lightning', name: 'Rayos' },
  { id: 'flower', name: 'Flor' },
  { id: 'tree', name: 'Árbol' },
  { id: 'house', name: 'Casa' },
  { id: 'car', name: 'Coche' },
  { id: 'bird', name: 'Pájaro' },
  { id: 'fish', name: 'Pez' },
  { id: 'cat', name: 'Gato' },
  { id: 'dog', name: 'Perro' },
  { id: 'smile', name: 'Cara feliz' },
] as const;

export type SpatialIconId = typeof SPATIAL_ICONS[number]['id'];

interface VisualSpatialMemoryStore extends VisualSpatialMemoryState {
  stats: VisualSpatialMemoryStats;
  roundHistory: GameRoundResult[];

  // Actions
  startGame: () => void;
  startRound: () => void;
  submitGuess: (position: number) => void;
  finishRound: () => void;
  resetGame: () => void;
  loadStats: () => void;
  setPhase: (phase: GamePhase) => void;
  setLevel: (level: number) => void;
  nextLevel: () => void;

  // Helpers
  getTimeElapsed: () => number;
}

const STORAGE_KEY = 'visual-spatial-memory-stats';

/**
 * Generate n unique random positions within the grid (0 to GRID_SIZE-1)
 */
function generateRandomPositions(count: number): number[] {
  const positions: number[] = [];
  const used = new Set<number>();

  while (positions.length < count) {
    const pos = Math.floor(Math.random() * GRID_SIZE);
    if (!used.has(pos)) {
      used.add(pos);
      positions.push(pos);
    }
  }

  return positions;
}

export const useVisualSpatialMemoryStore = create<VisualSpatialMemoryStore>()(
  subscribeWithSelector((set, get) => ({
    ...INITIAL_STATE,
    stats: INITIAL_STATS,
    roundHistory: [],

    startGame: () => {
      const level = get().level;
      const iconPositions = generateRandomPositions(getIconsForLevel(level));

      set({
        ...INITIAL_STATE,
        level,
        iconPositions,
        currentPhase: 'memorize',
        isActive: true,
        roundStartTime: Date.now(),
      });
    },

    startRound: () => {
      const level = get().level;
      const iconPositions = generateRandomPositions(getIconsForLevel(level));

      set({
        currentPhase: 'memorize',
        iconPositions,
        guessedPositions: [],
        correctGuesses: 0,
        isActive: true,
        roundStartTime: Date.now(),
      });
    },

    submitGuess: (position: number) => {
      const state = get();
      const level = state.level;
      const iconsForLevel = getIconsForLevel(level);
      
      // Don't allow duplicate guesses
      if (state.guessedPositions.includes(position)) {
        return;
      }

      // Check if the guess is correct
      const isCorrect = state.iconPositions.includes(position);
      const newCorrectGuesses = isCorrect 
        ? state.correctGuesses + 1 
        : state.correctGuesses;

      const newGuessedPositions = [...state.guessedPositions, position];

      // If all icons found, auto-finish the round
      if (newCorrectGuesses === iconsForLevel) {
        set({
          guessedPositions: newGuessedPositions,
          correctGuesses: newCorrectGuesses,
          currentPhase: 'results',
        });
        
        // Complete the round
        get().finishRound();
      } else if (newGuessedPositions.length >= 3) {
        // Max 3 guesses reached without finding all icons
        set({
          guessedPositions: newGuessedPositions,
          correctGuesses: newCorrectGuesses,
          currentPhase: 'results',
        });
        
        // Complete the round
        get().finishRound();
      } else {
        set({
          guessedPositions: newGuessedPositions,
          correctGuesses: newCorrectGuesses,
        });
      }
    },

    finishRound: () => {
      const state = get();
      const timeElapsed = state.roundStartTime 
        ? Date.now() - state.roundStartTime 
        : 0;

      const iconsForLevel = getIconsForLevel(state.level);
      const roundResult: GameRoundResult = {
        roundNumber: state.roundsCompleted + 1,
        iconPositions: state.iconPositions,
        guessedPositions: state.guessedPositions,
        correctGuesses: state.correctGuesses,
        timeElapsed,
        wasSuccessful: state.correctGuesses === iconsForLevel,
      };

      // Update stats
      const currentStats = state.stats;
      const newGamesPlayed = currentStats.gamesPlayed + 1;
      const newRoundsCompleted = currentStats.roundsCompleted + (roundResult.wasSuccessful ? 1 : 0);
      const accuracy = (state.correctGuesses / iconsForLevel) * 100;
      const newAverageAccuracy = ((currentStats.averageAccuracy * currentStats.gamesPlayed) + accuracy) / newGamesPlayed;
      const newTotalTime = currentStats.totalTime + timeElapsed;
      const newBestTime = currentStats.bestTime === null 
        ? timeElapsed 
        : Math.min(currentStats.bestTime, timeElapsed);

      const newStats: VisualSpatialMemoryStats = {
        gamesPlayed: newGamesPlayed,
        roundsCompleted: newRoundsCompleted,
        averageAccuracy: Math.round(newAverageAccuracy),
        bestTime: newBestTime,
        totalTime: newTotalTime,
      };

      set({
        roundsCompleted: state.roundsCompleted + 1,
        isActive: false,
        stats: newStats,
        roundHistory: [...state.roundHistory, roundResult],
      });

      // Persist to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
      } catch (error) {
        console.warn('Failed to save visual-spatial memory stats:', error);
      }
    },

    resetGame: () => {
      const currentLevel = get().level;
      set({
        ...INITIAL_STATE,
        level: currentLevel,
        stats: get().stats,
        roundHistory: [],
      });
    },

    loadStats: () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as VisualSpatialMemoryStats;
          set({ stats: parsed });
        }
      } catch (error) {
        console.warn('Failed to load visual-spatial memory stats:', error);
      }
    },

    setPhase: (phase: GamePhase) => {
      set({ currentPhase: phase });
    },

    setLevel: (level: number) => {
      set({ level });
    },

    nextLevel: () => {
      const state = get();
      const newLevel = Math.min(state.level + 1, 10);
      set({ level: newLevel });
    },

    getTimeElapsed: () => {
      const state = get();
      if (!state.roundStartTime) return 0;
      return Date.now() - state.roundStartTime;
    },
  }))
);
