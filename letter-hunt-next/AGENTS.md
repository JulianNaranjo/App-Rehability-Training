# AGENTS.md - Letter Hunt Development Guide

Essential information for agents working on this Next.js letter puzzle game.

## Build/Lint/Test Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server

# Linting & Type Check
npm run lint             # Run ESLint
npx eslint src/components/GameBoard.tsx  # Lint specific file
npx tsc --noEmit         # TypeScript check

# Testing (Playwright)
npm run test:e2e         # Run E2E tests
npm run test:e2e:headed  # Run with visible browser
npx playwright test --grep "test name"   # Run single test
npx playwright test e2e/game-selection.spec.ts  # Run specific file

# TestSprite
npm run test:sprite      # Run TestSprite tests
npm run test:sprite:headed
npm run test:sprite:ui
npm run test:sprite:trace  # Show TestSprite trace report
```

## Tech Stack

- **Framework:** Next.js 16+ with App Router
- **Language:** TypeScript 5+ (strict mode)
- **Styling:** Tailwind CSS v4
- **State:** Zustand with persist middleware
- **Icons:** Lucide React
- **Testing:** Playwright for E2E
- **Run single test:** `npx playwright test e2e/game-selection.spec.ts` or `npx playwright test --grep "test name"`
- **Utils:** clsx + tailwind-merge

## Game Modes

### Letter Hunt (Main Game)
Letter finding puzzle game with 6 levels using letters, numbers, and symbols.

### Working Memory
Memory training game with 7 progressive levels:

| Level | Type | Description |
|-------|------|-------------|
| 1 | Números → Letras | Tabla visible, completar grid |
| 2 | Números → Letras | Recordar letras primero, luego grid |
| 3 | Números → Sílabas | Tabla visible, completar grid (2 chars) |
| 4 | Números → Sílabas | Recordar sílabas primero, luego grid |
| 5 | Números → Símbolos | Tabla visible, completar grid |
| 6 | Números → Símbolos | Recordar símbolos primero, luego grid |
| 7 | Series | Memorizar series de 3-7 dígitos + invertir |

**Level 7 Flow:**
1. Mostrar serie (1 dígito por segundo)
2. Input orden normal
3. Si correcto → Input orden inverso
4. Si ambos correctos → Nueva serie
5. 3 series consecutivas correctas = Pasar a siguiente longitud
6. Progresión: 3 → 4 → 5 → 6 → 7 dígitos
7. Completar 3 series de 7 dígitos = Victoria final

**Symbols (Levels 5-6):** `+ - / % $ ¿ ? ! @ #` (10 símbolos, mapeo aleatorio)

**Progression:** ≥80% para desbloquear botón "Continuar al Nivel X"

## Code Style Guidelines

### TypeScript Conventions

**Naming:**
- Components: PascalCase (`GameBoard.tsx`)
- Functions: camelCase (`handleTileClick`)
- Constants: UPPER_SNAKE_CASE
- Types: PascalCase (`GameState`)

**Types:**
```typescript
interface GameConfig {
  level: number;
  targets: string[];
}

function calculateScore(correct: number): number {
  return correct * 10;
}
```

### Import Order

```typescript
// 1. React/Next
import { useState } from 'react';

// 2. Third-party
import { useGameStore } from '@/store/game-store';

// 3. Absolute imports
import { cn } from '@/lib/utils';
import type { GameState } from '@/types/game';

// 4. Relative (avoid when possible)
import { helper } from '../lib/helper';
```

**Path Aliases:**
- `@/components/*` - React components
- `@/lib/*` - Utility functions
- `@/types/*` - TypeScript types
- `@/store/*` - Zustand stores
- `@/app/*` - Next.js app router

### Component Structure

```typescript
'use client'; // Add for interactive components

interface Props {
  className?: string;
  onAction?: () => void;
}

export function ComponentName({ className, onAction }: Props) {
  return (
    <div className={cn('base-styles', className)}>
      {/* JSX */}
    </div>
  );
}
```

### Styling with Tailwind

**Class Order:** Layout → Spacing → Sizing → Typography → Visual → Interactive

```typescript
className={cn(
  'flex items-center gap-2 p-4 w-full',
  'text-sm font-medium',
  'bg-white border rounded-lg shadow-sm',
  'hover:bg-gray-50 focus:ring-2',
  className // Allow override last
)}
```

**Colors:**
- Primary: Purple (`primary-400` to `primary-900`)
- Secondary: Teal (`secondary-400` to `secondary-900`)
- Success: `success-500`, Error: `error-500`
- Warning: `warning-500`, Neutral: `neutral-100` to `neutral-950`

### State Management

```typescript
// Good - individual selectors
const level = useGameStore(state => state.level);
const { selectTile } = useGameStore();

// Avoid - causes re-renders
const store = useGameStore();
```

### Error Handling

```typescript
// Type guards
function isValidIndex(index: unknown): index is number {
  return typeof index === 'number' && index >= 0 && index < 225;
}

// Safe localStorage
export function safeOperation<T>(fn: () => T, defaultValue: T): T {
  try {
    return fn();
  } catch (error) {
    console.warn('Operation failed:', error);
    return defaultValue;
  }
}
```

## File Organization

```
src/
├── app/                 # Next.js app router
│   ├── game/[mode]/     # Game routes
│   ├── memory/working/  # Memory game
│   └── layout.tsx       # Root layout
├── components/          # React components
│   ├── memory/          # Memory game components
│   │   ├── WorkingMemoryGame.tsx  # Main memory game
│   │   ├── LevelSelector.tsx      # Level 1-7 selector
│   │   ├── ReferenceTable.tsx     # Numbers-Letters table
│   │   ├── ReferenceInputTable.tsx
│   │   ├── SyllableReferenceTable.tsx
│   │   ├── SyllableInputTable.tsx
│   │   ├── SymbolReferenceTable.tsx
│   │   ├── SymbolInputTable.tsx
│   │   ├── SeriesGame.tsx         # Level 7 main component
│   │   ├── SeriesDisplay.tsx      # Show series digits
│   │   ├── SeriesInput.tsx        # Input series
│   │   ├── SeriesProgress.tsx     # Progress indicator
│   │   └── NumberLetterGrid.tsx   # Game grid
│   ├── ui/              # Reusable UI
│   └── GameBoard.tsx    # Game components
├── lib/                 # Utilities
│   └── utils.ts         # cn() helper
├── store/               # Zustand stores
│   ├── game-store.ts
│   └── working-memory-store.ts
└── types/               # TypeScript types
    ├── game.ts
    └── working-memory.ts
```

## Best Practices

- Add `'use client';` for interactive components only
- Always accept `className?: string` prop and pass to `cn()`
- Use semantic HTML with proper ARIA labels
- Implement keyboard navigation
- Respect `prefers-reduced-motion` for animations
- Use `React.memo()` for expensive renders
- Lazy load components when appropriate
- Wrap localStorage in try-catch
- Validate all user inputs
- Run `npx tsc --noEmit` and `npm run lint` before committing

## Testing Guidelines

- Write E2E tests in `e2e/` directory
- Use accessibility selectors: `page.getByRole('button')`
- Test user flows, not implementation
- Run tests before committing

## Engram Memory (Persistent Context)

This project uses Engram for persistent memory across sessions.

**Session Start:**
- Call `mem_context` to recover previous session state before continuing

**Proactive Saving:**
- After significant work (bugs fixed, architecture decisions, patterns established), call `mem_save` without waiting for user request

**Tools available:**
- `mem_save` - Save important observations (bugs, decisions, patterns)
- `mem_search <query>` - Search memory
- `mem_context` - Get recent session context
