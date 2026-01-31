'use client';

/**
 * Home Page - Main entry point for the rehabilitation program
 *
 * Displays the dashboard when game is idle, or the game interface
 * when actively playing.
 *
 * @module HomePage
 */

import { DashboardContainer, GameBoardContainer } from '@/components/dashboard';
import { useState, useCallback } from 'react';
import type { GameMode } from '@/types/game';

/**
 * Home page component
 *
 * Renders either:
 * - Dashboard when gameState is 'idle'
 * - Active game interface when playing
 */
export default function Home() {
  // Show dashboard by default when game is idle
  const [showDashboard, setShowDashboard] = useState(false);

  /**
   * Handle game mode selection from dashboard
   */
  const handleStartGame = useCallback((_mode: GameMode) => {
    // Game store handles the actual game initialization via DashboardContainer
    // Just hide the dashboard here to show game interface
    setShowDashboard(false);
  }, []);

  /**
   * Show dashboard (used when returning from game)
   */
  const handleShowDashboard = () => {
    setShowDashboard(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <main className="max-w-6xl mx-auto">
          {showDashboard ? (
            // Show Dashboard when idle
            <DashboardContainer
              onStartGame={handleStartGame}
            />
          ) : (
            // Show Game Interface when playing
            <GameBoardContainer
              onReturnToDashboard={handleShowDashboard}
            />
          )}
        </main>
      </div>
    </div>
  );
}
