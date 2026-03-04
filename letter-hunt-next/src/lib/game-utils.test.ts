import { describe, it, expect } from 'vitest';
import {
  fisherYatesShuffle,
  getRandomInt,
  isValidNumber,
  validateCountInput,
  validateGameInput,
  indexToPosition,
  positionToIndex,
  isAdjacent,
  getAdjacentPositions,
  checkSelection,
  calculateScore,
  calculateCountScore,
  getTileStatus,
} from './game-utils';

describe('fisherYatesShuffle', () => {
  it('returns an array of the same length', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(fisherYatesShuffle(arr)).toHaveLength(arr.length);
  });

  it('contains the same elements as the original', () => {
    const arr = ['a', 'b', 'c', 'd'];
    const shuffled = fisherYatesShuffle(arr);
    expect(shuffled.sort()).toEqual([...arr].sort());
  });

  it('does not mutate the original array', () => {
    const arr = [1, 2, 3];
    const original = [...arr];
    fisherYatesShuffle(arr);
    expect(arr).toEqual(original);
  });

  it('handles empty array', () => {
    expect(fisherYatesShuffle([])).toEqual([]);
  });

  it('handles single-element array', () => {
    expect(fisherYatesShuffle([42])).toEqual([42]);
  });
});

describe('getRandomInt', () => {
  it('returns a value within [min, max]', () => {
    for (let i = 0; i < 100; i++) {
      const val = getRandomInt(3, 7);
      expect(val).toBeGreaterThanOrEqual(3);
      expect(val).toBeLessThanOrEqual(7);
    }
  });

  it('returns min when min === max', () => {
    expect(getRandomInt(5, 5)).toBe(5);
  });

  it('returns integer values only', () => {
    for (let i = 0; i < 50; i++) {
      expect(Number.isInteger(getRandomInt(0, 100))).toBe(true);
    }
  });
});

describe('isValidNumber', () => {
  it('returns true for finite numbers', () => {
    expect(isValidNumber(0)).toBe(true);
    expect(isValidNumber(42)).toBe(true);
    expect(isValidNumber(-1)).toBe(true);
    expect(isValidNumber(3.14)).toBe(true);
  });

  it('returns false for NaN', () => {
    expect(isValidNumber(NaN)).toBe(false);
  });

  it('returns false for Infinity', () => {
    expect(isValidNumber(Infinity)).toBe(false);
    expect(isValidNumber(-Infinity)).toBe(false);
  });

  it('returns false for non-number types', () => {
    expect(isValidNumber('5')).toBe(false);
    expect(isValidNumber(null)).toBe(false);
    expect(isValidNumber(undefined)).toBe(false);
    expect(isValidNumber({})).toBe(false);
  });
});

describe('validateCountInput', () => {
  it('returns valid for count within bounds', () => {
    expect(validateCountInput(5, 10)).toEqual({ valid: true });
  });

  it('returns invalid for negative count', () => {
    const result = validateCountInput(-1, 10);
    expect(result.valid).toBe(false);
    expect(result.message).toBeDefined();
  });

  it('returns invalid for count exceeding maxLetters * 2', () => {
    const result = validateCountInput(21, 10);
    expect(result.valid).toBe(false);
    expect(result.message).toContain('20');
  });

  it('returns valid for count equal to maxLetters * 2', () => {
    expect(validateCountInput(20, 10)).toEqual({ valid: true });
  });

  it('returns valid for count equal to 0', () => {
    expect(validateCountInput(0, 10)).toEqual({ valid: true });
  });
});

describe('validateGameInput', () => {
  it('returns value when valid', () => {
    const result = validateGameInput(5, (v: number) => v > 0, 1);
    expect(result).toBe(5);
  });

  it('returns defaultValue when validator returns false', () => {
    const result = validateGameInput(-1, (v: number) => v > 0, 1);
    expect(result).toBe(1);
  });

  it('returns defaultValue when value is undefined', () => {
    const result = validateGameInput(undefined, (v: number) => v > 0, 99);
    expect(result).toBe(99);
  });
});

