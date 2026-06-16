import { afterEach, describe, expect, it } from 'vitest';

import { TIPS_SEEN_KEY, readTipsSeen, writeTipsSeen } from './tips-storage';

const NULL_RECORD = { lastSeenDate: null, lastSeenTipId: null };

afterEach(() => {
  localStorage.clear();
});

describe('readTipsSeen', () => {
  it('returns null record when key is absent', () => {
    expect(readTipsSeen()).toEqual(NULL_RECORD);
  });

  it('returns parsed value when a valid record is stored', () => {
    const record = { lastSeenDate: '2026-06-15', lastSeenTipId: 'sueno-01' };
    localStorage.setItem(TIPS_SEEN_KEY, JSON.stringify(record));
    expect(readTipsSeen()).toEqual(record);
  });

  it('returns null record when stored JSON is corrupt (no throw)', () => {
    localStorage.setItem(TIPS_SEEN_KEY, 'not-valid-json');
    expect(() => readTipsSeen()).not.toThrow();
    expect(readTipsSeen()).toEqual(NULL_RECORD);
  });
});

describe('writeTipsSeen', () => {
  it('persists both fields and round-trips correctly', () => {
    const record = { lastSeenDate: '2026-06-15', lastSeenTipId: 'atencion-02' };
    writeTipsSeen(record);
    expect(readTipsSeen()).toEqual(record);
  });

  it('can overwrite an existing record atomically', () => {
    writeTipsSeen({ lastSeenDate: '2026-06-14', lastSeenTipId: 'sueno-01' });
    writeTipsSeen({ lastSeenDate: '2026-06-15', lastSeenTipId: 'atencion-autoinstruccion' });
    expect(readTipsSeen()).toEqual({
      lastSeenDate: '2026-06-15',
      lastSeenTipId: 'atencion-autoinstruccion',
    });
  });
});
