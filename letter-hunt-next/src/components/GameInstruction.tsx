import { useGameStore } from '@/store/game-store';
import { cn } from '@/lib/utils';
import { SYMBOLS } from '@/types/game';

interface GameInstructionProps {
  className?: string;
}

/**
 * Check if a character is a symbol (from SYMBOLS constant)
 */
function isSymbol(char: string): boolean {
  return SYMBOLS.includes(char);
}

export function GameInstruction({ className }: GameInstructionProps) {
  const { targetLetters, gameState } = useGameStore();

  // Check if these are numbers (level 5)
  const isNumbers = targetLetters && targetLetters.length > 0 && /^[0-9]$/.test(targetLetters[0]);
  // Check if these are symbols (level 6)
  const isSymbols = targetLetters && targetLetters.length > 0 && isSymbol(targetLetters[0]);

  const getGameStateText = () => {
    switch (gameState) {
      case 'playing':
        if (isSymbols) return 'Selecciona todos los símbolos que ves';
        if (isNumbers) return 'Selecciona todos los números que ves';
        return 'Selecciona todas las letras que ves';
      case 'checking':
        return 'Verificando tu respuesta...';
      case 'won':
        if (isSymbols) return '¡Excelente! ¡Los encontraste todos!';
        if (isNumbers) return '¡Excelente! ¡Los encontraste todos!';
        return '¡Excelente! ¡Las encontraste todas!';
      case 'lost':
        return 'Intenta de nuevo';
      default:
        return '';
    }
  };

  if (!targetLetters || targetLetters.length === 0) return null;

  const isSingleLetter = targetLetters.length === 1;
  let instructionText;
  if (isSingleLetter) {
    instructionText = 'Señala el';
  } else if (isSymbols) {
    instructionText = 'Señala todos los';
  } else if (isNumbers) {
    instructionText = 'Señala todos los';
  } else {
    instructionText = 'Señala todas las';
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Main Instruction - Consistent blue/purple gradient for all types */}
      <div className="text-white rounded-xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300 hover:shadow-xl bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="text-lg font-semibold mb-3">
          {instructionText}
        </div>
        <div className="flex justify-center gap-4">
          {targetLetters.map((letter, index) => (
            <div
              key={index}
              className={cn(
                "font-black bg-white rounded-xl p-6 md:p-8 inline-block shadow-md animate-pulse transform hover:scale-110 transition-transform text-blue-600",
                isSymbols && "text-7xl md:text-9xl"
              )}
            >
              {isSymbol(letter) ? letter : letter.toUpperCase()}
            </div>
          ))}
          {!isSingleLetter && (
            <div className="flex items-center text-2xl font-bold">y</div>
          )}
        </div>
        {gameState === 'playing' && (
          <div className="text-center mt-4 text-blue-100">
            <span className="text-sm">
              {isSymbols 
                ? 'Pulsa los símbolos para seleccionarlos' 
                : isNumbers 
                  ? 'Pulsa los números para seleccionarlos' 
                  : 'Pulsa las letras para seleccionarlas'}
            </span>
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