describe('indexToPosition', () => {
  it('converts index 0 to row 0, col 0', () => {
    expect(indexToPosition(0, 15)).toEqual({ row: 0, col: 0 });
  });

  it('converts index 14 to row 0, col 14 on 15-wide board', () => {
    expect(indexToPosition(14, 15)).toEqual({ row: 0, col: 14 });
  });

  it('converts index 15 to row 1, col 0 on 15-wide board', () => {
    expect(indexToPosition(15, 15)).toEqual({ row: 1, col: 0 });
  });

  it('converts index 224 to row 14, col 14 on 15x15 board', () => {
    expect(indexToPosition(224, 15)).toEqual({ row: 14, col: 14 });
  });
});

describe('positionToIndex', () => {
  it('converts row 0, col 0 to index 0', () => {
    expect(positionToIndex({ row: 0, col: 0 }, 15)).toBe(0);
  });

  it('converts row 1, col 0 to index 15 on 15-wide board', () => {
    expect(positionToIndex({ row: 1, col: 0 }, 15)).toBe(15);
  });

  it('is inverse of indexToPosition', () => {
    for (let i = 0; i < 225; i++) {
      const pos = indexToPosition(i, 15);
      expect(positionToIndex(pos, 15)).toBe(i);
    }
  });
});

describe('isAdjacent', () => {
  it('returns true for horizontally adjacent positions', () => {
    expect(isAdjacent({ row: 0, col: 0 }, { row: 0, col: 1 })).toBe(true);
  });

  it('returns true for vertically adjacent positions', () => {
    expect(isAdjacent({ row: 0, col: 0 }, { row: 1, col: 0 })).toBe(true);
  });

  it('returns true for diagonally adjacent positions', () => {
    expect(isAdjacent({ row: 0, col: 0 }, { row: 1, col: 1 })).toBe(true);
  });

  it('returns false for same position', () => {
    expect(isAdjacent({ row: 2, col: 2 }, { row: 2, col: 2 })).toBe(false);
  });

  it('returns false for non-adjacent positions', () => {
    expect(isAdjacent({ row: 0, col: 0 }, { row: 0, col: 2 })).toBe(false);
    expect(isAdjacent({ row: 0, col: 0 }, { row: 3, col: 0 })).toBe(false);
  });
});

describe('getAdjacentPositions', () => {
  it('returns 3 positions for corner cell', () => {
    const adj = getAdjacentPositions({ row: 0, col: 0 }, 15);
    expect(adj).toHaveLength(3);
  });

  it('returns 5 positions for edge cell (not corner)', () => {
    const adj = getAdjacentPositions({ row: 0, col: 7 }, 15);
    expect(adj).toHaveLength(5);
  });

  it('returns 8 positions for center cell', () => {
    const adj = getAdjacentPositions({ row: 7, col: 7 }, 15);
    expect(adj).toHaveLength(8);
  });

  it('all returned positions are within board bounds', () => {
    const adj = getAdjacentPositions({ row: 7, col: 7 }, 15);
    adj.forEach(pos => {
      expect(pos.row).toBeGreaterThanOrEqual(0);
      expect(pos.row).toBeLessThan(15);
      expect(pos.col).toBeGreaterThanOrEqual(0);
      expect(pos.col).toBeLessThan(15);
    });
  });
});

