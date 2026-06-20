// src/skills/tips/tips-storage.ts — SSR-safe via the existing storage helper

import { storage } from '@/lib/utils';

export interface TipsSeenRecord {
  lastSeenDate: string | null;
  lastSeenTipId: string | null;
}

export const TIPS_SEEN_KEY = 'letter-hunt-tips-seen';

const NULL_RECORD: TipsSeenRecord = {
  lastSeenDate: null,
  lastSeenTipId: null,
};

/**
 * Read the tips-seen record from localStorage.
 *
 * Returns { lastSeenDate: null, lastSeenTipId: null } when:
 * - the key is absent
 * - the stored value is corrupt JSON (storage helper swallows parse errors)
 *
 * Never throws. Never accesses window directly (deferred via storage helper).
 */
export function readTipsSeen(): TipsSeenRecord {
  const stored = storage.get<TipsSeenRecord | null>(TIPS_SEEN_KEY, null);
  if (stored === null) return NULL_RECORD;
  return stored;
}

/**
 * Write a tips-seen record atomically.
 * Both fields are written together in a single JSON.stringify call.
 */
export function writeTipsSeen(record: TipsSeenRecord): void {
  storage.set(TIPS_SEEN_KEY, record);
}
