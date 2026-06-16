'use client';

/**
 * Tips Page
 *
 * Lists all healthy habit tips grouped by category.
 * Access is guarded by RequireAuth inside TipsPageContainer.
 *
 * @module TipsPage
 */

import { TipsPageContainer } from '@/components/tips';

export default function TipsPage() {
  return (
    <div className="space-y-8">
      <TipsPageContainer />
    </div>
  );
}
