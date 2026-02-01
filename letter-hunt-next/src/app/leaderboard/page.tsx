'use client';

/**
 * Leaderboard Page
 * 
 * Displays the global leaderboard with all top scores.
 * Accessible via /leaderboard route.
 * 
 * @module LeaderboardPage
 */

import { Leaderboard } from '@/components/Leaderboard';
import { Trophy } from 'lucide-react';

export default function LeaderboardPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <header className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Trophy className="w-10 h-10 text-warning-500" />
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
            Tabla de Clasificación
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
          ¡Compite por el primer lugar! Aquí se muestran las mejores puntuaciones de todos los jugadores.
        </p>
      </header>

      {/* Leaderboard Component */}
      <Leaderboard />
    </div>
  );
}
