import { useGameStore } from '@/store/game-store';
import { cn } from '@/lib/utils';

interface GameInstructionProps {
  className?: string;
}

export function GameInstruction({ className }: GameInstructionProps) {
  const { targetLetters, gameState } = useGameStore();

  const getGameStateText = () => {
    switch (gameState) {
      case 'playing':
        return 'Selecciona todas las letras que ves';
      case 'checking':
        return 'Verificando tu respuesta...';
      case 'won':
        return '¡Excelente! ¡Las encontraste todas!';
      case 'lost':
        return 'Intenta de nuevo';
      default:
        return '';
    }
  };

  if (!targetLetters || targetLetters.length === 0) return null;

  const isSingleLetter = targetLetters.length === 1;
  const instructionText = isSingleLetter ? 'Señale todas las' : 'Señale todas las';

  return (
    <div className={cn('space-y-4', className)}>
      {/* Main Instruction */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
        <div className="text-lg font-semibold mb-3">
          {instructionText}
        </div>
        <div className="flex justify-center gap-4">
          {targetLetters.map((letter, index) => (
            <div
              key={index}
              className="text-6xl md:text-8xl font-black bg-white text-blue-600 rounded-xl p-6 md:p-8 inline-block shadow-md animate-pulse transform hover:scale-110 transition-transform"
            >
              {letter.toUpperCase()}
            </div>
          ))}
          {!isSingleLetter && (
            <div className="flex items-center text-2xl font-bold">y</div>
          )}
        </div>
        {gameState === 'playing' && (
          <div className="text-center mt-4 text-blue-100">
            <span className="text-sm">Pulsa las letras para seleccionarlas</span>
          </div>
        )}
      </div>

      {/* Secondary Instruction */}
      {gameState !== 'idle' && (
        <div className="text-center text-gray-700 dark:text-gray-300 text-lg font-medium bg-white/80 dark:bg-gray-800/80 rounded-lg p-3">
          {getGameStateText()}
        </div>
      )}
    </div>
  );
}