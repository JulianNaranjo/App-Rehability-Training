'use client';

/**
 * Profile Page
 * 
 * User profile page displaying basic information and statistics.
 * Accessible via /profile route.
 * 
 * @module ProfilePage
 */

import { useGameStore } from '@/store/game-store';
import { Card } from '@/components/ui/Card';
import { User, Trophy, Clock, Target, Gamepad2 } from 'lucide-react';
import { cn, formatTime } from '@/lib/utils';

export default function ProfilePage() {
  const { stats } = useGameStore();

  // Calculate derived stats
  const winRate = stats.gamesPlayed > 0 
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) 
    : 0;

  const averageMovesPerGame = stats.gamesPlayed > 0
    ? Math.round(stats.totalMoves / stats.gamesPlayed)
    : 0;

  const statCards = [
    {
      icon: <Gamepad2 className="w-6 h-6" />,
      label: 'Partidas jugadas',
      value: stats.gamesPlayed,
      color: 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400',
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      label: 'Partidas ganadas',
      value: stats.gamesWon,
      color: 'bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-400',
    },
    {
      icon: <Target className="w-6 h-6" />,
      label: 'Tasa de victoria',
      value: `${winRate}%`,
      color: 'bg-warning-100 dark:bg-warning-900/30 text-warning-600 dark:text-warning-400',
    },
    {
      icon: <Clock className="w-6 h-6" />,
      label: 'Mejor tiempo',
      value: stats.bestTime ? formatTime(stats.bestTime) : 'N/A',
      color: 'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <header className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <User className="w-10 h-10 text-primary-500" />
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
            Perfil de Usuario
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
          Tu progreso y estadísticas de juego.
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {statCards.map((stat, index) => (
          <Card key={index} className="p-6 text-center">
            <div className={cn(
              'w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center',
              stat.color
            )}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
              {stat.value}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {stat.label}
            </p>
          </Card>
        ))}
      </div>

      {/* Additional Stats */}
      <Card className="p-6 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
          Estadísticas detalladas
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-300">Tiempo promedio</span>
            <span className="font-semibold text-gray-800 dark:text-white">
              {stats.averageTime > 0 ? formatTime(stats.averageTime) : 'N/A'}
            </span>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-300">Movimientos totales</span>
            <span className="font-semibold text-gray-800 dark:text-white">
              {stats.totalMoves}
            </span>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-300">Promedio de movimientos</span>
            <span className="font-semibold text-gray-800 dark:text-white">
              {averageMovesPerGame}
            </span>
          </div>
          
          <div className="flex items-center justify-between py-3">
            <span className="text-gray-600 dark:text-gray-300">Precisión</span>
            <span className="font-semibold text-gray-800 dark:text-white">
              {Math.round(stats.accuracy)}%
            </span>
          </div>
        </div>
      </Card>

      {/* Empty State */}
      {stats.gamesPlayed === 0 && (
        <Card className="p-8 text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Gamepad2 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            ¡Aún no has jugado!
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Comienza a jugar para ver tus estadísticas aquí.
          </p>
        </Card>
      )}
    </div>
  );
}
