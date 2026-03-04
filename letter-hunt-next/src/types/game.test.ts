import { describe, it, expect } from 'vitest';
import { isValidGameState, isValidTileIndex, isTargetLetter } from './game';

describe('isValidGameState', () => {
  const validState = {
    board: ['A', 'B', 'C'],
    targetLetters: ['A'],
    targetLetterCount: 1,
    targetLetterTypes: 1,
    solutionIndices: new Set([0]),
    selectedIndices: new Set<number>(),
    currentLevel: 1,
    score: 0,
    moveCount: 0,
    gameState: 'idle',
    startTime: null,
    endTime: null,
    gameMode: 'selection',
  };

  it('returns true for a valid GameState object', () => {
    expect(isValidGameState(validState)).toBe(true);
  });

  it('returns true for all valid gameState values', () => {
    const statuses = ['idle', 'playing', 'checking', 'won', 'lost', 'paused'];
    statuses.forEach(status => {
      expect(isValidGameState({ ...validState, gameState: status })).toBe(true);
    });
  });

  it('returns false for null or undefined', () => {
    expect(isValidGameState(null)).toBe(false);
    expect(isValidGameState(undefined)).toBe(false);
  });

  it('returns false when board is not an array', () => {
    expect(isValidGameState({ ...validState, board: 'notAnArray' })).toBe(false);
    expect(isValidGameState({ ...validState, board: null })).toBe(false);
  });

  it('returns false when targetLetters is not an array', () => {
    expect(isValidGameState({ ...validState, targetLetters: 'A' })).toBe(false);
    expect(isValidGameState({ ...validState, targetLetters: null })).toBe(false);
  });

  it('returns false when targetLetters contains non-strings', () => {
    expect(isValidGameState({ ...validState, targetLetters: [1, 2] })).toBe(false);
  });

  it('returns false when currentLevel is not a number', () => {
    expect(isValidGameState({ ...validState, currentLevel: '1' })).toBe(false);
  });

  it('returns false for invalid gameState value', () => {
    expect(isValidGameState({ ...validState, gameState: 'invalid' })).toBe(false);
    expect(isValidGameState({ ...validState, gameState: null })).toBe(false);
  });

  it('returns false when required fields are missing', () => {
    const { board, ...withoutBoard } = validState;
    expect(isValidGameState(withoutBoard)).toBe(false);

    const { targetLetters, ...withoutTargetLetters } = validState;
    expect(isValidGameState(withoutTargetLetters)).toBe(false);
  });

  it('returns true for empty targetLetters array', () => {
    expect(isValidGameState({ ...validState, targetLetters: [] })).toBe(true);
  });
});

describe('isValidTileIndex', () => {
  it('returns true for valid indices within board', () => {
    expect(isValidTileIndex(0, 15)).toBe(true);
    expect(isValidTileIndex(224, 15)).toBe(true);
    expect(isValidTileIndex(112, 15)).toBe(true);
  });

  it('returns false for negative index', () => {
    expect(isValidTileIndex(-1, 15)).toBe(false);
  });

  it('returns false for index equal to boardSize²', () => {
    expect(isValidTileIndex(225, 15)).toBe(false);
  });

  it('returns false for index greater than boardSize²', () => {
    expect(isValidTileIndex(300, 15)).toBe(false);
  });

  it('returns false for non-integer index', () => {
    expect(isValidTileIndex(1.5, 15)).toBe(false);
  });
});

describe('isTargetLetter', () => {
  it('returns true for matching letters (case insensitive)', () => {
    expect(isTargetLetter('A', 'A')).toBe(true);
    expect(isTargetLetter('a', 'A')).toBe(true);
    expect(isTargetLetter('A', 'a')).toBe(true);
    expect(isTargetLetter('a', 'a')).toBe(true);
  });

  it('returns false for non-matching letters', () => {
    expect(isTargetLetter('A', 'B')).toBe(false);
    expect(isTargetLetter('a', 'b')).toBe(false);
  });

  it('returns false for empty strings', () => {
    expect(isTargetLetter('', 'A')).toBe(false);
    expect(isTargetLetter('A', '')).toBe(false);
  });

  it('works with numbers and symbols as strings', () => {
    expect(isTargetLetter('5', '5')).toBe(true);
    expect(isTargetLetter('5', '3')).toBe(false);
    expect(isTargetLetter('+', '+')).toBe(true);
  });
});
