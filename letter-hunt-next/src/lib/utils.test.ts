import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  formatTime,
  formatScore,
  clamp,
  generateId,
  getAnimationDuration,
  debounce,
  throttle,
} from './utils';

describe('formatTime', () => {
  it('formats 0 seconds as 00:00', () => {
    expect(formatTime(0)).toBe('00:00');
  });

  it('formats 59 seconds as 00:59', () => {
    expect(formatTime(59)).toBe('00:59');
  });

  it('formats 60 seconds as 01:00', () => {
    expect(formatTime(60)).toBe('01:00');
  });

  it('formats 90 seconds as 01:30', () => {
    expect(formatTime(90)).toBe('01:30');
  });

  it('formats 3600 seconds as 60:00', () => {
    expect(formatTime(3600)).toBe('60:00');
  });

  it('pads single-digit minutes and seconds with leading zero', () => {
    expect(formatTime(65)).toBe('01:05');
  });

  it('truncates fractional seconds', () => {
    expect(formatTime(61.9)).toBe('01:01');
  });
});

describe('formatScore', () => {
  it('formats 0', () => {
    expect(formatScore(0)).toBe('0');
  });

  it('formats numbers below 1000 without separator', () => {
    expect(formatScore(999)).toBe('999');
  });

  it('formats numbers ≥ 1000 with locale separator', () => {
    const result = formatScore(1000);
    expect(result).toMatch(/1.000|1,000/);
  });
});

describe('clamp', () => {
  it('returns value when within range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it('returns min when value is below min', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it('returns max when value is above max', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('returns min when value equals min', () => {
    expect(clamp(0, 0, 10)).toBe(0);
  });

  it('returns max when value equals max', () => {
    expect(clamp(10, 0, 10)).toBe(10);
  });
});

describe('generateId', () => {
  it('returns a non-empty string', () => {
    const id = generateId();
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
  });

  it('generates unique IDs on consecutive calls', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });
});

describe('getAnimationDuration', () => {
  it('returns baseDuration when animations enabled and no reduced motion', () => {
    expect(getAnimationDuration(300, true, false)).toBe(300);
  });

  it('returns 0 when animations are disabled', () => {
    expect(getAnimationDuration(300, false, false)).toBe(0);
  });

  it('returns 0 when reducedMotion is true', () => {
    expect(getAnimationDuration(300, true, true)).toBe(0);
  });

  it('returns 0 when both disabled and reducedMotion', () => {
    expect(getAnimationDuration(300, false, true)).toBe(0);
  });

  it('handles baseDuration of 0', () => {
    expect(getAnimationDuration(0, true, false)).toBe(0);
  });
});

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('does not call function before delay', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);
    debounced();
    expect(fn).not.toHaveBeenCalled();
  });

  it('calls function after delay', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);
    debounced();
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('resets timer on repeated calls', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);
    debounced();
    vi.advanceTimersByTime(50);
    debounced();
    vi.advanceTimersByTime(50);
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(50);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('passes arguments to the function', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);
    debounced('hello', 42);
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledWith('hello', 42);
  });
});

describe('throttle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('calls function immediately on first invocation', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);
    throttled();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('does not call function again before limit', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);
    throttled();
    throttled();
    throttled();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('calls function again after limit expires', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);
    throttled();
    vi.advanceTimersByTime(100);
    throttled();
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
