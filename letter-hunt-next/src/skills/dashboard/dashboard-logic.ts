/**
 * Dashboard Logic - Cognitive Rehabilitation Program
 * 
 * Configuration and types for the dashboard sections.
 * This file contains pure logic without React dependencies.
 * 
 * @module dashboard-logic
 */

import type { GameMode } from '@/types/game';

/**
 * Configuration for a game mode card
 */
export interface GameModeConfig {
  /** Unique identifier for the mode */
  id: GameMode | 'visual-memory' | 'matching-pairs' | 'working-memory';
  /** Display title */
  title: string;
  /** Lucide icon name */
  icon: string;
  /** Tailwind gradient classes - COMPLETE classes for Tailwind v4 */
  gradientFrom: string;
  gradientTo: string;
  /** Brief description for the card */
  shortDescription: string;
  /** Detailed instructions */
  instructions: string;
}

/**
 * Configuration for a dashboard section
 */
export interface DashboardSectionConfig {
  /** Section identifier */
  id: string;
  /** Section title */
  title: string;
  /** Section description */
  description: string;
  /** Available game modes in this section */
  gameModes: GameModeConfig[];
  /** Background color for instruction cards - COMPLETE classes */
  instructionBgLight: string;
  instructionBgDark: string;
  /** Text color for instruction cards - COMPLETE classes */
  instructionTextLight: string;
  instructionTextDark: string;
  instructionTitleLight: string;
  instructionTitleDark: string;
}

/**
 * Complete dashboard configuration
 */
export interface DashboardConfig {
  /** Application title */
  appTitle: string;
  /** Available sections */
  sections: DashboardSectionConfig[];
}

/**
 * Dashboard configuration object
 * Using complete Tailwind classes for v4 compatibility
 */
export const dashboardConfig: DashboardConfig = {
  appTitle: 'Programa de rehabilitación',
  sections: [
    {
      id: 'attention',
      title: 'Mejora atención',
      description: 'Selecciona cómo quieres jugar y avanza a través de niveles más desafiantes.',
      gameModes: [
        {
          id: 'selection',
          title: 'Modo Selección',
          icon: 'MousePointerClick',
          gradientFrom: 'from-primary-500',
          gradientTo: 'to-primary-700',
          shortDescription: 'Selección interactiva',
          instructions: 'Haz clic en las letras objetivo para seleccionarlas. Muestra tu progreso con "Seleccionadas: X/Y".',
        },
        {
          id: 'count',
          title: 'Modo Conteo',
          icon: 'Calculator',
          gradientFrom: 'from-secondary-500',
          gradientTo: 'to-secondary-700',
          shortDescription: 'Conteo mental',
          instructions: 'Cuenta las letras objetivo mentalmente e ingresa el número total. ¡Pon a prueba tu percepción visual!',
        },
      ],
      instructionBgLight: 'bg-primary-50',
      instructionBgDark: 'dark:bg-primary-900/20',
      instructionTextLight: 'text-primary-700',
      instructionTextDark: 'dark:text-primary-300',
      instructionTitleLight: 'text-primary-800',
      instructionTitleDark: 'dark:text-primary-200',
    },
    {
      id: 'memory',
      title: 'Mejorar memoria',
      description: 'Entrena tu memoria con ejercicios progresivos.',
      gameModes: [
        {
          id: 'working-memory',
          title: 'Memoria de Trabajo',
          icon: 'Brain',
          gradientFrom: 'from-warning-400',
          gradientTo: 'to-warning-600',
          shortDescription: 'Asociación número-letra',
          instructions: 'Memoriza la tabla de referencia y completa las casillas con la letra correspondiente a cada número. ¡Entrena tu memoria de trabajo!',
        },
        {
          id: 'visual-memory',
          title: 'Memoria Visual',
          icon: 'Eye',
          gradientFrom: 'from-warning-500',
          gradientTo: 'to-warning-700',
          shortDescription: 'Recordar patrones',
          instructions: 'Observa el patrón de letras durante unos segundos y luego reproduce la secuencia exacta. ¡Desafía tu memoria visual!',
        },
        {
          id: 'matching-pairs',
          title: 'Pares/Matching',
          icon: 'Layers',
          gradientFrom: 'from-warning-600',
          gradientTo: 'to-warning-800',
          shortDescription: 'Juego de cartas',
          instructions: 'Encuentra las parejas de letras iguales volteando cartas. Memoria las posiciones para completarlo en menos intentos.',
        },
      ],
      instructionBgLight: 'bg-warning-50',
      instructionBgDark: 'dark:bg-warning-900/20',
      instructionTextLight: 'text-warning-700',
      instructionTextDark: 'dark:text-warning-300',
      instructionTitleLight: 'text-warning-800',
      instructionTitleDark: 'dark:text-warning-200',
    },
  ],
};

/**
 * Get section configuration by ID
 */
export function getSectionConfig(sectionId: string): DashboardSectionConfig | undefined {
  return dashboardConfig.sections.find(section => section.id === sectionId);
}

/**
 * Get game mode configuration by ID
 */
export function getGameModeConfig(modeId: string): GameModeConfig | undefined {
  for (const section of dashboardConfig.sections) {
    const mode = section.gameModes.find(m => m.id === modeId);
    if (mode) return mode;
  }
  return undefined;
}

/**
 * Type guard for GameMode from attention section
 */
export function isAttentionGameMode(mode: string): mode is GameMode {
  return mode === 'selection' || mode === 'count';
}

/**
 * Type guard for memory game modes
 */
export function isMemoryGameMode(mode: string): mode is 'visual-memory' | 'matching-pairs' | 'working-memory' {
  return mode === 'visual-memory' || mode === 'matching-pairs' || mode === 'working-memory';
}
