'use client';

// src/components/tips/DailyTipGate.tsx
// Thin client wrapper: calls useDailyTip, renders TipsModal when open.

import { useDailyTip } from '@/hooks/useDailyTip';

import { TipsModal } from './TipsModal';

/**
 * Mounts the once-per-day tip modal.
 *
 * Self-gating: renders nothing when the auth status is not 'authenticated',
 * when the user has already seen tips today, or when the tip list is empty.
 * Safe to mount unconditionally inside DashboardContainer.
 */
export function DailyTipGate() {
  const { tip, isOpen, dismiss, seeAll } = useDailyTip();

  if (!isOpen || tip === null) return null;

  return <TipsModal tip={tip} onDismiss={dismiss} onSeeAll={seeAll} />;
}
