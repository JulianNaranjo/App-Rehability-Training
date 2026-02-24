'use client';

/**
 * Verbal Memory Store
 * 
 * Zustand store for managing verbal memory game state.
 * Supports Level 1 (recall) and Level 2 (alphabetical ordering).
 * 
 * @module verbal-memory-store
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import {
  VerbalMemoryState,
  VerbalMemoryResult,
  VerbalMemoryStats,
  VerbalMemoryWord,
  VerbalMemoryLevel,
  SentenceInput,
  SentenceValidation,
  WORD_BANK,
  WORDS_PER_GAME,
  SENTENCES_PER_GAME,
  WORDS_PER_SENTENCE,
} from '@/types/verbal-memory';

interface VerbalMemoryStore extends VerbalMemoryState {
  stats: VerbalMemoryStats;

  startGame: (level?: VerbalMemoryLevel) => void;
  selectLevel: (level: VerbalMemoryLevel) => void;
  continueToRecall: () => void;
  continueToSentences: () => void;
  continueToLevel4: () => void;
  updateInput: (index: number, value: string) => void;
  updateSentenceInput: (index: number, sentence: string, selectedWords: string[]) => void;
  validateAnswers: () => VerbalMemoryResult;
  validateSentences: () => SentenceValidation;
  resetGame: () => void;
  getTimeElapsed: () => number;

  updateStats: (result: VerbalMemoryResult) => void;
  loadStats: () => void;
}

const initialStats: VerbalMemoryStats = {
  gamesPlayed: 0,
  averageAccuracy: 0,
  bestScore: null,
  totalTime: 0,
};

const STORAGE_KEY = 'verbal-memory-stats';

function getRandomWords(): VerbalMemoryWord[] {
  const shuffled = [...WORD_BANK].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, WORDS_PER_GAME).map((word, index) => ({
    number: index + 1,
    word,
  }));
}

function getInitialSentenceInputs(): SentenceInput[] {
  return Array(SENTENCES_PER_GAME).fill(null).map(() => ({
    sentence: '',
    selectedWords: [],
    isValid: false,
    usedWords: [],
  }));
}

export const useVerbalMemoryStore = create<VerbalMemoryStore>()(
  subscribeWithSelector((set, get) => ({
    currentLevel: 1,
    currentPhase: 'reading',
    words: [],
    userInputs: Array(WORDS_PER_GAME).fill(''),
    sentenceInputs: getInitialSentenceInputs(),
    startTime: null,
    endTime: null,
    isCompleted: false,
    validationResult: null,
    sentenceValidation: null,
    stats: initialStats,

    startGame: (level: VerbalMemoryLevel = 1) => {
      const startTime = Date.now();
      const randomWords = getRandomWords();
      set({
        currentLevel: level,
        currentPhase: 'reading',
        words: randomWords,
        userInputs: Array(WORDS_PER_GAME).fill(''),
        sentenceInputs: getInitialSentenceInputs(),
        startTime,
        endTime: null,
        isCompleted: false,
        validationResult: null,
        sentenceValidation: null,
      });
    },

    selectLevel: (level: VerbalMemoryLevel) => {
      const startTime = Date.now();
      const randomWords = getRandomWords();
      set({
        currentLevel: level,
        currentPhase: 'reading',
        words: randomWords,
        userInputs: Array(WORDS_PER_GAME).fill(''),
        sentenceInputs: getInitialSentenceInputs(),
        startTime,
        endTime: null,
        isCompleted: false,
        validationResult: null,
        sentenceValidation: null,
      });
    },

    continueToRecall: () => {
      set({
        currentPhase: 'recall',
      });
    },

    continueToSentences: () => {
      set({
        currentPhase: 'sentences',
      });
    },

    continueToLevel4: () => {
      const { words } = get();
      set({
        currentLevel: 4,
        currentPhase: 'recall',
        userInputs: Array(WORDS_PER_GAME).fill(''),
      });
    },

    updateSentenceInput: (index: number, sentence: string, selectedWords: string[]) => {
      const { sentenceInputs, currentPhase } = get();
      if (currentPhase !== 'sentences') return;

      const allUsedWords: string[] = [];
      sentenceInputs.forEach((input, i) => {
        if (i !== index) {
          allUsedWords.push(...input.selectedWords);
        }
      });

      const newInputs = [...sentenceInputs];
      newInputs[index] = {
        sentence,
        selectedWords,
        isValid: selectedWords.length === WORDS_PER_SENTENCE,
        usedWords: allUsedWords,
      };
      set({ sentenceInputs: newInputs });
    },

    updateInput: (index: number, value: string) => {
      const { userInputs, currentPhase } = get();
      if (currentPhase !== 'recall') return;

      const newInputs = [...userInputs];
      newInputs[index] = value.toUpperCase();
      set({ userInputs: newInputs });
    },

    validateAnswers: () => {
      const { words, userInputs, startTime, currentLevel } = get();

      if (!startTime) {
        throw new Error('Game not started');
      }

      const endTime = Date.now();
      const timeElapsed = (endTime - startTime) / 1000;

      let correctWords = 0;
      const details: VerbalMemoryResult['details'] = [];

      if (currentLevel === 1) {
        // Level 1: Compare with original words in order
        words.forEach((wordItem, index) => {
          const userWord = userInputs[index]?.trim().toUpperCase() || '';
          const correctWord = wordItem.word.toUpperCase();
          const isCorrect = userWord === correctWord;

          if (isCorrect) {
            correctWords++;
          }

          details.push({
            userWord,
            correctWord,
            isCorrect,
          });
        });
      } else if (currentLevel === 2) {
        // Level 2: Compare with alphabetically sorted words
        const sortedWords = [...words]
          .map((w) => w.word)
          .sort((a, b) => a.localeCompare(b, 'es'));

        for (let i = 0; i < WORDS_PER_GAME; i++) {
          const userWord = userInputs[i]?.trim().toUpperCase() || '';
          const correctWord = sortedWords[i].toUpperCase();
          const isCorrect = userWord === correctWord;

          if (isCorrect) {
            correctWords++;
          }

          details.push({
            userWord,
            correctWord,
            isCorrect,
          });
        }
      } else {
        // Level 4: Compare any order (free recall)
        const correctWordList = words.map(w => w.word.toUpperCase());
        const uniqueUserInputs = [...new Set(userInputs.map(i => i?.trim().toUpperCase() || ''))];
        
        uniqueUserInputs.forEach(userWord => {
          if (userWord && correctWordList.includes(userWord)) {
            correctWords++;
          }
        });

        // For details, show all 20 original words
        words.forEach((wordItem, index) => {
          const correctWord = wordItem.word.toUpperCase();
          const isCorrect = uniqueUserInputs.includes(correctWord);
          
          details.push({
            userWord: uniqueUserInputs.includes(correctWord) ? correctWord : '',
            correctWord,
            isCorrect,
          });
        });
      }

      const incorrectWords = WORDS_PER_GAME - correctWords;
      const percentage = Math.round((correctWords / WORDS_PER_GAME) * 100);

      const result: VerbalMemoryResult = {
        totalWords: WORDS_PER_GAME,
        correctWords,
        incorrectWords,
        percentage,
        timeElapsed: Math.round(timeElapsed * 10) / 10,
        details,
      };

      set({
        currentPhase: 'results',
        endTime,
        isCompleted: true,
        validationResult: result,
      });

      get().updateStats(result);

      return result;
    },

    validateSentences: () => {
      const { sentenceInputs, startTime, words } = get();

      if (!startTime) {
        throw new Error('Game not started');
      }

      const endTime = Date.now();
      const timeElapsed = (endTime - startTime) / 1000;

      const validWordsList = words.map(w => w.word.toUpperCase());
      const allUsedWordsInSentences: string[] = [];
      
      const details: SentenceValidation['details'] = [];
      let correctSentences = 0;

      sentenceInputs.forEach((input, index) => {
        const sentenceUpper = input.sentence.toUpperCase();
        const selectedWordsUpper = input.selectedWords.map(w => w.toUpperCase());
        
        const foundWords: string[] = [];
        const missingWords: string[] = [];
        const repeatedWords: string[] = [];

        const wordsInSentenceUpper = sentenceUpper.split(/\s+/);
        
        selectedWordsUpper.forEach(word => {
          if (wordsInSentenceUpper.includes(word)) {
            foundWords.push(word);
          } else {
            missingWords.push(word);
          }
        });

        const otherSentencesUsedWords: string[] = [];
        sentenceInputs.forEach((otherInput, otherIndex) => {
          if (otherIndex !== index) {
            otherSentencesUsedWords.push(...otherInput.selectedWords.map(w => w.toUpperCase()));
          }
        });

        selectedWordsUpper.forEach(word => {
          if (otherSentencesUsedWords.includes(word)) {
            if (!repeatedWords.includes(word)) {
              repeatedWords.push(word);
            }
          }
        });

        if (otherSentencesUsedWords.length > 0) {
          otherSentencesUsedWords.forEach(word => {
            if (!allUsedWordsInSentences.includes(word)) {
              allUsedWordsInSentences.push(word);
            }
          });
        }

        const isValid = foundWords.length === WORDS_PER_SENTENCE && 
                        missingWords.length === 0 && 
                        repeatedWords.length === 0;

        if (isValid) {
          correctSentences++;
        }

        details.push({
          sentence: input.sentence,
          selectedWords: input.selectedWords,
          foundWords,
          missingWords,
          repeatedWords,
          isValid,
        });
      });

      const incorrectSentences = SENTENCES_PER_GAME - correctSentences;
      const percentage = Math.round((correctSentences / SENTENCES_PER_GAME) * 100);

      const result: SentenceValidation = {
        totalSentences: SENTENCES_PER_GAME,
        correctSentences,
        incorrectSentences,
        percentage,
        timeElapsed: Math.round(timeElapsed * 10) / 10,
        details,
      };

      set({
        currentPhase: 'results',
        endTime,
        isCompleted: true,
        sentenceValidation: result,
      });

      return result;
    },

    resetGame: () => {
      set({
        currentPhase: 'reading',
        words: [],
        userInputs: Array(WORDS_PER_GAME).fill(''),
        sentenceInputs: getInitialSentenceInputs(),
        startTime: null,
        endTime: null,
        isCompleted: false,
        validationResult: null,
        sentenceValidation: null,
      });
    },

    getTimeElapsed: () => {
      const { startTime } = get();
      if (!startTime) return 0;
      return Math.round((Date.now() - startTime) / 1000);
    },

    updateStats: (result: VerbalMemoryResult) => {
      const { stats } = get();

      const newStats: VerbalMemoryStats = {
        gamesPlayed: stats.gamesPlayed + 1,
        averageAccuracy:
          (stats.averageAccuracy * stats.gamesPlayed + result.percentage) /
          (stats.gamesPlayed + 1),
        bestScore:
          stats.bestScore === null || result.correctWords > stats.bestScore
            ? result.correctWords
            : stats.bestScore,
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
            console.error('Error loading verbal memory stats:', error);
          }
        }
      }
    },
  }))
);

if (typeof window !== 'undefined') {
  useVerbalMemoryStore.getState().loadStats();
}
