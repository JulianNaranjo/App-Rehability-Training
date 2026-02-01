'use client';

/**
 * Game Page - Dynamic route for game modes
 * 
 * Handles /game/selection and /game/count routes.
 * Initializes the game with the correct mode on mount.
 * 
 * @module GamePage
 */

import { useEffect } from 'react';
import { useParams, redirect } from 'next/navigation';
import { GameBoardContainer } from '@/components/dashboard';
import { useGameStore } from '@/store/game-store';
import { isAttentionGameMode } from '@/skills/dashboard/dashboard-logic';
import type { GameMode } from '@/types/game';

export default function GamePage() {
  const params = useParams();
  const mode = params.mode as string;
  const { generateNewGame, resetGame } = useGameStore();

  // Validate mode parameter
  if (!isAttentionGameMode(mode)) {
    redirect('/dashboard');
  }

  // Initialize game when component mounts
  useEffect(() => {
    // Reset any existing game state and start fresh
    resetGame();
    // Generate new game with the selected mode
    generateNewGame(1, undefined, mode as GameMode);
    
    // Cleanup: reset game when leaving the page
    return () => {
      resetGame();
    };
  }, [mode, generateNewGame, resetGame]);

  return (
    <div className="space-y-6">
      <GameBoardContainer />
    </div>
  );
}