describe('checkSelection', () => {
  it('returns correct=true when selection matches solution exactly', () => {
    const selected = new Set([0, 1, 2]);
    const solution = new Set([0, 1, 2]);
    const result = checkSelection(selected, solution, 15);
    expect(result.correct).toBe(true);
    expect(result.correctCount).toBe(3);
    expect(result.wrongCount).toBe(0);
    expect(result.missedCount).toBe(0);
  });

  it('returns correct=false when selection is partially wrong', () => {
    const selected = new Set([0, 1, 5]);
    const solution = new Set([0, 1, 2]);
    const result = checkSelection(selected, solution, 15);
    expect(result.correct).toBe(false);
    expect(result.correctCount).toBe(2);
    expect(result.wrongCount).toBe(1);
    expect(result.missedCount).toBe(1);
  });

  it('returns correct=false when selection is empty', () => {
    const selected = new Set<number>();
    const solution = new Set([0, 1, 2]);
    const result = checkSelection(selected, solution, 15);
    expect(result.correct).toBe(false);
    expect(result.correctCount).toBe(0);
    expect(result.missedCount).toBe(3);
  });

  it('computes accuracy as ratio of correct to total', () => {
    const selected = new Set([0, 1]);
    const solution = new Set([0, 1, 2, 3]);
    const result = checkSelection(selected, solution, 15);
    expect(result.accuracy).toBe(0.5);
  });

  it('returns accuracy 0 when solution is empty', () => {
    const result = checkSelection(new Set(), new Set(), 15);
    expect(result.accuracy).toBe(0);
  });
});

describe('calculateScore', () => {
  it('returns a positive score for perfect accuracy', () => {
    const score = calculateScore(1, 10, 1, 10, 56);
    expect(score).toBeGreaterThan(0);
  });

  it('returns 0 for 0 accuracy', () => {
    const score = calculateScore(0, 10, 1, 10, 56);
    expect(score).toBeGreaterThanOrEqual(0);
  });

  it('higher level yields higher score (same other inputs)', () => {
    const score1 = calculateScore(1, 10, 1, 10, 56);
    const score6 = calculateScore(1, 10, 6, 10, 56);
    expect(score6).toBeGreaterThan(score1);
  });

  it('faster time yields higher score', () => {
    const fast = calculateScore(1, 10, 1, 10, 56);
    const slow = calculateScore(1, 200, 1, 10, 56);
    expect(fast).toBeGreaterThan(slow);
  });
});

describe('calculateCountScore', () => {
  it('returns 0 for incorrect answer', () => {
    expect(calculateCountScore(false, 10, 1, 56)).toBe(0);
  });

  it('returns positive score for correct answer', () => {
    expect(calculateCountScore(true, 10, 1, 56)).toBeGreaterThan(0);
  });

  it('higher level yields higher score', () => {
    const score1 = calculateCountScore(true, 10, 1, 56);
    const score6 = calculateCountScore(true, 10, 6, 56);
    expect(score6).toBeGreaterThan(score1);
  });
});

describe('getTileStatus', () => {
  const solution = new Set([0, 1, 2]);
  const selected = new Set([0, 5]);

  it('returns empty for empty letter', () => {
    expect(getTileStatus(0, '', ['A'], selected, solution, 'playing')).toBe('empty');
  });

  it('returns selected when tile is selected during playing', () => {
    expect(getTileStatus(0, 'A', ['A'], selected, solution, 'playing')).toBe('selected');
  });

  it('returns empty for non-selected tile during playing', () => {
    expect(getTileStatus(1, 'A', ['A'], selected, solution, 'playing')).toBe('empty');
  });

  it('returns correct for target+selected during checking', () => {
    expect(getTileStatus(0, 'A', ['A'], selected, solution, 'checking')).toBe('correct');
  });

  it('returns wrong for selected+non-target during checking', () => {
    expect(getTileStatus(5, 'B', ['A'], selected, solution, 'checking')).toBe('wrong');
  });

  it('returns empty for unselected target during checking', () => {
    expect(getTileStatus(1, 'A', ['A'], selected, solution, 'checking')).toBe('empty');
  });

  it('returns correct/wrong for won state same as checking', () => {
    expect(getTileStatus(0, 'A', ['A'], selected, solution, 'won')).toBe('correct');
    expect(getTileStatus(5, 'B', ['A'], selected, solution, 'won')).toBe('wrong');
  });
});
