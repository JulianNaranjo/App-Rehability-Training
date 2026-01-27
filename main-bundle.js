// Letter Hunt Game - Single File Version (ES5 compatible)
(function() {
    'use strict';

    // Game Configuration
    var GAME_CONFIG = {
        BOARD_SIZE: 15,
        MIN_TARGET_PERCENTAGE: 0.30,
        MAX_TARGET_PERCENTAGE: 0.40,
        ALPHABET: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        ANIMATION_STAGGER_DELAY: 0.05
    };

    var CSS_CLASSES = {
        TILE: 'tile',
        TILE_SELECTED: 'selected',
        TILE_CORRECT: 'correct',
        TILE_WRONG: 'wrong',
        FEEDBACK_SUCCESS: 'feedback-success',
        FEEDBACK_ERROR: 'feedback-error'
    };

    var MESSAGES = {
        CONGRATULATIONS: 'Congratulations! You found them all.',
        TRY_AGAIN: 'Try again. (There are',
        INVALID_INPUT: 'Please enter a number!',
        TYPE_COUNT: 'Type how many there are'
    };

    // Utility Functions
    function fisherYatesShuffle(array) {
        var shuffled = array.slice();
        for (var i = shuffled.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = shuffled[i];
            shuffled[i] = shuffled[j];
            shuffled[j] = temp;
        }
        return shuffled;
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function isValidNumber(value) {
        var num = parseInt(value, 10);
        return !isNaN(num) && num >= 0;
    }

    function formatInstruction(level, targets) {
        var targetString = targets.map(function(target) {
            return '<span class="highlight">' + target + '</span>';
        }).join(' and ');
        return level === 1 
            ? 'Level 1: Select all the ' + targetString + '\'s'
            : 'Level 2: Select the words ' + targetString;
    }

    function createBoardElement(index, letter) {
        var tile = document.createElement('div');
        tile.className = 'tile';
        tile.textContent = letter;
        tile.dataset.index = index;
        tile.style.animationDelay = (index * GAME_CONFIG.ANIMATION_STAGGER_DELAY) + 's';
        return tile;
    }

    // Game Generator
    function generateTargetCount(boardSize) {
        var minTarget = Math.ceil(boardSize * GAME_CONFIG.MIN_TARGET_PERCENTAGE);
        var maxTarget = Math.floor(boardSize * GAME_CONFIG.MAX_TARGET_PERCENTAGE);
        return getRandomInt(minTarget, maxTarget);
    }

    function generateTargetLetters(count) {
        var alphabet = GAME_CONFIG.ALPHABET.split('');
        var shuffled = fisherYatesShuffle(alphabet);
        return shuffled.slice(0, count);
    }

    function generateLevel1(boardSize) {
        var targets = generateTargetLetters(1);
        var targetCount = generateTargetCount(boardSize);
        
        return {
            level: 1,
            targets: targets,
            targetCount: targetCount
        };
    }

    function generateLevel2(boardSize) {
        var targets = generateTargetLetters(2);
        var targetCount = generateTargetCount(boardSize);
        
        return {
            level: 2,
            targets: targets,
            targetCount: targetCount
        };
    }

    function generateBoard(levelConfig, boardSize) {
        var letters = new Array(boardSize).fill(null);
        var solutionIndices = new Set();
        var indices = fisherYatesShuffle(Array.from({ length: boardSize }, function(_, i) { return i; }));

        // Place target letters
        for (var i = 0; i < levelConfig.targetCount; i++) {
            var randomTarget = levelConfig.targets[getRandomInt(0, levelConfig.targets.length - 1)];
            letters[indices[i]] = randomTarget;
            solutionIndices.add(indices[i]);
        }

        // Fill remaining positions with non-target letters
        for (var i = levelConfig.targetCount; i < boardSize; i++) {
            var letter;
            do {
                var randomIndex = getRandomInt(0, GAME_CONFIG.ALPHABET.length - 1);
                letter = GAME_CONFIG.ALPHABET[randomIndex];
            } while (levelConfig.targets.indexOf(letter) !== -1);
            letters[indices[i]] = letter;
        }

        return {
            letters: letters,
            solutionIndices: solutionIndices,
            targets: levelConfig.targets
        };
    }

    // UI Controller
    function UIController(elements) {
        this.elements = elements;
    }

    UIController.prototype.updateInstruction = function(level, targets) {
        this.elements.instructionEl.innerHTML = formatInstruction(level, targets);
    };

    UIController.prototype.renderBoard = function(letters, onTileClick) {
        this.elements.boardEl.innerHTML = '';
        
        var self = this;
        letters.forEach(function(letter, index) {
            var tile = createBoardElement(index, letter);
            tile.addEventListener('click', function() {
                onTileClick(index);
            });
            self.elements.boardEl.appendChild(tile);
        });
    };

    UIController.prototype.updateTileState = function(index, state) {
        var tiles = this.elements.boardEl.querySelectorAll('.tile');
        var tile = tiles[index];
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
    };

    UIController.prototype.updateFeedback = function(message, type) {
        this.elements.feedbackEl.textContent = message;
        this.elements.feedbackEl.className = 'feedback-msg';
        
        if (type === 'success') {
            this.elements.feedbackEl.classList.add(CSS_CLASSES.FEEDBACK_SUCCESS);
        } else if (type === 'error') {
            this.elements.feedbackEl.classList.add(CSS_CLASSES.FEEDBACK_ERROR);
        }
    };

    UIController.prototype.updateButtonVisibility = function(showContinue, showCheck) {
        this.elements.continueBtn.style.display = showContinue ? 'inline-block' : 'none';
        this.elements.checkBtn.style.display = showCheck ? 'inline-block' : 'none';
    };

    UIController.prototype.clearInput = function() {
        this.elements.inputEl.value = '';
    };

    UIController.prototype.getInputValue = function() {
        return parseInt(this.elements.inputEl.value, 10);
    };

    UIController.prototype.highlightSolution = function(solutionIndices, isCorrect) {
        var self = this;
        var tiles = this.elements.boardEl.querySelectorAll('.tile');
        tiles.forEach(function(tile, index) {
            if (solutionIndices.has(index)) {
                self.updateTileState(index, isCorrect ? 'correct' : 'wrong');
            }
        });
    };

    UIController.prototype.reset = function() {
        this.clearInput();
        this.updateFeedback('', '');
        this.updateButtonVisibility(false, true);
    };

    // Main Game Class
    function LetterHuntGame() {
        this.boardSize = GAME_CONFIG.BOARD_SIZE * GAME_CONFIG.BOARD_SIZE;
        this.gameState = {
            currentLevel: 1,
            letters: new Array(this.boardSize).fill(null),
            solutionIndices: new Set(),
            selectedIndices: new Set(),
            targets: []
        };

        this.elements = this.initializeElements();
        this.uiController = new UIController(this.elements);
        this.initializeEventListeners();
        this.startNewGame();
    }

    LetterHuntGame.prototype.initializeElements = function() {
        var elements = {
            boardEl: document.getElementById('game-board'),
            instructionEl: document.getElementById('instruction'),
            refreshBtn: document.getElementById('refresh-btn'),
            inputEl: document.getElementById('count-input'),
            checkBtn: document.getElementById('check-btn'),
            continueBtn: document.getElementById('continue-btn'),
            feedbackEl: document.getElementById('feedback-msg')
        };

        this.validateElements(elements);
        return elements;
    };

    LetterHuntGame.prototype.validateElements = function(elements) {
        var self = this;
        Object.keys(elements).forEach(function(key) {
            if (!elements[key]) {
                throw new Error('Required element not found: ' + key);
            }
        });
    };

    LetterHuntGame.prototype.initializeEventListeners = function() {
        var self = this;
        this.elements.refreshBtn.addEventListener('click', function() {
            self.handleRefresh();
        });
        this.elements.checkBtn.addEventListener('click', function() {
            self.handleCheckAnswer();
        });
        this.elements.continueBtn.addEventListener('click', function() {
            self.handleContinueToLevel2();
        });
    };

    LetterHuntGame.prototype.handleRefresh = function() {
        this.gameState.currentLevel = 1;
        this.startNewGame();
    };

    LetterHuntGame.prototype.handleContinueToLevel2 = function() {
        this.gameState.currentLevel = 2;
        this.startNewGame();
    };

    LetterHuntGame.prototype.startNewGame = function() {
        this.resetGameState();
        this.generateLevel();
        this.renderGame();
    };

    LetterHuntGame.prototype.resetGameState = function() {
        this.gameState.selectedIndices.clear();
        this.gameState.solutionIndices.clear();
        this.uiController.reset();
    };

    LetterHuntGame.prototype.generateLevel = function() {
        var levelConfig = this.gameState.currentLevel === 1
            ? generateLevel1(this.boardSize)
            : generateLevel2(this.boardSize);

        var boardData = generateBoard(levelConfig, this.boardSize);
        
        this.gameState.letters = boardData.letters;
        this.gameState.solutionIndices = boardData.solutionIndices;
        this.gameState.targets = boardData.targets;
    };

    LetterHuntGame.prototype.renderGame = function() {
        var self = this;
        this.uiController.updateInstruction(this.gameState.currentLevel, this.gameState.targets);
        this.uiController.renderBoard(this.gameState.letters, function(index) {
            self.handleTileClick(index);
        });
    };

    LetterHuntGame.prototype.handleTileClick = function(index) {
        if (this.gameState.selectedIndices.has(index)) {
            this.gameState.selectedIndices.delete(index);
            this.uiController.updateTileState(index, 'default');
        } else {
            this.gameState.selectedIndices.add(index);
            this.uiController.updateTileState(index, 'selected');
        }
    };

    LetterHuntGame.prototype.handleCheckAnswer = function() {
        var userCount = this.uiController.getInputValue();
        
        if (!isValidNumber(this.uiController.getInputValue().toString())) {
            this.uiController.updateFeedback(MESSAGES.INVALID_INPUT, 'error');
            return;
        }

        var actualCount = this.gameState.solutionIndices.size;
        var isCorrect = userCount === actualCount;

        this.uiController.highlightSolution(this.gameState.solutionIndices, isCorrect);

        if (isCorrect) {
            this.handleCorrectAnswer(actualCount);
        } else {
            this.handleIncorrectAnswer(actualCount);
        }
    };

    LetterHuntGame.prototype.handleCorrectAnswer = function(actualCount) {
        this.uiController.updateFeedback(MESSAGES.CONGRATULATIONS, 'success');
        
        if (this.gameState.currentLevel === 1) {
            this.uiController.updateButtonVisibility(true, false);
        }
    };

    LetterHuntGame.prototype.handleIncorrectAnswer = function(actualCount) {
        this.uiController.updateFeedback(MESSAGES.TRY_AGAIN + ' ' + actualCount + ')', 'error');
    };

    // Initialize game when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        try {
            new LetterHuntGame();
        } catch (error) {
            console.error('Failed to initialize Letter Hunt Game:', error);
            
            // Fallback error display
            var errorDiv = document.createElement('div');
            errorDiv.textContent = 'Failed to load game. Please refresh the page.';
            errorDiv.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #cf6679; color: white; padding: 2rem; border-radius: 8px; text-align: center; font-family: sans-serif;';
            document.body.appendChild(errorDiv);
        }
    });

})();