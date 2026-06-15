'use client';

/**
 * Dashboard Page
 * 
 * Main dashboard displaying all rehabilitation sections.
 * Uses Next.js Link for navigation to game modes.
 * 
 * @module DashboardPage
 */

import { DashboardContainer } from '@/components/dashboard';
import { RequireAuth } from '@/components/auth/RequireAuth';

export default function DashboardPage() {
  return (
    <RequireAuth>
      <div className="space-y-8">
        <DashboardContainer />
      </div>
    </RequireAuth>
  );
}
