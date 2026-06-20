// src/components/dashboard/DashboardContainer.test.tsx
import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { mockUser } from '@/lib/api/__mocks__/handlers';
import { useAuthStore } from '@/store/auth-store';

import { DashboardContainer } from './DashboardContainer';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/dashboard',
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const resetStore = () => {
  useAuthStore.setState({ user: null, status: 'idle', error: undefined });
};

const fixedDate = new Date(2026, 5, 16);

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('DashboardContainer', () => {
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

  it('renders the daily tip modal after mount when authenticated and tips not seen today', async () => {
    useAuthStore.setState({ user: mockUser, status: 'authenticated', error: undefined });

    render(<DashboardContainer />);

    await act(async () => {});

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('does not render the daily tip modal when unauthenticated', async () => {
    useAuthStore.setState({ user: null, status: 'unauthenticated', error: undefined });

    render(<DashboardContainer />);

    await act(async () => {});

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
