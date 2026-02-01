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

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <DashboardContainer />
    </div>
  );
}
