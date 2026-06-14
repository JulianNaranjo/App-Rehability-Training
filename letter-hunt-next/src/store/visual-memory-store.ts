'use client';

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import {
  VisualMemoryLevel,
  VisualMemoryPhase,
  VisualMemoryState,
  VisualMemoryStats,
  DEFAULT_SHAPES,
} from '@/types/visual-memory';

interface VisualMemoryStore extends VisualMemoryState {
  stats: VisualMemoryStats;

  startGame: (level?: VisualMemoryLevel) => void;
  selectLevel: (level: VisualMemoryLevel) => void;
  continueToRecall: () => void;
  setDrawingDataUrl: (dataUrl: string | null) => void;
  toggleSelectedShape: (shapeId: string) => void;
  submitSelfEvaluation: (success: boolean) => void;
  resetGame: () => void;
  getTimeElapsed: () => number;

  updateStats: (success: boolean, timeElapsed: number) => void;
  loadStats: () => void;
}

const initialStats: VisualMemoryStats = {
  gamesPlayed: 0,
  timesCompleted: 0,
  averageTime: 0,
};

const STORAGE_KEY = 'visual-memory-stats';

function getInitialState(): VisualMemoryState {
  return {
    currentLevel: 1,
    currentPhase: 'memorize',
    shapes: [...DEFAULT_SHAPES],
    drawingDataUrl: null,
    userSelfEvaluation: null,
    selectedShapes: [],
    startTime: null,
    gamesCompleted: 0,
  };
}

function shuffleShapes(): typeof DEFAULT_SHAPES {
  const shuffled = [...DEFAULT_SHAPES].sort(() => Math.random() - 0.5);
  return shuffled;
}

export const useVisualMemoryStore = create<VisualMemoryStore>()(
  subscribeWithSelector((set, get) => ({
    ...getInitialState(),
    stats: initialStats,

    startGame: (level = 1) => {
      set({
        currentLevel: level as VisualMemoryLevel,
        currentPhase: 'memorize',
        shapes: shuffleShapes(),
        drawingDataUrl: null,
        userSelfEvaluation: null,
        selectedShapes: [],
        startTime: Date.now(),
      });
    },

    selectLevel: (level: VisualMemoryLevel) => {
      set({
        currentLevel: level,
        currentPhase: 'memorize',
        shapes: shuffleShapes(),
        drawingDataUrl: null,
        userSelfEvaluation: null,
        selectedShapes: [],
        startTime: Date.now(),
      });
    },

    continueToRecall: () => {
      set({
        currentPhase: 'recall',
      });
    },

    setDrawingDataUrl: (dataUrl: string | null) => {
      set({ drawingDataUrl: dataUrl });
    },

    toggleSelectedShape: (shapeId: string) => {
      const state = get();
      const currentSelected = state.selectedShapes;
      const isSelected = currentSelected.includes(shapeId);
      
      const newSelected = isSelected
        ? currentSelected.filter(id => id !== shapeId)
        : [...currentSelected, shapeId];
      
      set({ selectedShapes: newSelected });
    },

    submitSelfEvaluation: (success: boolean) => {
      const state = get();
      const timeElapsed = state.startTime ? Date.now() - state.startTime : 0;
      
      set({
        userSelfEvaluation: success,
        currentPhase: 'results',
      });

      get().updateStats(success, timeElapsed);
    },

    resetGame: () => {
      const state = get();
      set({
        ...getInitialState(),
        gamesCompleted: state.gamesCompleted,
      });
    },

    getTimeElapsed: () => {
      const state = get();
      if (!state.startTime) return 0;
      return Date.now() - state.startTime;
    },

    updateStats: (success: boolean, timeElapsed: number) => {
      const state = get();
      const currentStats = state.stats;
      
      const newGamesPlayed = currentStats.gamesPlayed + 1;
      const newTimesCompleted = success 
        ? currentStats.timesCompleted + 1 
        : currentStats.timesCompleted;
      const newTotalTime = (currentStats.averageTime * currentStats.gamesPlayed) + timeElapsed;
      const newAverageTime = newTotalTime / newGamesPlayed;

      const newStats: VisualMemoryStats = {
        gamesPlayed: newGamesPlayed,
        timesCompleted: newTimesCompleted,
        averageTime: Math.round(newAverageTime / 1000),
      };

      set({ stats: newStats });

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
      } catch (error) {
        console.warn('Failed to save visual memory stats:', error);
      }
    },

    loadStats: () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as VisualMemoryStats;
          set({ stats: parsed });
        }
      } catch (error) {
        console.warn('Failed to load visual memory stats:', error);
      }
    },
  }))
);
