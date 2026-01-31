'use client';

import { GameBoard } from '@/components/GameBoard';
import { GameControls } from '@/components/GameControls';
import { Leaderboard } from '@/components/Leaderboard';
import { GameInstruction } from '@/components/GameInstruction';
import { GameSettings } from '@/components/GameSettings';
import { useGameStore } from '@/store/game-store';
import { useState, useEffect } from 'react';

export default function Home() {
  const { currentLevel, gameState } = useGameStore();
  const [showSettings, setShowSettings] = useState(false);

  // Show settings on mount
  useEffect(() => {
    if (gameState === 'idle') {
      setShowSettings(true);
    }
  }, [gameState, setShowSettings]);

  const handleSettingsComplete = () => {
    setShowSettings(false);
  };

  const handleShowSettings = () => {
    setShowSettings(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">
            Letter Hunt
          </h1>
          
          {/* Game Instruction */}
          <GameInstruction />
        </header>

        <main className="max-w-6xl mx-auto">
          {showSettings ? (
            <div className="flex justify-center">
              <GameSettings onSettingsComplete={handleSettingsComplete} />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Game Area */}
              <div className="lg:col-span-2 space-y-6">
                {/* Game Status */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Nivel: <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{currentLevel}</span>
                    </div>
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Estado: <span className="text-lg font-semibold text-green-600 dark:text-green-400">{gameState === 'playing' ? 'Jugando' : gameState === 'checking' ? 'Verificando' : gameState === 'won' ? '¡Ganaste!' : gameState === 'lost' ? 'Intenta de nuevo' : gameState}</span>
                    </div>
                  </div>
                </div>

                {/* Game Board */}
                <GameBoard />

              {/* Game Controls */}
              <GameControls onSettings={handleShowSettings} />
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Leaderboard />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
