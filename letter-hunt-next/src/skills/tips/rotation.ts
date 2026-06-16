// src/skills/tips/rotation.ts — pure, no React, no Date, no storage

import type { Tip } from './tips-data';

/**
 * Select the next tip from a rotation list based on the last seen tip id.
 *
 * Algorithm:
 * - Empty list → null
 * - Single tip → always return that tip (unavoidable repeat)
 * - Unknown/null lastSeenTipId → return tips[0]
 * - Known lastSeenTipId → return tips[(idx + 1) % length] (wraps, never repeats when length > 1)
 */
export function selectNextTip(
  tips: readonly Tip[],
  lastSeenTipId: string | null,
): Tip | null {
  if (tips.length === 0) return null;
  if (tips.length === 1) return tips[0];

  const idx = tips.findIndex((t) => t.id === lastSeenTipId);
  if (idx === -1) return tips[0];

  return tips[(idx + 1) % tips.length];
}
