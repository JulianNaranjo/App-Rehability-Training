import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface GameTileProps {
  letter: string;
  index: number;
  status: 'empty' | 'target' | 'selected' | 'correct' | 'wrong';
  isAnimating: boolean;
  animationType?: 'select' | 'deselect' | 'correct' | 'wrong' | 'celebrate';
  onClick: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showHint?: boolean;
}

export function GameTile({
  letter,
  index,
  status,
  isAnimating,
  animationType = 'select',
  onClick,
  disabled = false,
  size = 'md',
  showHint = false,
}: GameTileProps) {
  const [isPressed, setIsPressed] = useState(false);
  
  const tileSizes = {
    sm: 'text-sm p-2 min-w-[2rem] min-h-[2rem]',
    md: 'text-base p-3 min-w-[3rem] min-h-[3rem]', 
    lg: 'text-lg p-4 min-w-[4rem] min-h-[4rem]',
  };
  
  const getStatusStyles = () => {
    switch (status) {
      case 'selected':
        // Fondo violeta, TEXTO NEGRO (siempre negro)
        return 'bg-primary-500 text-gray-900 border-2 border-primary-600 shadow-lg';
      case 'correct':
        // Fondo verde, TEXTO NEGRO
        return 'bg-success text-gray-900 border-2 border-success';
      case 'wrong':
        // Fondo rojo, TEXTO NEGRO
        return 'bg-error text-gray-900 border-2 border-error animate-shake';
      case 'target':
        // IDÉNTICO al estado normal - sin pistas visuales
        return 'bg-white text-gray-900 border-2 border-gray-800 shadow-sm';
      default:
        // Estado normal: Fondo blanco, TEXTO NEGRO
        return 'bg-white text-gray-900 border-2 border-gray-800 shadow-sm';
    }
  };
  
  const getAnimationClasses = () => {
    if (!isAnimating) return '';
    
    switch (animationType) {
      case 'select':
        return 'animate-tile-select';
      case 'deselect':
        return 'animate-tile-deselect';
      case 'correct':
        return 'animate-correct';
      case 'wrong':
        return 'animate-wrong';
      case 'celebrate':
        return 'animate-celebrate';
      default:
        return '';
    }
  };
  
  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);
  
  return (
    <button
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      disabled={disabled}
      className={cn(
        // Base styles
        'relative rounded-xl font-bold transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-neutral-950',
        'hover:scale-105 active:scale-95',
        
        // Size
        tileSizes[size],
        
        // Status
        getStatusStyles(),
        
        // Animations
        getAnimationClasses(),
        
        // Interaction states
        isPressed && !disabled && 'scale-95',
        disabled && 'cursor-not-allowed opacity-50',
        
        // Hint glow
        showHint && status === 'target' && 'animate-pulse ring-2 ring-warning ring-opacity-50'
      )}
      aria-label={`Tile ${index + 1}: ${letter || 'empty'}`}
      role="gridcell"
    >
      {/* Letter content */}
      <span className="relative z-10">
        {letter}
      </span>
      
      {/* Overlay effects */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/0 via-white/10 to-white/0 opacity-0 hover:opacity-100 transition-opacity duration-300" />
      
      {/* Success ripple effect */}
      {status === 'correct' && (
        <div className="absolute inset-0 rounded-xl">
          <div className="absolute inset-0 bg-success/30 animate-ping" />
        </div>
      )}
    </button>
  );
}