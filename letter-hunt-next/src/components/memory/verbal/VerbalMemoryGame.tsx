'use client';

import { useEffect, useState } from 'react';
import { useVerbalMemoryStore } from '@/store/verbal-memory-store';
import { WordListDisplay } from './WordListDisplay';
import { WordRecallInput } from './WordRecallInput';
import { SentenceInputComponent } from './SentenceInput';
import { LevelSelector } from './LevelSelector';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import {
  Timer,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RotateCcw,
  Trophy,
  Target,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { LEVEL3_EXAMPLE } from '@/types/verbal-memory';

interface VerbalMemoryGameProps {
  className?: string;
}

export function VerbalMemoryGame({ className }: VerbalMemoryGameProps) {
  const {
    currentLevel,
    currentPhase,
    words,
    userInputs,
    sentenceInputs,
    isCompleted,
    validationResult,
    sentenceValidation,
    startGame,
    selectLevel,
    continueToRecall,
    continueToSentences,
    continueToLevel4,
    updateInput,
    updateSentenceInput,
    validateAnswers,
    validateSentences,
    resetGame,
    getTimeElapsed,
  } = useVerbalMemoryStore();

  const [elapsedTime, setElapsedTime] = useState(0);
  const startTime = useVerbalMemoryStore((state) => state.startTime);

  useEffect(() => {
    if (startTime === null) {
      startGame();
    }
  }, [startTime, startGame]);

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
    startGame(currentLevel);
    setElapsedTime(0);
  };

  const handleLevelSelect = (level: 1 | 2 | 3 | 4) => {
    selectLevel(level);
    setElapsedTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getLevelTitle = () => {
    switch (currentLevel) {
      case 1:
        return 'Recordar palabras';
      case 2:
        return 'Ordenar alfabéticamente';
      case 3:
        return 'Crear frases';
      case 4:
        return 'Recordar con frases';
      default:
        return '';
    }
  };

  const getLevelInstructions = () => {
    switch (currentLevel) {
      case 1:
        return 'Lea con atención la siguiente lista de palabras. Tómese el tiempo necesario para memorizarlas. Cuando esté listo, presione el botón "Continuar" para pasar a la siguiente fase.';
      case 2:
        return 'Lea con atención la siguiente lista de palabras. Memorícelas y ordénelas alfabéticamente. Cuando esté listo, presione el botón "Continuar" para pasar a la siguiente fase.';
      case 3:
        return 'Lea con atención la siguiente lista de palabras. Memorícelas y cree frases utilizando dos palabras de la lista. Cuando esté listo, presione el botón "Continuar" para pasar a la siguiente fase.';
      case 4:
        return 'Lea con atención la siguiente lista de palabras. Memorícelas y cree frases en su mente utilizándolas. Cuando esté listo, presione el botón "Continuar" para pasar a la siguiente fase.';
      default:
        return '';
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      <LevelSelector
        currentLevel={currentLevel}
        onSelectLevel={handleLevelSelect}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <BookOpen className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-text-primary">
              Memoria Verbal - Nivel {currentLevel}
            </h1>
            <p className="text-sm text-text-secondary">{getLevelTitle()}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-surface-elevated px-4 py-2 rounded-lg border border-border-soft">
          <Timer className="w-5 h-5 text-primary-500" />
          <span className="text-lg font-mono font-semibold text-text-primary">
            {formatTime(Math.floor(elapsedTime))}
          </span>
        </div>
      </div>

      {currentPhase === 'reading' && (
        <>
          <Card className="bg-primary-50 border-primary-200">
            <div className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-medium text-primary-800 mb-1">
                    Instrucciones
                  </h3>
                  <p className="text-sm text-primary-700">
                    {currentLevel === 4 
                      ? 'Escriba todas las palabras que recuerde (intente beneficiarse del ordenamiento alfabético y de las frases que acaba de escribir). Sin ayuda visual, solo memoria.'
                      : getLevelInstructions()
                    }
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {currentLevel !== 4 && <WordListDisplay words={words} />}

          <div className="flex justify-center">
            <Button
              onClick={currentLevel === 3 ? continueToSentences : continueToRecall}
              size="lg"
              className="min-w-[200px]"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Continuar
            </Button>
          </div>
        </>
      )}

      {currentPhase === 'recall' && (
        <>
          <WordRecallInput
            inputCount={words.length}
            userInputs={userInputs}
            onInputChange={updateInput}
            level={currentLevel}
          />

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
        </>
      )}

      {currentPhase === 'sentences' && (
        <>
          <Card className="bg-primary-50 border-primary-200">
            <div className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-medium text-primary-800 mb-1">
                    Ejemplo
                  </h3>
                  <p className="text-sm text-primary-700">
                    Los <strong>{LEVEL3_EXAMPLE.words[0]}</strong> juegan con el <strong>{LEVEL3_EXAMPLE.words[1]}</strong></p>
                  <p className="text-sm text-primary-600 mt-2">
                    Nota: Las palabras en negrita deben aparecer en su oración
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <WordListDisplay words={words} />

          <SentenceInputComponent
            words={words}
            sentenceInputs={sentenceInputs}
            onSentenceChange={updateSentenceInput}
          />

          <div className="flex justify-center">
            <Button
              onClick={() => validateSentences()}
              size="lg"
              className="min-w-[200px]"
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Validar Oraciones
            </Button>
          </div>
        </>
      )}

      {currentPhase === 'results' && validationResult && currentLevel !== 3 && (
        <Card
          className={cn(
            'p-6',
            validationResult.percentage >= 80
              ? 'bg-success-50 border-success-200'
              : validationResult.percentage >= 50
                ? 'bg-warning-50 border-warning-200'
                : 'bg-error-50 border-error-200'
          )}
        >
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
            <p className="text-text-secondary">Precisión total</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 text-center border border-border-soft">
              <div className="flex items-center justify-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-success-500" />
                <span className="text-sm text-text-secondary">Correctas</span>
              </div>
              <p className="text-2xl font-bold text-success-600">
                {validationResult.correctWords}
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 text-center border border-border-soft">
              <div className="flex items-center justify-center gap-2 mb-1">
                <XCircle className="w-4 h-4 text-error-500" />
                <span className="text-sm text-text-secondary">Incorrectas</span>
              </div>
              <p className="text-2xl font-bold text-error-600">
                {validationResult.incorrectWords}
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 text-center border border-border-soft">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Timer className="w-4 h-4 text-primary-500" />
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
                {validationResult.totalWords}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-text-secondary mb-3">
              Detalle de respuestas:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {validationResult.details.map((detail, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-center gap-2 p-2 rounded-lg border',
                    detail.isCorrect
                      ? 'bg-success-50 border-success-200'
                      : 'bg-error-50 border-error-200'
                  )}
                >
                  <span className="text-sm font-medium text-text-secondary w-6">
                    {index + 1}.
                  </span>
                  {detail.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-success-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-error-500 flex-shrink-0" />
                  )}
                  <span
                    className={cn(
                      'text-sm',
                      detail.isCorrect ? 'text-success-700' : 'text-error-700'
                    )}
                  >
                    {detail.userWord || '(vacío)'}
                  </span>
                  {!detail.isCorrect && (
                    <span className="text-sm text-text-tertiary ml-auto">
                      Correcto: {detail.correctWord}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={handleNewGame}
              size="lg"
              variant="secondary"
              className="min-w-[200px]"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Jugar de Nuevo
            </Button>
          </div>
        </Card>
      )}

      {currentPhase === 'results' && sentenceValidation && currentLevel === 3 && (
        <Card
          className={cn(
            'p-6',
            sentenceValidation.percentage >= 80
              ? 'bg-success-50 border-success-200'
              : sentenceValidation.percentage >= 50
                ? 'bg-warning-50 border-warning-200'
                : 'bg-error-50 border-error-200'
          )}
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-white shadow-sm mb-4">
              {sentenceValidation.percentage >= 80 ? (
                <Trophy className="w-12 h-12 text-success-500" />
              ) : sentenceValidation.percentage >= 50 ? (
                <Target className="w-12 h-12 text-warning-500" />
              ) : (
                <AlertCircle className="w-12 h-12 text-error-500" />
              )}
            </div>

            <h2 className="text-2xl font-bold text-text-primary mb-2">
              {sentenceValidation.percentage >= 80
                ? '¡Excelente trabajo!'
                : sentenceValidation.percentage >= 50
                  ? '¡Buen intento!'
                  : '¡Sigue practicando!'}
            </h2>

            <div className="text-4xl font-bold text-text-primary mb-2">
              {sentenceValidation.percentage}%
            </div>
            <p className="text-text-secondary">Frases creadas correctamente</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 text-center border border-border-soft">
              <div className="flex items-center justify-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-success-500" />
                <span className="text-sm text-text-secondary">Válidas</span>
              </div>
              <p className="text-2xl font-bold text-success-600">
                {sentenceValidation.correctSentences}
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 text-center border border-border-soft">
              <div className="flex items-center justify-center gap-2 mb-1">
                <XCircle className="w-4 h-4 text-error-500" />
                <span className="text-sm text-text-secondary">Inválidas</span>
              </div>
              <p className="text-2xl font-bold text-error-600">
                {sentenceValidation.incorrectSentences}
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 text-center border border-border-soft">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Timer className="w-4 h-4 text-primary-500" />
                <span className="text-sm text-text-secondary">Tiempo</span>
              </div>
              <p className="text-2xl font-bold text-primary-600">
                {formatTime(Math.floor(sentenceValidation.timeElapsed))}
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 text-center border border-border-soft">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Target className="w-4 h-4 text-text-secondary" />
                <span className="text-sm text-text-secondary">Total</span>
              </div>
              <p className="text-2xl font-bold text-text-primary">
                {sentenceValidation.totalSentences}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-text-secondary mb-3">
              Detalle de oraciones:
            </h3>
            <div className="space-y-2">
              {sentenceValidation.details.map((detail, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex flex-col gap-1 p-3 rounded-lg border',
                    detail.isValid
                      ? 'bg-success-50 border-success-200'
                      : 'bg-error-50 border-error-200'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-text-secondary">
                      {index + 1}.
                    </span>
                    {detail.isValid ? (
                      <CheckCircle2 className="w-4 h-4 text-success-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-error-500 flex-shrink-0" />
                    )}
                    <span className="text-sm text-text-primary">
                      {detail.sentence || '(vacío)'}
                    </span>
                  </div>
                  {!detail.isValid && (
                    <div className="text-xs text-error-600 ml-6">
                      {detail.missingWords.length > 0 && `Faltan: ${detail.missingWords.join(', ')}`}
                      {detail.repeatedWords.length > 0 && ` | Repetidas: ${detail.repeatedWords.join(', ')}`}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Card className="bg-primary-50 border-primary-200">
            <div className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-primary-700">
                    Lea cada todas las frases e intente imaginar y visualizar cada una de ellas.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex justify-center gap-4 mt-6">
            <Button
              onClick={handleNewGame}
              size="lg"
              variant="secondary"
              className="min-w-[200px]"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Jugar de Nuevo
            </Button>
            <Button
              onClick={() => continueToLevel4()}
              size="lg"
              className="min-w-[200px]"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Continuar al Nivel 4
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
