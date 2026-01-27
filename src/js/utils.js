import { GAME_CONFIG } from './constants.js';

export class Utils {
  static fisherYatesShuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  static getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static isValidNumber(value: string): boolean {
    const num = parseInt(value, 10);
    return !isNaN(num) && num >= 0;
  }

  static formatInstruction(level: number, targets: string[]): string {
    const targetString = targets.map(target => `<span class="highlight">${target}</span>`).join(' and ');
    return level === 1 
      ? `Level 1: Select all the ${targetString}'s`
      : `Level 2: Select the words ${targetString}`;
  }

  static createBoardElement(index: number, letter: string): HTMLElement {
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.textContent = letter;
    tile.dataset.index = index.toString();
    tile.style.animationDelay = `${index * GAME_CONFIG.ANIMATION_STAGGER_DELAY}s`;
    return tile;
  }

  static debounce(func, wait) {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }
}