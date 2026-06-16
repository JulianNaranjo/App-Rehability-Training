'use client';

// src/hooks/useDailyTip.ts

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { allTipsInOrder } from '@/skills/tips/tips-data';
import type { Tip } from '@/skills/tips/tips-data';
import { todayIso } from '@/skills/tips/gating';
import { shouldShowTips } from '@/skills/tips/gating';
import { selectNextTip } from '@/skills/tips/rotation';
import { readTipsSeen, writeTipsSeen } from '@/skills/tips/tips-storage';
import { useAuthStore } from '@/store/auth-store';

export interface UseDailyTipResult {
  /** The tip to display, or null if no tip should be shown. */
  tip: Tip | null;
  /** Whether the modal is currently open. */
  isOpen: boolean;
  /** Dismiss the modal. Writes seen-state and closes without navigating. */
  dismiss: () => void;
  /** Navigate to /tips. Writes seen-state, closes, and routes. */
  seeAll: () => void;
}

/**
 * Controls the once-per-day tip modal.
 *
 * Effect runs only when useAuthStore status === 'authenticated'.
 * Storage is never accessed during render (SSR-safe).
 */
export function useDailyTip(): UseDailyTipResult {
  const status = useAuthStore((s) => s.status);
  const router = useRouter();

  const [tip, setTip] = useState<Tip | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (status !== 'authenticated') return;

    const record = readTipsSeen();
    const today = todayIso();

    if (!shouldShowTips(record.lastSeenDate, today)) return;

    const next = selectNextTip(allTipsInOrder, record.lastSeenTipId);
    if (next === null) return;

    setTip(next);
    setIsOpen(true);
  }, [status]);

  const persist = useCallback(() => {
    if (tip === null) return;
    writeTipsSeen({ lastSeenDate: todayIso(), lastSeenTipId: tip.id });
  }, [tip]);

  const dismiss = useCallback(() => {
    persist();
    setIsOpen(false);
  }, [persist]);

  const seeAll = useCallback(() => {
    persist();
    setIsOpen(false);
    router.push('/tips');
  }, [persist, router]);

  return { tip, isOpen, dismiss, seeAll };
}
