# AGENTS.md - Letter Hunt Game Development Guide

This guide provides essential information for agentic coding agents working on the Letter Hunt codebase.

## Project Overview

Letter Hunt is a browser-based word puzzle game built with vanilla JavaScript, HTML, and CSS. Players search for target letters on a 15x15 grid across two levels of increasing difficulty.

## Build/Lint/Test Commands

This is a modular vanilla JavaScript project with TypeScript support:

```bash
# Development server
npm run dev

# Linting and formatting
npm run lint          # Check code quality
npm run lint:fix       # Auto-fix linting issues
npm run format        # Format code with Prettier

# Type checking
npm run typecheck      # Run TypeScript compiler checks

# Validation
npm run validate       # Run both linting and type checking

# No build step required - static files served directly
# For production deployment, serve the dist/ folder with any static server
```

## Code Style Guidelines

### JavaScript Structure & Conventions

**Class-Based Architecture:**
- Use ES6 classes for game logic (see `LetterHuntGame` in main.js:1)
- Constructor should initialize all DOM element references and game state
- Methods should be logically grouped (initialization, game generation, rendering, event handling)

**Naming Conventions:**
- Classes: PascalCase (`LetterHuntGame`)
- Methods: camelCase (`generateNewGame`, `toggleSelection`)
- Variables: camelCase (`boardSize`, `solutionIndices`)
- Constants: UPPER_SNAKE_CASE for truly static values
- DOM element references: suffix with `El` (`boardEl`, `instructionEl`)

**State Management:**
- Use Sets for tracking collections (`solutionIndices`, `selectedIndices`)
- Arrays for ordered data (`letters`, `targets`)
- Primitive values for simple state (`currentLevel`)

### DOM Manipulation Patterns

**Element Selection:**
- Cache DOM references in constructor using `document.getElementById()`
- Use `dataset` for storing element-specific data (tile indices)

**Event Handling:**
- Bind event listeners in `init()` method
- Use arrow functions to maintain `this` context
- Pass relevant data through parameters or dataset

**Rendering:**
- Clear containers before rebuilding (`boardEl.innerHTML = ''`)
- Create elements programmatically with `document.createElement()`
- Use CSS classes for state changes, avoid inline styles

### CSS Architecture & Conventions

**CSS Custom Properties (Variables):**
- Define in `:root` for global access
- Use semantic naming: `--primary-color`, `--tile-selected`
- Group related variables logically

**Class Naming:**
- Use BEM-inspired naming: `.game-board`, `.tile`, `.tile--selected`
- State modifiers: `.selected`, `.correct`, `.wrong`
- Component scoped: `.feedback-msg`, `.input-group`

**Layout:**
- CSS Grid for game board (`grid-template-columns: repeat(15, 1fr)`)
- Flexbox for component layouts
- Responsive design with fluid containers

### Algorithm Patterns

**Randomization:**
- Use Fisher-Yates shuffle for array randomization (main.js:67-70)
- Seeded randomness not required for this game
- Generate target counts using percentage ranges

**Validation Logic:**
- Validate user input before processing (main.js:159-164)
- Clear separation between UI state and game logic
- Provide immediate feedback for user actions

## Error Handling Guidelines

**Input Validation:**
- Check `isNaN()` for numeric inputs
- Validate ranges (board indices, letter counts)
- Provide user-friendly error messages

**DOM Safety:**
- Check element existence before manipulation
- Handle missing elements gracefully
- Use defensive programming for event handlers

**Game State:**
- Reset state completely between games
- Clear selections and feedback appropriately
- Maintain consistent state transitions

## Performance Considerations

**Rendering:**
- Batch DOM updates where possible
- Use CSS transforms for animations (better performance)
- Minimize reflows during game generation

**Memory:**
- Clear event references if implementing game reset
- Use efficient data structures (Sets for O(1) lookups)
- Avoid memory leaks with proper cleanup

## Testing Strategy

Since no tests exist currently, future testing should cover:

**Unit Tests:**
- Game logic functions (letter generation, validation)
- State transitions between levels
- Edge cases (empty boards, invalid inputs)

**Integration Tests:**
- User interaction flows
- DOM updates and rendering
- Event handling correctness

**Manual Testing Checklist:**
- Level 1 completion flow
- Level 2 progression
- Board refresh functionality
- Responsive design on different screen sizes

## Browser Compatibility

Target modern browsers with ES6+ support:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

Features used: ES6 classes, arrow functions, const/let, CSS Grid, CSS custom properties.

## Development Workflow

1. Test changes in browser directly (open index.html)
2. Check both game levels work correctly
3. Verify responsive design
4. Test edge cases (extreme inputs, rapid clicking)
5. Ensure no console errors

## File Structure

```
letter-hunt/
├── index.html    # Main game interface
├── main.js       # Game logic and state management
├── style.css     # Styling and animations
└── AGENTS.md     # This file
```

Keep files focused: HTML for structure, CSS for presentation, JavaScript for behavior and state.