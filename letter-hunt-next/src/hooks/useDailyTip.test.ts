// src/hooks/useDailyTip.test.ts
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useAuthStore } from '@/store/auth-store';
import { TIPS_SEEN_KEY } from '@/skills/tips/tips-storage';

import { useDailyTip } from './useDailyTip';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const resetStore = () => {
  useAuthStore.setState({ user: null, status: 'idle', error: undefined });
};

const setAuthenticated = () => {
  useAuthStore.setState({ status: 'authenticated' });
};

const TODAY = '2026-06-15';

// Freeze the date so todayIso() always returns TODAY
const fixedDate = new Date(2026, 5, 15); // June 15 2026 (local)

beforeEach(() => {
  resetStore();
  localStorage.clear();
  mockPush.mockClear();
  vi.useFakeTimers();
  vi.setSystemTime(fixedDate);
});

afterEach(() => {
  vi.useRealTimers();
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useDailyTip', () => {
  describe('when unauthenticated', () => {
    it('returns isOpen=false and tip=null without reading storage', () => {
      useAuthStore.setState({ status: 'unauthenticated' });

      const { result } = renderHook(() => useDailyTip());

      expect(result.current.isOpen).toBe(false);
      expect(result.current.tip).toBeNull();
    });

    it('never calls readTipsSeen when status is not authenticated', () => {
      useAuthStore.setState({ status: 'loading' });

      const { result } = renderHook(() => useDailyTip());

      expect(result.current.isOpen).toBe(false);
    });
  });

  describe('when authenticated and no prior seen record (first visit)', () => {
    it('opens the modal with the first tip', async () => {
      setAuthenticated();

      const { result } = renderHook(() => useDailyTip());

      // Effect runs after mount
      await act(async () => {});

      expect(result.current.isOpen).toBe(true);
      expect(result.current.tip).not.toBeNull();
      expect(result.current.tip?.id).toBe('sueno-01');
    });
  });

  describe('when authenticated and already seen today', () => {
    it('keeps modal closed', async () => {
      localStorage.setItem(
        TIPS_SEEN_KEY,
        JSON.stringify({ lastSeenDate: TODAY, lastSeenTipId: 'sueno-01' }),
      );

      setAuthenticated();

      const { result } = renderHook(() => useDailyTip());

      await act(async () => {});

      expect(result.current.isOpen).toBe(false);
      expect(result.current.tip).toBeNull();
    });
  });

  describe('when authenticated and last seen was a previous day', () => {
    it('opens the modal with the next tip in rotation', async () => {
      // Last seen was sueno-01, next should be atencion-autoinstruccion
      localStorage.setItem(
        TIPS_SEEN_KEY,
        JSON.stringify({ lastSeenDate: '2026-06-14', lastSeenTipId: 'sueno-01' }),
      );

      setAuthenticated();

      const { result } = renderHook(() => useDailyTip());

      await act(async () => {});

      expect(result.current.isOpen).toBe(true);
      expect(result.current.tip?.id).toBe('atencion-autoinstruccion');
    });
  });

  describe('dismiss()', () => {
    it('writes seen-state to storage, sets isOpen=false, and keeps tip', async () => {
      setAuthenticated();

      const { result } = renderHook(() => useDailyTip());

      await act(async () => {});

      expect(result.current.isOpen).toBe(true);
      const shownTipId = result.current.tip!.id;

      act(() => {
        result.current.dismiss();
      });

      expect(result.current.isOpen).toBe(false);

      const stored = JSON.parse(localStorage.getItem(TIPS_SEEN_KEY)!);
      expect(stored.lastSeenDate).toBe(TODAY);
      expect(stored.lastSeenTipId).toBe(shownTipId);
    });
  });

  describe('seeAll()', () => {
    it('writes seen-state to storage, closes modal, and navigates to /tips', async () => {
      setAuthenticated();

      const { result } = renderHook(() => useDailyTip());

      await act(async () => {});

      expect(result.current.isOpen).toBe(true);
      const shownTipId = result.current.tip!.id;

      act(() => {
        result.current.seeAll();
      });

      expect(result.current.isOpen).toBe(false);

      const stored = JSON.parse(localStorage.getItem(TIPS_SEEN_KEY)!);
      expect(stored.lastSeenDate).toBe(TODAY);
      expect(stored.lastSeenTipId).toBe(shownTipId);

      expect(mockPush).toHaveBeenCalledWith('/tips');
      expect(mockPush).toHaveBeenCalledTimes(1);
    });
  });
});
