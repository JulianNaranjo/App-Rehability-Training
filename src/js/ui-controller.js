import { Utils } from './utils.js';
import { CSS_CLASSES, MESSAGES } from './constants.js';
export class UIController {
  constructor(elements) {
    this.elements = elements;
  }

  updateInstruction(level, targets) {
    this.elements.instructionEl.innerHTML = Utils.formatInstruction(level, targets);
  }

  renderBoard(letters, onTileClick) {
    this.elements.boardEl.innerHTML = '';
    
    letters.forEach((letter, index) => {
      const tile = Utils.createBoardElement(index, letter);
      tile.addEventListener('click', () => onTileClick(index));
      this.elements.boardEl.appendChild(tile);
    });
  }

  updateTileState(index, state) {
    const tiles = this.elements.boardEl.querySelectorAll('.tile');
    const tile = tiles[index];
    if (!tile) return;

    tile.classList.remove(CSS_CLASSES.TILE_SELECTED, CSS_CLASSES.TILE_CORRECT, CSS_CLASSES.TILE_WRONG);
    
    switch (state) {
      case 'selected':
        tile.classList.add(CSS_CLASSES.TILE_SELECTED);
        break;
      case 'correct':
        tile.classList.add(CSS_CLASSES.TILE_CORRECT);
        break;
      case 'wrong':
        tile.classList.add(CSS_CLASSES.TILE_WRONG);
        break;
    }
  }

  updateFeedback(message, type) {
    this.elements.feedbackEl.textContent = message;
    this.elements.feedbackEl.className = 'feedback-msg';
    
    if (type === 'success') {
      this.elements.feedbackEl.classList.add(CSS_CLASSES.FEEDBACK_SUCCESS);
    } else if (type === 'error') {
      this.elements.feedbackEl.classList.add(CSS_CLASSES.FEEDBACK_ERROR);
    }
  }

  updateButtonVisibility(showContinue, showCheck) {
    this.elements.continueBtn.style.display = showContinue ? 'inline-block' : 'none';
    this.elements.checkBtn.style.display = showCheck ? 'inline-block' : 'none';
  }

  clearInput() {
    this.elements.inputEl.value = '';
  }

  getInputValue() {
    return parseInt(this.elements.inputEl.value, 10);
  }

  highlightSolution(solutionIndices, isCorrect) {
    const tiles = this.elements.boardEl.querySelectorAll('.tile');
    tiles.forEach((tile, index) => {
      if (solutionIndices.has(index)) {
        this.updateTileState(index, isCorrect ? 'correct' : 'wrong');
      }
    });
  }

  reset() {
    this.clearInput();
    this.updateFeedback('', '');
    this.updateButtonVisibility(false, true);
  }
}