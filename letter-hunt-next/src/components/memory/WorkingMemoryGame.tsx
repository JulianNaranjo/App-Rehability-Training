'use client';

/**
 * Working Memory Game Component
 * 
 * Main component for the working memory game (Level 1).
 * Includes timer, reference table, grid, and validation.
 * 
 * @module WorkingMemoryGame
 */

import { useEffect, useState } from 'react';
import { useWorkingMemoryStore } from '@/store/working-memory-store';
import { ReferenceTable } from './ReferenceTable';
import { ReferenceInputTable } from './ReferenceInputTable';
import { NumberLetterGrid } from './NumberLetterGrid';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import {
  Timer,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RotateCcw,
  Brain,
  Trophy,
  Clock,
  Target,
  ArrowRight
} from 'lucide-react';

interface WorkingMemoryGameProps {
  className?: string;
}

export function WorkingMemoryGame({ className }: WorkingMemoryGameProps) {
  const {
    currentLevel,
    mapping,
    grid,
    userReferenceInputs,
    referenceTableValidated,
    referenceValidationResult,
    isCompleted,
    isValidated,
    validationResult,
    generateNewGame,
    updateCell,
    validateAnswers,
    resetGame,
    getTimeElapsed,
    updateReferenceCell,
    validateReferenceTable,
    continueToLevel2,
  } = useWorkingMemoryStore();
  
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const [isReferenceVisible, setIsReferenceVisible] = useState(true);
  
  // Initialize game on mount
  useEffect(() => {
    if (grid.length === 0) {
      generateNewGame();
    }
  }, [grid.length, generateNewGame]);
  
  // Timer
  useEffect(() => {
    if (isCompleted) return;
    
    const interval = setInterval(() => {
      setElapsedTime(getTimeElapsed());
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isCompleted, getTimeElapsed]);
  
  const handleValidate = () => {
    validateAnswers();
  };
  
  const handleNewGame = () => {
    resetGame();
    generateNewGame(1);
    setElapsedTime(0);
    setShowInstructions(true);
    setIsReferenceVisible(true);
  };

  const handleContinueToLevel2 = () => {
    continueToLevel2();
    setElapsedTime(0);
    setShowInstructions(true);
    setIsReferenceVisible(true);
  };

  const toggleReference = () => {
    setIsReferenceVisible(!isReferenceVisible);
  };

  const handleValidateReference = () => {
    validateReferenceTable();
  };

  const handleContinueToGrid = () => {
    // The grid is already generated in continueToLevel2
    // Just need to update UI state
    setElapsedTime(0);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Check if we should show Level 2 reference input
  const showReferenceInput = currentLevel === 2 && !referenceTableValidated;

  // Check if Level 1 was completed with >= 80%
  const canContinueToLevel2 =
    currentLevel === 1 &&
    isValidated &&
    validationResult &&
    validationResult.percentage >= 80;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Brain className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-text-primary">
              Memoria de Trabajo - Nivel {currentLevel}
            </h1>
            <p className="text-sm text-text-secondary">
              {currentLevel === 1
                ? 'Coloque debajo de cada número la letra que corresponde'
                : 'Recuerda las letras de la tabla de referencia'}
            </p>
          </div>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-2 bg-surface-elevated px-4 py-2 rounded-lg border border-border-soft">
          <Timer className="w-5 h-5 text-primary-500" />
          <span className="text-lg font-mono font-semibold text-text-primary">
            {formatTime(Math.floor(elapsedTime))}
          </span>
        </div>
      </div>
      
      {/* Instructions */}
      {showInstructions && !isValidated && (
        <Card className="bg-primary-50 border-primary-200">
          <div className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-medium text-primary-800 mb-1">
                  Instrucciones
                </h3>
                <p className="text-sm text-primary-700">
                  1. Memoriza la tabla de referencia que muestra qué letra corresponde a cada número.
                  <br />
                  2. <strong>Oculta la tabla</strong> usando el botón &quot;Ocultar&quot; cuando estés listo.
                  <br />
                  3. Completa las casillas vacías con la letra correspondiente al número que está debajo.
                  <br />
                  4. Puedes mostrar la tabla nuevamente si necesitas recordar, o validar cuando quieras.
                </p>
              </div>
              <button
                onClick={() => setShowInstructions(false)}
                className="text-primary-600 hover:text-primary-800"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </Card>
      )}
      
      {/* Level 2: Reference Input Table */}
      {showReferenceInput && (
        <ReferenceInputTable
          numbers={['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']}
          userInputs={userReferenceInputs}
          isValidated={referenceTableValidated}
          validationResult={referenceValidationResult}
          onInputChange={updateReferenceCell}
          onValidate={handleValidateReference}
          onContinue={handleContinueToGrid}
        />
      )}

      {/* Level 1 or Level 2 (after reference validated): Reference Table */}
      {!showReferenceInput && currentLevel === 1 && (
        <ReferenceTable
          mapping={mapping}
          isVisible={isReferenceVisible}
          onToggle={toggleReference}
        />
      )}

      {/* Game Grid (only show if not in reference input phase) */}
      {!showReferenceInput && grid.length > 0 && (
        <Card className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-text-primary">
              Tablero
            </h2>
            <p className="text-sm text-text-secondary">
              Completa todas las casillas
            </p>
          </div>

          <NumberLetterGrid
            grid={grid}
            onCellChange={updateCell}
            isValidated={isValidated}
          />
        </Card>
      )}
      
      {/* Validation Button or Results */}
      {!isValidated ? (
        <div className="flex justify-center">
          <Button
            onClick={handleValidate}
            size="lg"
            className="min-w-[200px]"
          >
            <CheckCircle2 className="w-5 h-5 mr-2" />
            Validar Respuestas
          </Button>
        </div>
      ) : (
        validationResult && (
          <Card className={cn(
            'p-6',
            validationResult.percentage >= 80 
              ? 'bg-success-50 border-success-200' 
              : validationResult.percentage >= 50 
                ? 'bg-warning-50 border-warning-200' 
                : 'bg-error-50 border-error-200'
          )}>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center p-4 rounded-full bg-white shadow-sm mb-4">
                {validationResult.percentage >= 80 ? (
                  <Trophy className="w-12 h-12 text-success-500" />
                ) : validationResult.percentage >= 50 ? (
                  <Target className="w-12 h-12 text-warning-500" />
                ) : (
                  <AlertCircle className="w-12 h-12 text-error-500" />
                )}
              </div>
              
              <h2 className="text-2xl font-bold text-text-primary mb-2">
                {validationResult.percentage >= 80 
                  ? '¡Excelente trabajo!' 
                  : validationResult.percentage >= 50 
                    ? '¡Buen intento!' 
                    : '¡Sigue practicando!'}
              </h2>
              
              <div className="text-4xl font-bold text-text-primary mb-2">
                {validationResult.percentage}%
              </div>
              <p className="text-text-secondary">
                Precisión total
              </p>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 text-center border border-border-soft">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-success-500" />
                  <span className="text-sm text-text-secondary">Correctas</span>
                </div>
                <p className="text-2xl font-bold text-success-600">
                  {validationResult.correctCells}
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 text-center border border-border-soft">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <XCircle className="w-4 h-4 text-error-500" />
                  <span className="text-sm text-text-secondary">Incorrectas</span>
                </div>
                <p className="text-2xl font-bold text-error-600">
                  {validationResult.incorrectCells}
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 text-center border border-border-soft">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-primary-500" />
                  <span className="text-sm text-text-secondary">Tiempo</span>
                </div>
                <p className="text-2xl font-bold text-primary-600">
                  {formatTime(Math.floor(validationResult.timeElapsed))}
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 text-center border border-border-soft">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-text-secondary" />
                  <span className="text-sm text-text-secondary">Total</span>
                </div>
                <p className="text-2xl font-bold text-text-primary">
                  {validationResult.totalCells}
                </p>
              </div>
            </div>
            
            {validationResult.penaltyApplied && (
              <div className="bg-warning-100 border border-warning-300 rounded-lg p-3 mb-6 text-center">
                <p className="text-sm text-warning-800">
                  <AlertCircle className="w-4 h-4 inline mr-1" />
                  Se aplicó una penalización de {validationResult.penaltyApplied}%
                  por celdas vacías ({validationResult.emptyCells} celdas)
                </p>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <Button
                onClick={handleNewGame}
                size="lg"
                variant="secondary"
                className="min-w-[200px]"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Jugar de Nuevo
              </Button>

              {canContinueToLevel2 && (
                <Button
                  onClick={handleContinueToLevel2}
                  size="lg"
                  className="min-w-[200px]"
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Continuar al Nivel 2
                </Button>
              )}
            </div>
          </Card>
        )
      )}
    </div>
  );
}
