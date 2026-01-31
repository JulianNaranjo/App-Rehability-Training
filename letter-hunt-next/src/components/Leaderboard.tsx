import { Card } from './ui/Card';
import { LeaderboardEntry } from '@/types/game';
import { cn, getRelativeTime, formatScore, formatTime } from '@/lib/utils';
import { useGameStore } from '@/store/game-store';
import { Trophy, Medal, Award } from 'lucide-react';

interface LeaderboardProps {
  className?: string;
  entries?: LeaderboardEntry[];
}

function getRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return <Trophy className="w-5 h-5 text-warning" />;
    case 2:
      return <Medal className="w-5 h-5 text-neutral-400" />;
    case 3:
      return <Award className="w-5 h-5 text-orange-600" />;
    default:
      return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-neutral-500">{rank}</span>;
  }
}

export function Leaderboard({ className, entries }: LeaderboardProps) {
  const { leaderboard } = useGameStore();
  const displayEntries = entries || leaderboard;
  
  if (displayEntries.length === 0) {
    return (
      <Card className={cn('text-center py-8', className)}>
        <p className="text-neutral-400 mb-2">¡No hay puntuaciones aún!</p>
        <p className="text-sm text-neutral-500">¡Sé el primero en completar un juego!</p>
      </Card>
    );
  }
  
  return (
    <Card className={cn('w-full max-w-2xl mx-auto', className)}>
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-neutral-100 mb-2">🏆 Tabla de Líderes</h2>
        <p className="text-neutral-400">Mejores puntuaciones de todos los tiempos</p>
      </div>
      
      <div className="space-y-2">
        {displayEntries.map((entry, index) => {
          const rank = index + 1;
          const isRecentPlayer = index === 0; // Could be enhanced with actual player identification
          
          return (
            <div
              key={entry.id}
              className={cn(
                'flex items-center justify-between p-4 rounded-xl transition-all duration-200',
                'bg-neutral-800/50 hover:bg-neutral-800',
                isRecentPlayer && 'ring-2 ring-primary-500 ring-opacity-50'
              )}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10">
                  {getRankIcon(rank)}
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-neutral-100">
                      {entry.playerName}
                    </p>
                    {isRecentPlayer && (
                      <span className="px-2 py-1 text-xs bg-primary-500 text-white rounded-full">
                        Tú
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-500">
                    Nivel {entry.level} • {getRelativeTime(entry.date)}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-bold text-lg text-primary-400">
                  {formatScore(entry.score)}
                </p>
                <p className="text-sm text-neutral-500">
                  {formatTime(entry.time)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      {displayEntries.length >= 10 && (
        <p className="mt-4 text-center text-sm text-neutral-500">
          Mostrando las 10 mejores puntuaciones
        </p>
      )}
    </Card>
  );
}