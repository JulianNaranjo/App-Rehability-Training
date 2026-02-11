import { GameTile } from './GameTile';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/game-store';
import { getTileStatus } from '@/lib/game-utils';

interface GameBoardProps {
  className?: string;
  showHints?: boolean;
  tileSize?: 'sm' | 'md' | 'lg';
  onTileSelect?: (index: number) => void;
}

export function GameBoard({ 
  className, 
  showHints = false, 
  tileSize = 'md',
  onTileSelect 
}: GameBoardProps) {
  const {
    board,
    targetLetters,
    selectedIndices,
    solutionIndices,
    gameState,
    gameMode,
  } = useGameStore();
  
  const [animatingTiles, setAnimatingTiles] = useState<Set<number>>(new Set());
  const [animationTypes, setAnimationTypes] = useState<Map<number, string>>(new Map());
  
  const handleTileClick = (index: number) => {
    if (gameState !== 'playing' || gameMode !== 'selection') return;
    
    const isCurrentlySelected = selectedIndices.has(index);
    const targetCount = solutionIndices.size;
    const selectedCount = selectedIndices.size;
    
    if (!isCurrentlySelected && selectedCount >= targetCount) {
      return;
    }
    
    setAnimatingTiles(prev => new Set(prev).add(index));
    setAnimationTypes(prev => new Map(prev).set(index, isCurrentlySelected ? 'deselect' : 'select'));
    
    if (isCurrentlySelected) {
      useGameStore.getState().deselectTile(index);
    } else {
      useGameStore.getState().selectTile(index);
    }
    
    if (onTileSelect) {
      onTileSelect(index);
    }
    
    setTimeout(() => {
      setAnimatingTiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
      setAnimationTypes(prev => {
        const newMap = new Map(prev);
        newMap.delete(index);
        return newMap;
      });
    }, 300);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (gameState !== 'playing' || gameMode !== 'selection') return;
    
    const focusedElement = document.activeElement as HTMLElement;
    const tileIndex = parseInt(focusedElement?.dataset?.tileIndex || '-1');
    
    if (isNaN(tileIndex)) return;
    
    let newIndex = tileIndex;
    const boardSize = 15;
    
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        newIndex = Math.max(0, tileIndex - boardSize);
        break;
      case 'ArrowDown':
        e.preventDefault();
        newIndex = Math.min(board.length - 1, tileIndex + boardSize);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = Math.max(0, tileIndex - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        newIndex = Math.min(board.length - 1, tileIndex + 1);
        break;
      case ' ':
      case 'Enter':
        e.preventDefault();
        handleTileClick(tileIndex);
        return;
      default:
        return;
    }
    
    const newTile = document.querySelector(`[data-tile-index="${newIndex}"]`) as HTMLElement;
    if (newTile) {
      newTile.focus();
    }
  };
  
  useEffect(() => {
    if (gameState === 'checking') {
      const correctTiles: number[] = [];
      const wrongTiles: number[] = [];
      
      solutionIndices.forEach(index => {
        if (selectedIndices.has(index)) {
          correctTiles.push(index);
        }
      });
      
      selectedIndices.forEach(index => {
        if (!solutionIndices.has(index)) {
          wrongTiles.push(index);
        }
      });
      
      correctTiles.forEach((index, i) => {
        setTimeout(() => {
          setAnimatingTiles(prev => new Set(prev).add(index));
          setAnimationTypes(prev => new Map(prev).set(index, 'correct'));
        }, i * 50);
      });
      
      wrongTiles.forEach((index, i) => {
        setTimeout(() => {
          setAnimatingTiles(prev => new Set(prev).add(index));
          setAnimationTypes(prev => new Map(prev).set(index, 'wrong'));
        }, correctTiles.length * 50 + i * 50);
      });
      
      setTimeout(() => {
        setAnimatingTiles(new Set());
        setAnimationTypes(new Map());
      }, (correctTiles.length + wrongTiles.length) * 50 + 1000);
    }
  }, [gameState, selectedIndices, solutionIndices]);
  
  const gridCols = board.length === 225 ? 'grid-cols-15' : 'grid-cols-10';
  
  return (
    <div 
      className={cn(
        // Grid container - Clinical clean
        'relative w-full max-w-4xl mx-auto',
        'grid gap-1 p-4 rounded-xl',
        'bg-surface border border-border-standard',
        'focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2',
        gridCols,
        className
      )}
      onKeyDown={handleKeyDown}
      role="grid"
      aria-label={`Letter hunt game board. Find all ${targetLetters.join(' and ')} letters.`}
      tabIndex={gameState === 'playing' ? 0 : -1}
    >
      {board.map((letter, index) => {
        const status = getTileStatus(
          index,
          letter,
          targetLetters,
          selectedIndices,
          solutionIndices,
          gameState
        );
        
        const isAnimating = animatingTiles.has(index);
        const animationType = animationTypes.get(index) as any;
        
        return (
          <GameTile
            key={index}
            letter={letter}
            index={index}
            status={status}
            isAnimating={isAnimating}
            animationType={animationType}
            onClick={() => handleTileClick(index)}
            disabled={gameState !== 'playing'}
            size={tileSize}
            showHint={showHints && status === 'target'}
          />
        );
      })}
    </div>
  );
}
