import { GameGenerator } from './game-generator.js';
import { UIController } from './ui-controller.js';
import { Utils } from './utils.js';
import { GAME_CONFIG, MESSAGES } from './constants.js';


export class LetterHuntGame {
  constructor() {
    this.boardSize = GAME_CONFIG.BOARD_SIZE * GAME_CONFIG.BOARD_SIZE;
    this.gameState = {
      currentLevel: 1,
      letters: new Array(this.boardSize).fill(null),
      solutionIndices: new Set(),
      selectedIndices: new Set(),
      targets: [],
    };

    this.elements = this.initializeElements();
    this.uiController = new UIController(this.elements);
    this.initializeEventListeners();
    this.startNewGame();
  }

  initializeElements() {
    const elements = {
      boardEl: document.getElementById('game-board') as HTMLElement,
      instructionEl: document.getElementById('instruction') as HTMLElement,
      refreshBtn: document.getElementById('refresh-btn') as HTMLButtonElement,
      inputEl: document.getElementById('count-input') as HTMLInputElement,
      checkBtn: document.getElementById('check-btn') as HTMLButtonElement,
      continueBtn: document.getElementById('continue-btn') as HTMLButtonElement,
      feedbackEl: document.getElementById('feedback-msg') as HTMLElement,
    };

    this.validateElements(elements);
    return elements;
  }

  validateElements(elements) {
    Object.entries(elements).forEach(([key, element]) => {
      if (!element) {
        throw new Error(`Required element not found: ${key}`);
      }
    });
  }

  initializeEventListeners() {
    this.elements.refreshBtn.addEventListener('click', () => this.handleRefresh());
    this.elements.checkBtn.addEventListener('click', () => this.handleCheckAnswer());
    this.elements.continueBtn.addEventListener('click', () => this.handleContinueToLevel2());
  }

  handleRefresh() {
    this.gameState.currentLevel = 1;
    this.startNewGame();
  }

  handleContinueToLevel2() {
    this.gameState.currentLevel = 2;
    this.startNewGame();
  }

  startNewGame() {
    this.resetGameState();
    this.generateLevel();
    this.renderGame();
  }

  resetGameState() {
    this.gameState.selectedIndices.clear();
    this.gameState.solutionIndices.clear();
    this.uiController.reset();
  }

  generateLevel() {
    const levelConfig = this.gameState.currentLevel === 1
      ? GameGenerator.generateLevel1(this.boardSize)
      : GameGenerator.generateLevel2(this.boardSize);

    const boardData = GameGenerator.generateBoard(levelConfig, this.boardSize);
    
    this.gameState.letters = boardData.letters;
    this.gameState.solutionIndices = boardData.solutionIndices;
    this.gameState.targets = boardData.targets;
  }

  renderGame() {
    this.uiController.updateInstruction(this.gameState.currentLevel, this.gameState.targets);
    this.uiController.renderBoard(this.gameState.letters, (index) => this.handleTileClick(index));
  }

  handleTileClick(index) {
    if (this.gameState.selectedIndices.has(index)) {
      this.gameState.selectedIndices.delete(index);
      this.uiController.updateTileState(index, 'default');
    } else {
      this.gameState.selectedIndices.add(index);
      this.uiController.updateTileState(index, 'selected');
    }
  }

  handleCheckAnswer() {
    const userCount = this.uiController.getInputValue();
    
    if (!Utils.isValidNumber(this.uiController.getInputValue().toString())) {
      this.uiController.updateFeedback(MESSAGES.INVALID_INPUT, 'error');
      return;
    }

    const actualCount = this.gameState.solutionIndices.size;
    const isCorrect = userCount === actualCount;

    this.uiController.highlightSolution(this.gameState.solutionIndices, isCorrect);

    if (isCorrect) {
      this.handleCorrectAnswer(actualCount);
    } else {
      this.handleIncorrectAnswer(actualCount);
    }
  }

  handleCorrectAnswer(actualCount) {
    this.uiController.updateFeedback(MESSAGES.CONGRATULATIONS, 'success');
    
    if (this.gameState.currentLevel === 1) {
      this.uiController.updateButtonVisibility(true, false);
    }
  }

  handleIncorrectAnswer(actualCount) {
    this.uiController.updateFeedback(`${MESSAGES.TRY_AGAIN} ${actualCount})`, 'error');
  }
}