import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { useGameStore } from '@/store/game-store';
import { cn, formatTime } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface GameControlsProps {
  className?: string;
  onNewGame?: () => void;
  onSettings?: () => void;
}

export function GameControls({ className, onNewGame, onSettings }: GameControlsProps) {
  const {
    gameState,
    selectedIndices,
    solutionIndices,
    elapsedTime,
    score,
    currentLevel,
    gameMode,
    userCount,
    targetLetterCount,
    targetLetters,
    checkAnswer,
    generateNewGame,
    resetGame,
    setUserCount,
    addToLeaderboard,
    validationResults,
  } = useGameStore();
  
  const [showNameInput, setShowNameInput] = useState(false);
  const [playerName, setPlayerName] = useState('');

  // Debug console logs
  useEffect(() => {
    console.log('=== DEBUG CONSOLE ===');
    console.log('userCount:', userCount);
    console.log('targetLetterCount:', targetLetterCount);
    console.log('targetLetters:', targetLetters);
    console.log('gameState:', gameState);
    console.log('gameMode:', gameMode);
    console.log('=== FIN DEBUG ===');
  }, [userCount, targetLetterCount, targetLetters, gameState, gameMode]);
  const [isChecking, setIsChecking] = useState(false);
  
  const isPlaying = gameState === 'playing';
  const isCheckingState = gameState === 'checking';
  const isWon = gameState === 'won';
  const isLost = gameState === 'lost';
  const canCheck = gameMode === 'selection' ? selectedIndices.size > 0 : userCount !== undefined && userCount >= 0;
  
  const targetCount = solutionIndices.size;
  const selectedCount = selectedIndices.size;
  const remainingCount = targetCount - selectedCount;
  
  // Check if these are numbers (level 5)
  const isNumbers = targetLetters && targetLetters.length > 0 && /^[0-9]$/.test(targetLetters[0]);
  
  // Calculate maximum allowed input based on board size and max percentage
  const boardSize = 15; // From DEFAULT_GAME_CONFIG.BOARD_SIZE
  const maxPossibleLetters = Math.round(boardSize * boardSize * 0.30); // 30% of board
  const maxInputValue = maxPossibleLetters + 10; // Add buffer for safety
  
  // Handle check answer with loading state
  const handleCheckAnswer = () => {
    if (!canCheck || isChecking) return;
    if (gameMode === 'count' && (userCount === undefined || userCount < 0)) return;
    
    setIsChecking(true);
    checkAnswer();
    setTimeout(() => setIsChecking(false), 1500);
  };
  
  // Handle new game
  const handleNewGame = () => {
    if (onNewGame) {
      onNewGame();
    } else {
      generateNewGame();
    }
  };
  
  // Handle score submission
  const handleSubmitScore = () => {
    if (playerName.trim()) {
      addToLeaderboard(playerName.trim());
      setShowNameInput(false);
      setPlayerName('');
      handleNewGame();
    }
  };
  
  // Auto-show name input when game is won
  useEffect(() => {
    if (isWon && score > 0) {
      setShowNameInput(true);
    }
  }, [isWon, score, setShowNameInput]);
  
  return (
    <Card className={cn('w-full max-w-2xl mx-auto', className)}>
      {/* Status display */}
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center gap-8 mb-4">
          <div className="text-center">
            <p className="text-sm text-neutral-500 mb-1">Tiempo</p>
            <p className="text-2xl font-mono font-bold text-primary-400">
              {formatTime(elapsedTime)}
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-neutral-500 mb-1">Puntuación</p>
            <p className="text-2xl font-mono font-bold text-success">
              {score.toLocaleString()}
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-neutral-500 mb-1">Nivel</p>
            <p className="text-2xl font-mono font-bold text-warning">
              {currentLevel}
            </p>
          </div>
        </div>
        
        {/* Game mode specific status */}
        {isPlaying && (
          <div className="mb-4">
            {gameMode === 'selection' ? (
              <>
                <p className="text-lg text-neutral-300 mb-2">
                  Seleccionadas: <span className="font-bold text-primary-400">{selectedCount}</span> / 
                  <span className="font-bold"> {targetCount}</span>
                </p>
                
                {remainingCount > 0 && (
                  <p className="text-sm text-neutral-500">
                    {remainingCount} restantes
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="text-lg text-neutral-300 mb-2">
                  {isNumbers ? 'Busca los números' : 'Busca las letras'} <span className="font-bold text-primary-400">
                    {targetLetters.join(', ')}
                  </span>
                </p>

              </>
            )}
          </div>
        )}
        
        {/* Game state messages */}
        {isCheckingState && (
          <div className="animate-pulse">
            <p className="text-lg text-warning">Verificando tu respuesta...</p>
          </div>
        )}
        
        {isWon && (
          <div className="mb-4">
            <p className="text-2xl font-bold text-success mb-2">🎉 ¡Felicidades!</p>
            <p className="text-neutral-300">
              {(gameMode === 'selection' || (gameMode === 'count' && userCount === targetCount))
                ? gameMode === 'selection'
                  ? (isNumbers 
                      ? `¡Encontraste todos los ${targetCount} números en ${formatTime(elapsedTime)}!`
                      : `¡Encontraste todas las ${targetCount} letras en ${formatTime(elapsedTime)}!`)
                  : (isNumbers
                      ? `¡Contaste correctamente ${userCount === 1 ? userCount + ' número' : userCount + ' números'} en ${formatTime(elapsedTime)}!`
                      : `¡Contaste correctamente ${userCount === 1 ? userCount + ' letra' : userCount + ' letras'} en ${formatTime(elapsedTime)}!`)
                : null
              }
            </p>
            <p className="text-lg text-primary-400 mt-2">
              Puntuación: {score.toLocaleString()}
            </p>
          </div>
        )}
        
        {isLost && (
          <div className="mb-4">
            <p className="text-2xl font-bold text-error mb-2">No es correcto</p>
            <p className="text-neutral-300">
              {gameMode === 'selection' 
                ? (validationResults 
                  ? (isNumbers
                      ? `¡Sigue intentando! Tuviste ${validationResults.correctCount} números correctos de ${validationResults.totalCount} posibles`
                      : `¡Sigue intentando! Tuviste ${validationResults.correctCount} letras correctas de ${validationResults.totalCount} posibles`)
                  : `¡Sigue intentando! Revisa tu selección.`
                )
                : `¡Vuelve a intentarlo! Había ${targetCount} ${targetLetters.join(', ')} en el tablero.`
              }
            </p>
          </div>
        )}
      </div>
      
      {/* Control buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {isPlaying && (
          <>
            {gameMode === 'selection' ? (
              <Button
                onClick={handleCheckAnswer}
                disabled={!canCheck || isChecking}
                loading={isChecking}
                className="flex-1"
                variant="primary"
              >
                {isChecking ? 'Verificando...' : 'Verificar Respuesta'}
              </Button>
            ) : (
              <div className="flex gap-2 w-full">
                <Input
                  type="number"
                  placeholder={isNumbers ? "¿Cuántos números hay?" : "¿Cuántas letras hay?"}
                  value={userCount || ''}
                  onChange={(e) => setUserCount(parseInt(e.target.value) || 0)}
                  min={0}
                  max={maxInputValue}
                  disabled={isChecking}
                  className="flex-1"
                />
                <Button
                  onClick={handleCheckAnswer}
                  disabled={userCount === undefined || isChecking}
                  loading={isChecking}
                  variant="primary"
                  className="flex-initial"
                >
                  Verificar
                </Button>
              </div>
            )}
          </>
        )}
        
        {(isWon || isLost) && (
          <>
            <Button
              onClick={handleNewGame}
              variant="primary"
              className="flex-1"
            >
              Nuevo Juego
            </Button>
            
            {isWon && !showNameInput && (
              <Button
                onClick={() => setShowNameInput(true)}
                variant="secondary"
                className="flex-1"
              >
                Guardar Puntuación
              </Button>
            )}
          </>
        )}
        
        <div className="flex gap-3">
          {gameState !== 'idle' && (
            <Button
              onClick={resetGame}
              variant="ghost"
              className="flex-1 sm:flex-initial"
            >
              Reiniciar
            </Button>
          )}
          
          {onSettings && (
            <Button
              onClick={onSettings}
              variant="secondary"
              className="flex-1 sm:flex-initial"
            >
              Configuración
            </Button>
          )}
        </div>
      </div>
      
      {/* Name input for leaderboard */}
      {showNameInput && (
        <div className="mt-4 pt-4 border-t border-neutral-800">
          <Input
            label="Ingresa tu nombre para la tabla de líderes"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Tu nombre"
            maxLength={30}
            className="mb-3"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSubmitScore();
              }
            }}
          />
          
          <div className="flex gap-2">
            <Button
              onClick={handleSubmitScore}
              disabled={!playerName.trim()}
              variant="success"
              className="flex-1"
            >
              Guardar Puntuación
            </Button>
            <Button
              onClick={() => {
                setShowNameInput(false);
                setPlayerName('');
                handleNewGame();
              }}
              variant="ghost"
            >
              Omitir
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}