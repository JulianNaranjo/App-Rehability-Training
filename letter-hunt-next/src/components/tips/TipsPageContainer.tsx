'use client';

// src/components/tips/TipsPageContainer.tsx
// Auth-gated container for the /tips page.

import { RequireAuth } from '@/components/auth/RequireAuth';
import { tipsData } from '@/skills/tips/tips-data';

import { TipsList } from './TipsList';

/**
 * Container for the /tips page.
 *
 * Wraps content in RequireAuth (consistent with the dashboard pattern).
 * Reads static tipsData and passes it to the presentational TipsList.
 */
export function TipsPageContainer() {
  return (
    <RequireAuth>
      <div className="space-y-2">
        <header className="pb-2">
          <h1 className="text-2xl font-semibold text-text-primary">
            Consejos para tu bienestar
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Estrategias y técnicas para mejorar tu atención y descanso.
          </p>
        </header>
        <TipsList categories={tipsData} />
      </div>
    </RequireAuth>
  );
}
