import { useGameStore } from '@/store/game-store';
import { cn } from '@/lib/utils';
import { SYMBOLS, EVEN_NUMBERS, ODD_NUMBERS } from '@/types/game';

interface GameInstructionProps {
  className?: string;
}

/**
 * Check if a character is a symbol (from SYMBOLS constant)
 */
function isSymbol(char: string): boolean {
  return SYMBOLS.includes(char);
}

/**
 * Check if targets are even numbers (level 7)
 */
function isEvenLevel(letters: string[]): boolean {
  return letters.length === 5 && letters.every(l => EVEN_NUMBERS.includes(l));
}

/**
 * Check if targets are odd numbers (level 8)
 */
function isOddLevel(letters: string[]): boolean {
  return letters.length === 5 && letters.every(l => ODD_NUMBERS.includes(l));
}

export function GameInstruction({ className }: GameInstructionProps) {
  const { targetLetters, gameState, currentLevel, gameMode } = useGameStore();

  // Check if these are numbers (level 5)
  const isNumbers = targetLetters && targetLetters.length > 0 && /^[0-9]$/.test(targetLetters[0]);
  // Check if these are symbols (level 6)
  const isSymbols = targetLetters && targetLetters.length > 0 && isSymbol(targetLetters[0]);
  // Check if level 7 (even numbers) or level 8 (odd numbers)
  const isEven = targetLetters && isEvenLevel(targetLetters);
  const isOdd = targetLetters && isOddLevel(targetLetters);
  // Level 9: Even rows = even numbers, Odd rows = odd numbers
  const isLevel9 = currentLevel === 9;
  // Level 10: Even rows = odd numbers, Odd rows = even numbers
  const isLevel10 = currentLevel === 10;
  // Check if we're in count mode
  const isCountMode = gameMode === 'count';

  const getGameStateText = () => {
    switch (gameState) {
      case 'playing':
        if (isLevel9 && isCountMode) return 'Cuenta cuántos números pares hay en las filas pares';
        if (isLevel10 && isCountMode) return 'Cuenta cuántos números impares hay en las filas impares';
        if (isLevel9) return 'En las filas pares señala los números pares y en las filas impares señale los números impares';
        if (isLevel10) return 'En las filas pares señale los números impares y en las filas impares señale los números pares';
        if (isEven) return 'Selecciona todos los números pares que ves';
        if (isOdd) return 'Selecciona todos los números impares que ves';
        if (isSymbols) return 'Selecciona todos los símbolos que ves';
        if (isNumbers) return 'Selecciona todos los números que ves';
        return 'Selecciona todas las letras que ves';
      case 'checking':
        return 'Verificando tu respuesta...';
      case 'won':
        if (isLevel9 && isCountMode) return '¡Excelente! ¡Contaste correctamente!';
        if (isLevel10 && isCountMode) return '¡Excelente! ¡Contaste correctamente!';
        if (isLevel9) return '¡Excelente! ¡Encontraste todos los números!';
        if (isLevel10) return '¡Excelente! ¡Encontraste todos los números!';
        if (isEven) return '¡Excelente! ¡Encontraste todos los números pares!';
        if (isOdd) return '¡Excelente! ¡Encontraste todos los números impares!';
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

  // For levels 7, 8, 9 and 10, don't show individual letters (no hints)
  const showLetters = !isEven && !isOdd && !isLevel9 && !isLevel10;

  let instructionText;
  if (isLevel9 && isCountMode) {
    instructionText = 'Cuenta cuántos números pares hay en las filas pares. Comienza en la fila 0';
  } else if (isLevel10 && isCountMode) {
    instructionText = 'Cuenta cuántos números impares hay en las filas impares. Comienza en la fila 1';
  } else if (isLevel9) {
    instructionText = 'En las filas pares señala los números pares y en las filas impares señale los números impares';
  } else if (isLevel10) {
    instructionText = 'En las filas pares señale los números impares y en las filas impares señale los números pares';
  } else if (isEven) {
    instructionText = 'Señala todos los números pares';
  } else if (isOdd) {
    instructionText = 'Señala todos los números impares';
  } else if (targetLetters.length === 1) {
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
        {showLetters && (
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
            {targetLetters.length > 1 && (
              <div className="flex items-center text-2xl font-bold">y</div>
            )}
          </div>
        )}
        {gameState === 'playing' && (
          <div className="text-center mt-4 text-blue-100">
            <span className="text-sm">
              {isLevel9 && isCountMode
                ? 'Filas 0,2,4...=cuenta los pares'
                : isLevel10 && isCountMode
                  ? 'Filas 1,3,5...=cuenta los impares'
                  : isLevel9
                    ? 'Filas 1,3,5...=números impares | Filas 2,4,6...=números pares'
                    : isLevel10
                      ? 'Filas 1,3,5...=números pares | Filas 2,4,6...=números impares'
                      : isEven
                        ? 'Pulsa los números pares para seleccionarlos'
                        : isOdd
                          ? 'Pulsa los números impares para seleccionarlos'
                          : isSymbols
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
