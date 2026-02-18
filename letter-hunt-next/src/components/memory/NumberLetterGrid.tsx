'use client';

/**
 * Number Letter Grid Component
 * 
 * Main 28x12 grid for the working memory game.
 * Pattern: Input row -> Empty row -> Number row (repeating)
 * 
 * @module NumberLetterGrid
 */

import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { GridCell } from '@/types/working-memory';

interface NumberLetterGridProps {
  grid: GridCell[][];
  onCellChange: (row: number, col: number, value: string) => void;
  isValidated: boolean;
  className?: string;
}

export function NumberLetterGrid({
  grid,
  onCellChange,
  isValidated,
  className,
}: NumberLetterGridProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[][]>([]);
  
  // Initialize refs
  useEffect(() => {
    inputRefs.current = grid.map((row) =>
      row.map(() => null)
    );
  }, [grid]);
  
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    row: number,
    col: number
  ) => {
    if (isValidated) return;
    
    const moveFocus = (nextRow: number, nextCol: number) => {
      // Encontrar el siguiente input válido
      let r = nextRow;
      let c = nextCol;
      let attempts = 0;
      const maxAttempts = grid.length * grid[0]?.length || 0;
      
      while (attempts < maxAttempts) {
        if (r >= 0 && r < grid.length && c >= 0 && c < grid[r].length) {
          if (grid[r][c].type === 'input' && inputRefs.current[r]?.[c]) {
            inputRefs.current[r][c]?.focus();
            return;
          }
        }
        
        // Mover a la siguiente celda
        c++;
        if (c >= grid[r].length) {
          c = 0;
          r++;
        }
        attempts++;
      }
    };
    
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        moveFocus(row, col + 1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        moveFocus(row, col - 1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        // Buscar el siguiente input en la siguiente fila de inputs
        // Las filas de inputs son 0, 3, 6, 9... (cada 3)
        const nextInputRow = row + 3;
        if (nextInputRow < grid.length) {
          moveFocus(nextInputRow, col);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        const prevInputRow = row - 3;
        if (prevInputRow >= 0) {
          moveFocus(prevInputRow, col);
        }
        break;
      case 'Enter':
        e.preventDefault();
        moveFocus(row, col + 1);
        break;
    }
  };
  
  const getCellStyles = (cell: GridCell) => {
    const baseStyles = cn(
      'w-full aspect-square flex items-center justify-center',
      'text-sm font-medium rounded-md',
      'transition-all duration-150'
    );
    
    if (cell.type === 'empty') {
      return cn(baseStyles, 'h-2'); // Fila vacía más pequeña
    }
    
    if (cell.type === 'number') {
      return cn(
        baseStyles,
        'bg-surface-elevated text-text-secondary',
        'border border-border-soft',
        'font-mono text-lg'
      );
    }
    
    // Input cell
    if (isValidated) {
      if (cell.isCorrect) {
        return cn(
          baseStyles,
          'bg-success-100 border-2 border-success-500 text-success-700',
          'cursor-default'
        );
      } else {
        return cn(
          baseStyles,
          'bg-error-100 border-2 border-error-500 text-error-700',
          'cursor-default'
        );
      }
    }
    
    return cn(
      baseStyles,
      'bg-surface border-2 border-border-standard',
      'focus:border-primary-400 focus:ring-2 focus:ring-primary-200',
      'text-text-primary placeholder:text-text-tertiary',
      'hover:border-primary-300'
    );
  };
  
  return (
    <div className={cn('w-full overflow-x-auto', className)}>
      <div className="inline-block min-w-full">
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${grid[0]?.length || 12}, minmax(32px, 1fr))`,
          }}
        >
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              if (cell.type === 'empty') {
                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className="h-2"
                  />
                );
              }
              
              if (cell.type === 'number') {
                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={getCellStyles(cell)}
                  >
                    {cell.value}
                  </div>
                );
              }
              
              // Input cell
              return (
                <input
                  key={`${rowIndex}-${colIndex}`}
                  ref={(el) => {
                    if (!inputRefs.current[rowIndex]) {
                      inputRefs.current[rowIndex] = [];
                    }
                    inputRefs.current[rowIndex][colIndex] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={cell.value}
                  onChange={(e) =>
                    onCellChange(rowIndex, colIndex, e.target.value)
                  }
                  onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                  disabled={isValidated}
                  className={cn(
                    getCellStyles(cell),
                    'text-center uppercase'
                  )}
                  aria-label={`Fila ${rowIndex + 1}, Columna ${colIndex + 1}`}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
