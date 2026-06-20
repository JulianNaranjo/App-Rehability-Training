// src/skills/tips/gating.ts — pure functions, no React, no storage

/**
 * Decide whether the tips modal should show today.
 *
 * Returns true only when the user has never seen tips (null) OR
 * the last seen date is strictly before today.
 * A future lastSeenDate (clock skew) also suppresses the modal.
 *
 * Algorithm: lastSeenDate === null || lastSeenDate < today
 * Uses YYYY-MM-DD lexicographic comparison (safe for ISO date strings).
 * The caller is responsible for providing today in the correct local timezone.
 */
export function shouldShowTips(
  lastSeenDate: string | null,
  today: string,
): boolean {
  if (lastSeenDate === null) return true;
  return lastSeenDate < today;
}

/**
 * Return today's date as a YYYY-MM-DD string using LOCAL date parts.
 *
 * PITFALL: Do NOT use toISOString() — that returns UTC, which can be a
 * different calendar day near midnight for non-UTC users.
 *
 * @param now - injectable for unit tests; defaults to new Date()
 */
export function todayIso(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
