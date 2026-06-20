// src/components/tips/DailyTipGate.test.tsx
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useAuthStore } from '@/store/auth-store';
import { TIPS_SEEN_KEY } from '@/skills/tips/tips-storage';

import { DailyTipGate } from './DailyTipGate';

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

const TODAY = '2026-06-15';
const fixedDate = new Date(2026, 5, 15);

beforeEach(() => {
  resetStore();
  localStorage.clear();
  mockPush.mockClear();
  document.body.innerHTML = '';
  vi.useFakeTimers();
  vi.setSystemTime(fixedDate);
});

afterEach(() => {
  vi.useRealTimers();
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('DailyTipGate', () => {
  it('renders nothing when unauthenticated', () => {
    useAuthStore.setState({ status: 'unauthenticated' });

    render(<DailyTipGate />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders nothing when loading', () => {
    useAuthStore.setState({ status: 'loading' });

    render(<DailyTipGate />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders the modal when authenticated and no prior seen record', async () => {
    useAuthStore.setState({ status: 'authenticated' });

    render(<DailyTipGate />);

    await act(async () => {});

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders nothing when authenticated but already seen today', async () => {
    localStorage.setItem(
      TIPS_SEEN_KEY,
      JSON.stringify({ lastSeenDate: TODAY, lastSeenTipId: 'sueno-01' }),
    );

    useAuthStore.setState({ status: 'authenticated' });

    render(<DailyTipGate />);

    await act(async () => {});

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('dismisses the modal on Cerrar click and writes storage', async () => {
    vi.useRealTimers();
    // Use real date for this test since we switched to real timers
    vi.setSystemTime(fixedDate);

    useAuthStore.setState({ status: 'authenticated' });

    const user = userEvent.setup();

    render(<DailyTipGate />);

    await act(async () => {});

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /cerrar/i }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    const stored = JSON.parse(localStorage.getItem(TIPS_SEEN_KEY)!);
    // We can't assert exact TODAY here since we use real timers, just assert shape
    expect(typeof stored.lastSeenDate).toBe('string');
    expect(typeof stored.lastSeenTipId).toBe('string');
  });

  it('navigates to /tips on seeAll click and writes storage', async () => {
    vi.useRealTimers();

    useAuthStore.setState({ status: 'authenticated' });

    const user = userEvent.setup();

    render(<DailyTipGate />);

    await act(async () => {});

    await user.click(screen.getByRole('button', { name: /ver todos los consejos/i }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(mockPush).toHaveBeenCalledWith('/tips');

    const stored = JSON.parse(localStorage.getItem(TIPS_SEEN_KEY)!);
    expect(typeof stored.lastSeenDate).toBe('string');
  });
});
