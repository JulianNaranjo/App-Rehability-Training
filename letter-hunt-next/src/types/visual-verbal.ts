export interface VisoVerbalItem {
  id: string;
  name: string;
  imageUrl: string;
}

export type VisoVerbalPhase = 'memorize' | 'recall' | 'results';

export interface VisoVerbalState {
  currentPhase: VisoVerbalPhase;
  items: VisoVerbalItem[];
  userAnswers: string[];
  correctAnswers: string[];
  startTime: number | null;
  score: number;
}

export interface VisoVerbalStats {
  gamesPlayed: number;
  averageScore: number;
  bestScore: number;
}

export const DEFAULT_VISO_VERBAL_ITEMS: VisoVerbalItem[] = [
  { id: 'avion', name: 'Avión', imageUrl: '/images/avion.jpg' },
  { id: 'billetera', name: 'Billetera', imageUrl: '/images/billetera.jpg' },
  { id: 'radio', name: 'Radio', imageUrl: '/images/radio.jpg' },
  { id: 'tenedor', name: 'Tenedor', imageUrl: '/images/tenedor.jpg' },
];
