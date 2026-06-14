export interface VisualShape {
  id: string;
  name: string;
  color: string;
}

export type VisualMemoryLevel = 1;

export type VisualMemoryPhase = 'memorize' | 'recall' | 'results';

export interface VisualMemoryState {
  currentLevel: VisualMemoryLevel;
  currentPhase: VisualMemoryPhase;
  shapes: VisualShape[];
  drawingDataUrl: string | null;
  userSelfEvaluation: boolean | null;
  selectedShapes: string[];
  startTime: number | null;
  gamesCompleted: number;
}

export interface VisualMemoryStats {
  gamesPlayed: number;
  timesCompleted: number;
  averageTime: number;
}

export const DEFAULT_SHAPES: VisualShape[] = [
  { id: 'happy-face', name: 'Carita feliz', color: '#FFD700' },
  { id: 'lightning', name: 'Rayo', color: '#FFD700' },
  { id: 'arrow-right', name: 'Flecha derecha', color: '#3B82F6' },
  { id: 'heart', name: 'Corazón', color: '#EF4444' },
  { id: 'triangle', name: 'Triángulo', color: '#22C55E' },
  { id: 'diamond', name: 'Romboide', color: '#A855F7' },
  { id: 'crescent', name: 'Media luna', color: '#6B7280' },
  { id: 'circle-x', name: 'Círculo con X', color: '#F97316' },
  { id: 'pentagon', name: 'Pentágono', color: '#06B6D4' },
];
