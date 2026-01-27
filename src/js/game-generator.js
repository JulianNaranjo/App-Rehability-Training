import { Utils } from './utils.js';
import { GAME_CONFIG } from './constants.js';
export class GameGenerator {
  static generateTargetCount(boardSize) {
    const minTarget = Math.ceil(boardSize * GAME_CONFIG.MIN_TARGET_PERCENTAGE);
    const maxTarget = Math.floor(boardSize * GAME_CONFIG.MAX_TARGET_PERCENTAGE);
    return Utils.getRandomInt(minTarget, maxTarget);
  }

  static generateTargetLetters(count) {
    const alphabet = GAME_CONFIG.ALPHABET.split('');
    const shuffled = Utils.fisherYatesShuffle(alphabet);
    return shuffled.slice(0, count);
  }

  static generateLevel1(boardSize) {
    const targets = this.generateTargetLetters(1);
    const targetCount = this.generateTargetCount(boardSize);
    
    return {
      level: 1,
      targets,
      targetCount,
    };
  }

  static generateLevel2(boardSize) {
    const targets = this.generateTargetLetters(2);
    const targetCount = this.generateTargetCount(boardSize);
    
    return {
      level: 2,
      targets,
      targetCount,
    };
  }

  static generateBoard(levelConfig, boardSize) {
    const letters = new Array(boardSize).fill(null);
    const solutionIndices = new Set();
    const indices = Utils.fisherYatesShuffle(Array.from({ length: boardSize }, (_, i) => i));

    // Place target letters
    for (let i = 0; i < levelConfig.targetCount; i++) {
      const randomTarget = levelConfig.targets[Utils.getRandomInt(0, levelConfig.targets.length - 1)];
      letters[indices[i]] = randomTarget;
      solutionIndices.add(indices[i]);
    }

    // Fill remaining positions with non-target letters
    for (let i = levelConfig.targetCount; i < boardSize; i++) {
      let letter;
      do {
        const randomIndex = Utils.getRandomInt(0, GAME_CONFIG.ALPHABET.length - 1);
        letter = GAME_CONFIG.ALPHABET[randomIndex];
      } while (levelConfig.targets.includes(letter));
      letters[indices[i]] = letter;
    }

    return {
      letters,
      solutionIndices,
      targets: levelConfig.targets,
    };
  }
}