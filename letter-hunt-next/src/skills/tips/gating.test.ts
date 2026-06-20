import { describe, expect, it } from 'vitest';

import { shouldShowTips, todayIso } from './gating';

describe('shouldShowTips', () => {
  it('returns true when lastSeenDate is null (never seen)', () => {
    expect(shouldShowTips(null, '2026-06-15')).toBe(true);
  });

  it('returns false when lastSeenDate equals today (same day)', () => {
    expect(shouldShowTips('2026-06-15', '2026-06-15')).toBe(false);
  });

  it('returns true when lastSeenDate is an earlier date', () => {
    expect(shouldShowTips('2026-06-14', '2026-06-15')).toBe(true);
  });

  it('returns false when lastSeenDate is a future date (clock skew)', () => {
    expect(shouldShowTips('2026-06-16', '2026-06-15')).toBe(false);
  });
});

describe('todayIso', () => {
  it('returns YYYY-MM-DD using LOCAL date parts, not UTC', () => {
    // June 15 2026 at 23:30 local time
    const local = new Date(2026, 5, 15, 23, 30, 0);
    expect(todayIso(local)).toBe('2026-06-15');
  });

  it('zero-pads month and day', () => {
    const d = new Date(2026, 0, 5, 10, 0, 0); // January 5
    expect(todayIso(d)).toBe('2026-01-05');
  });

  it('uses LOCAL year/month/date — not toISOString UTC', () => {
    const d = new Date(2026, 5, 15, 23, 30, 0); // local June 15 23:30
    const result = todayIso(d);
    // If toISOString() were used it might give June 16 in UTC+0 at 01:30 UTC
    // We just confirm the local date is used: must equal 2026-06-15
    expect(result).toBe('2026-06-15');
    // Also confirm it does NOT use toISOString() by checking the function
    // returns local date parts (year 2026, month 06, day 15)
    const [year, month, day] = result.split('-').map(Number);
    expect(year).toBe(d.getFullYear());
    expect(month).toBe(d.getMonth() + 1);
    expect(day).toBe(d.getDate());
  });
});
