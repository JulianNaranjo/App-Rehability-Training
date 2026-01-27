import { LetterHuntGame } from './letter-hunt-game.js';

document.addEventListener('DOMContentLoaded', () => {
  try {
    new LetterHuntGame();
  } catch (error) {
    console.error('Failed to initialize Letter Hunt Game:', error);
    
    // Fallback error display
    const errorDiv = document.createElement('div');
    errorDiv.textContent = 'Failed to load game. Please refresh the page.';
    errorDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #cf6679;
      color: white;
      padding: 2rem;
      border-radius: 8px;
      text-align: center;
      font-family: sans-serif;
    `;
    document.body.appendChild(errorDiv);
  }
});