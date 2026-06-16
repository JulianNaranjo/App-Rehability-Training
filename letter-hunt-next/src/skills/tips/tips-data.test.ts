import { describe, expect, it } from 'vitest';

import {
  getAllTips,
  hasSteps,
  tipsData,
} from './tips-data';

describe('tipsData — data integrity', () => {
  it('contains exactly 2 categories', () => {
    expect(tipsData).toHaveLength(2);
  });

  it('has a "sueno" category with at least 1 tip', () => {
    const cat = tipsData.find((c) => c.id === 'sueno');
    expect(cat).toBeDefined();
    expect(cat!.tips.length).toBeGreaterThanOrEqual(1);
  });

  it('has an "atencion" category with at least 13 tips', () => {
    const cat = tipsData.find((c) => c.id === 'atencion');
    expect(cat).toBeDefined();
    expect(cat!.tips.length).toBeGreaterThanOrEqual(13);
  });

  it('has at least one steps-shaped tip in atencion with 5 steps', () => {
    const cat = tipsData.find((c) => c.id === 'atencion')!;
    const stepsTip = cat.tips.find((t) => hasSteps(t));
    expect(stepsTip).toBeDefined();
    // hasSteps narrows to TipSteps — use the guard to access .steps safely
    if (stepsTip && hasSteps(stepsTip)) {
      expect(stepsTip.steps).toHaveLength(5);
    }
  });

  it('all tip ids are globally unique', () => {
    const allIds = tipsData.flatMap((c) => c.tips.map((t) => t.id));
    const unique = new Set(allIds);
    expect(unique.size).toBe(allIds.length);
  });

  it('every tip has exactly one of body OR steps (never both, never neither)', () => {
    const all = tipsData.flatMap((c) => c.tips);
    for (const tip of all) {
      if (hasSteps(tip)) {
        // Steps shape: steps must be an array, body must be absent/undefined
        expect(Array.isArray(tip.steps)).toBe(true);
        expect('body' in tip && tip.body).toBeFalsy();
      } else {
        // Body shape: body must be a string, steps must be absent/undefined
        expect(typeof tip.body).toBe('string');
        expect('steps' in tip && tip.steps).toBeFalsy();
      }
    }
  });

  it('steps tips have contiguous ordinals starting at 1', () => {
    const all = tipsData.flatMap((c) => c.tips);
    for (const tip of all) {
      if (hasSteps(tip)) {
        tip.steps.forEach((s, i) => {
          expect(s.step).toBe(i + 1);
        });
      }
    }
  });

  it('no empty title, body, or step text', () => {
    const all = tipsData.flatMap((c) => c.tips);
    for (const tip of all) {
      expect(tip.title.trim().length).toBeGreaterThan(0);
      if (!hasSteps(tip)) {
        expect(tip.body.trim().length).toBeGreaterThan(0);
      } else {
        for (const s of tip.steps) {
          expect(s.text.trim().length).toBeGreaterThan(0);
        }
      }
    }
  });
});

describe('getAllTips', () => {
  it('returns all tips from all categories in order', () => {
    const flat = getAllTips(tipsData);
    const total = tipsData.reduce((sum, c) => sum + c.tips.length, 0);
    expect(flat).toHaveLength(total);
  });

  it('preserves category order in flattened result', () => {
    const flat = getAllTips(tipsData);
    const manual = tipsData.flatMap((c) => c.tips);
    expect(flat).toEqual(manual);
  });
});
