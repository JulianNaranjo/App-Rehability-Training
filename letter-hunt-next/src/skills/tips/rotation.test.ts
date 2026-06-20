import { describe, expect, it } from 'vitest';

import type { Tip } from './tips-data';
import { selectNextTip } from './rotation';

const makeTip = (id: string): Tip => ({ id, title: id, body: `body of ${id}` });

const A = makeTip('tip-a');
const B = makeTip('tip-b');
const C = makeTip('tip-c');

describe('selectNextTip', () => {
  it('returns null when the tips array is empty', () => {
    expect(selectNextTip([], null)).toBeNull();
  });

  it('returns the first tip when lastSeenTipId is null and there is one tip', () => {
    expect(selectNextTip([A], null)).toBe(A);
  });

  it('returns the first tip when lastSeenTipId is null and there are multiple tips', () => {
    expect(selectNextTip([A, B, C], null)).toBe(A);
  });

  it('returns the next tip in sequence', () => {
    expect(selectNextTip([A, B, C], 'tip-a')).toBe(B);
  });

  it('wraps around from the last tip to the first', () => {
    expect(selectNextTip([A, B, C], 'tip-c')).toBe(A);
  });

  it('returns the first tip when lastSeenTipId is unknown', () => {
    expect(selectNextTip([A, B, C], 'unknown-id')).toBe(A);
  });

  it('returns the only tip even when it equals lastSeenTipId (single-tip degenerate)', () => {
    expect(selectNextTip([A], 'tip-a')).toBe(A);
  });

  it('visits all tips exactly once in a full cycle', () => {
    const tips = [A, B, C];
    let lastId: string | null = null;
    const seen: Tip[] = [];
    for (let i = 0; i < tips.length; i++) {
      const next = selectNextTip(tips, lastId);
      expect(next).not.toBeNull();
      seen.push(next!);
      lastId = next!.id;
    }
    expect(seen).toHaveLength(3);
    expect(seen).toContain(A);
    expect(seen).toContain(B);
    expect(seen).toContain(C);
  });
});
