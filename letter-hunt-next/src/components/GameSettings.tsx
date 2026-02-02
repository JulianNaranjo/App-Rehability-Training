import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { useGameStore } from '@/store/game-store';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface GameSettingsProps {
  className?: string;
  onSettingsComplete?: () => void;
}

/**
 * Game Settings Component - Simplified version
 * 
 * Displays level system information and allows returning to dashboard.
 * Game mode selection is now handled by DashboardContainer.
 * 
 * @module GameSettings
 */
export function GameSettings({ className, onSettingsComplete }: GameSettingsProps) {
  const { resetGame } = useGameStore();
  const [isReturning, setIsReturning] = useState(false);
  
  const handleReturnToDashboard = () => {
    setIsReturning(true);
    resetGame(); // Reset to idle state to show dashboard
    onSettingsComplete?.();
    setIsReturning(false);
  };

  return (
    <Card className={cn('w-full max-w-md mx-auto', className)}>
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          Configuración
        </h2>
        
        <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
          Información del sistema de niveles
        </p>
      </div>

      <div className="space-y-4">
        {/* Level System Info */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <div className="font-semibold mb-2 text-gray-700 dark:text-gray-300">Sistema de Niveles:</div>
          <div className="space-y-1">
            <div>• Nivel 1: 1 letra objetivo</div>
            <div>• Nivel 2: 2 letras objetivo</div>
            <div>• Nivel 3: 3 letras objetivo</div>
            <div>• Nivel 4: 4 letras objetivo</div>
            <div>• Nivel 5: 4 números objetivo (0-9)</div>
          </div>
        </div>
        
        {/* Return to Dashboard Button */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            onClick={handleReturnToDashboard}
            disabled={isReturning}
            loading={isReturning}
            variant="primary"
            className="w-full"
          >
            Volver al Dashboard
          </Button>
        </div>
      </div>
    </Card>
  );
}
