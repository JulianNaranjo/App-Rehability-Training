# Letter Hunt - Product Requirements Document

## Project Overview

**Letter Hunt** is a cognitive rehabilitation web application built with Next.js 16+, React 19, TypeScript 5+, and Tailwind CSS v4. The game helps users improve attention and memory through interactive letter-finding exercises on a 15x15 grid.

### Core Features

1. **Game Modes:**
   - **Selection Mode**: Click on target letters to select them
   - **Count Mode**: Count target letters mentally and submit the total

2. **Progressive Difficulty:**
   - Level 1: 1 target letter type (56-68 targets, 25-30% of board)
   - Level 2: 2 target letter types
   - Level 3: 3 target letter types
   - Level 4: 4 target letter types
   - Level 5: Numbers instead of letters (4 unique numbers 0-9)

3. **Game Board:**
   - 15x15 grid (225 tiles)
   - Keyboard navigation support (arrow keys)
   - Tile animations for selection/deselection
   - Real-time progress tracking
   - Timer and scoring system

4. **Accessibility Features:**
   - Reduced motion option
   - High contrast mode
   - Screen reader support
   - Keyboard-only navigation
   - Adjustable font sizes

5. **Persistence:**
   - Game stats (games played, best time, accuracy)
   - Leaderboard (top 10 scores)
   - User settings (theme, sound, animations)
   - LocalStorage-based storage

### Technical Architecture

- **State Management**: Zustand with subscribeWithSelector middleware
- **Routing**: Next.js App Router
- **Styling**: Tailwind CSS v4 with custom color palette
- **Type Safety**: TypeScript strict mode
- **Icons**: Lucide React
- **Utilities**: clsx + tailwind-merge

### User Flows

1. **Start Game:**
   - User lands on dashboard
   - Selects "Mejora atención" section
   - Chooses Selection or Count mode
   - Redirected to game page with mode initialized

2. **Playing Selection Mode:**
   - Board generates with target letters displayed
   - User clicks tiles to select/deselect
   - Progress shows "Selected: X/Y"
   - Cannot select more than total target count
   - Click "Verificar" to check answer
   - Visual feedback: correct (green), wrong (red), missed (unchanged)

3. **Playing Count Mode:**
   - Board displays with target letters
   - User counts mentally
   - Enters count in input field
   - Submits answer
   - Immediate feedback on correctness

4. **Progression:**
   - On correct answer: option to advance to next level
   - Max level: 5
   - Score calculated based on accuracy, time, and level

5. **Settings & Customization:**
   - Theme selection (colors, fonts)
   - Sound on/off
   - Animations on/off
   - Accessibility preferences

### Routes

- `/` → Redirects to `/dashboard`
- `/dashboard` → Main dashboard with game modes
- `/game/selection` → Selection mode game
- `/game/count` → Count mode game
- `/leaderboard` → Top scores display
- `/settings` → Game configuration
- `/profile` → User stats

### Data Models

**GameState:**
- board: string[] (225 letters/numbers)
- targetLetters: string[] (1-4 letters or 4 numbers)
- targetLetterCount: number (56-68)
- solutionIndices: Set<number> (target positions)
- selectedIndices: Set<number> (user selections)
- gameState: 'idle' | 'playing' | 'checking' | 'won' | 'lost' | 'paused'
- score, moveCount, startTime, endTime, currentLevel

**GameStats:**
- gamesPlayed, gamesWon, bestTime, averageTime, totalMoves, accuracy

**LeaderboardEntry:**
- id, playerName, score, time, level, date

### Key Interactions

1. **Tile Selection (Selection Mode):**
   - Click to select (adds to selectedIndices)
   - Click again to deselect
   - Maximum selection limit: solutionIndices.size
   - Sound effect on select/deselect
   - Visual animation (300ms)

2. **Answer Validation:**
   - Selection mode: Compare selectedIndices with solutionIndices
   - Count mode: Compare userCount with solutionIndices.size
   - Animation sequence: correct tiles first, then wrong tiles
   - 1.5s delay before showing win/lose state

3. **Navigation:**
   - Dashboard → Game: mode parameter in URL
   - Game uses useEffect to initialize with mode
   - Cleanup on unmount resets game state

4. **Keyboard Support:**
   - Arrow keys: Navigate tiles
   - Space/Enter: Select/deselect tile
   - Focus management with data-tile-index

### Performance Considerations

- Board generation uses Fisher-Yates shuffle (O(n))
- Tile status computed on render with getTileStatus()
- Animations use CSS transitions for GPU acceleration
- Debounced and throttled utility functions available
- Zustand selectors for minimal re-renders

### Browser Compatibility

- Modern browsers with ES6+ support
- Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- Features: ES6 classes, CSS Grid, CSS custom properties
