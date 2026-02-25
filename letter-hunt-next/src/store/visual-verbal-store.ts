'use client';

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import {
  VisoVerbalState,
  VisoVerbalPhase,
  VisoVerbalStats,
  DEFAULT_VISO_VERBAL_ITEMS,
} from '@/types/visual-verbal';

interface VisoVerbalStore extends VisoVerbalState {
  stats: VisoVerbalStats;

  startGame: () => void;
  continueToRecall: () => void;
  setUserAnswer: (index: number, answer: string) => void;
  submitAnswers: () => void;
  resetGame: () => void;
  getTimeElapsed: () => number;

  updateStats: (score: number) => void;
  loadStats: () => void;
}

const initialStats: VisoVerbalStats = {
  gamesPlayed: 0,
  averageScore: 0,
  bestScore: 0,
};

const STORAGE_KEY = 'viso-verbal-stats';

function getInitialState(): VisoVerbalState {
  return {
    currentPhase: 'memorize',
    items: [...DEFAULT_VISO_VERBAL_ITEMS],
    userAnswers: ['', '', '', ''],
    correctAnswers: DEFAULT_VISO_VERBAL_ITEMS.map(item => item.name.toLowerCase()),
    startTime: null,
    score: 0,
  };
}

function shuffleItems() {
  const shuffled = [...DEFAULT_VISO_VERBAL_ITEMS].sort(() => Math.random() - 0.5);
  return shuffled;
}

export const useVisoVerbalStore = create<VisoVerbalStore>()(
  subscribeWithSelector((set, get) => ({
    ...getInitialState(),
    stats: initialStats,

    startGame: () => {
      const shuffledItems = shuffleItems();
      const correctAnswers = shuffledItems.map(item => item.name.toLowerCase());
      
      set({
        currentPhase: 'memorize',
        items: shuffledItems,
        userAnswers: ['', '', '', ''],
        correctAnswers,
        startTime: Date.now(),
        score: 0,
      });
    },

    continueToRecall: () => {
      set({
        currentPhase: 'recall',
      });
    },

    setUserAnswer: (index: number, answer: string) => {
      const state = get();
      const newAnswers = [...state.userAnswers];
      newAnswers[index] = answer;
      set({ userAnswers: newAnswers });
    },

    submitAnswers: () => {
      const state = get();
      const userAnswers = state.userAnswers.map(a => a.trim().toLowerCase());
      const correctAnswers = state.correctAnswers;

      let correctCount = 0;
      userAnswers.forEach((answer, index) => {
        if (answer === correctAnswers[index]) {
          correctCount++;
        }
      });

      const score = Math.round((correctCount / correctAnswers.length) * 100);

      set({
        currentPhase: 'results',
        score,
      });

      get().updateStats(score);
    },

    resetGame: () => {
      get().startGame();
    },

    getTimeElapsed: () => {
      const state = get();
      if (!state.startTime) return 0;
      return Date.now() - state.startTime;
    },

    updateStats: (score: number) => {
      const state = get();
      const currentStats = state.stats;

      const newGamesPlayed = currentStats.gamesPlayed + 1;
      const newTotalScore = (currentStats.averageScore * currentStats.gamesPlayed) + score;
      const newAverageScore = Math.round(newTotalScore / newGamesPlayed);
      const newBestScore = Math.max(currentStats.bestScore, score);

      const newStats: VisoVerbalStats = {
        gamesPlayed: newGamesPlayed,
        averageScore: newAverageScore,
        bestScore: newBestScore,
      };

      set({ stats: newStats });

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
      } catch (error) {
        console.warn('Failed to save viso-verbal stats:', error);
      }
    },

    loadStats: () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as VisoVerbalStats;
          set({ stats: parsed });
        }
      } catch (error) {
        console.warn('Failed to load viso-verbal stats:', error);
      }
    },
  }))
);
