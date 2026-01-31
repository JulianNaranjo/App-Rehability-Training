import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { useGameStore } from '@/store/game-store';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import type { GameMode } from '@/types/game';

interface GameSettingsProps {
  className?: string;
  onSettingsComplete?: () => void;
}

export function GameSettings({ className, onSettingsComplete }: GameSettingsProps) {
  const { generateNewGame, currentLevel } = useGameStore();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleStartGame = async (gameMode: GameMode) => {
    setIsGenerating(true);
    try {
      // Siempre comienza en Nivel 1 con 1 letra, modo específico
      generateNewGame(1, undefined, gameMode);
      onSettingsComplete?.();
    } catch (error) {
      console.error('Error al generar juego:', error);
      alert('Error al generar el juego. Inténtalo de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className={cn('w-full max-w-md mx-auto', className)}>
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          🎮 ¡Bienvenido a Letter Hunt!
        </h2>
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-6 mb-6">
          <div className="text-lg font-semibold mb-2">
            🎯 Comienza en el Nivel 1
          </div>
          <div className="text-7xl font-black">
            1
          </div>
          <div className="text-sm mt-2 opacity-90">
            Elige tu modo de juego
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
          Selecciona cómo quieres jugar y avanza a través de niveles más desafiantes.
        </p>
      </div>

      <div className="space-y-4">
        {/* Mode Selection Buttons */}
        <div className="grid grid-cols-1 gap-3 mb-6">
          <Button
            onClick={() => handleStartGame('selection')}
            disabled={isGenerating}
            loading={isGenerating}
            variant="primary"
            className="w-full text-lg py-3 font-bold"
          >
            🎯 Modo Selección
          </Button>
          <Button
            onClick={() => handleStartGame('count')}
            disabled={isGenerating}
            loading={isGenerating}
            variant="secondary"
            className="w-full text-lg py-3 font-bold"
          >
            🔢 Modo Conteo
          </Button>
        </div>

        {/* Mode Descriptions */}
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
              🎯 Modo Selección
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400">
              Haz clic en las letras objetivo para seleccionarlas. Muestra tu progreso con "Seleccionadas: X/Y".
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div className="font-semibold text-green-700 dark:text-green-300 mb-2">
              🔢 Modo Conteo
            </div>
            <div className="text-sm text-green-600 dark:text-green-400">
              Cuenta las letras objetivo mentalmente e ingresa el número total. ¡Pon a prueba tu percepción visual!
            </div>
          </div>
        </div>
        
        {/* Level System Info */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          <div className="font-semibold mb-2">📋 Sistema de Niveles:</div>
          <div className="space-y-1">
            <div>• Nivel 1: 1 letra objetivo</div>
            <div>• Niveles 2-3: 2 letras objetivo</div>
            <div>• Nivel 4: 3 letras objetivo</div>
            <div>• Niveles 5+: 3-4 letras objetivo (máximo)</div>
          </div>
        </div>
      </div>
    </Card>
  );
}