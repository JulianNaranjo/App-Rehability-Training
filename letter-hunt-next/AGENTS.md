# AGENTS.md - Letter Hunt Development Guide

This guide provides essential information for agentic coding agents working on the Letter Hunt codebase.

## Build/Lint/TypeCheck Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint

# Lint specific files
npx eslint src/components/GameBoard.tsx

# Type check (via Next.js)
npx tsc --noEmit

# Install dependencies
npm install
```

**Note:** No test framework is currently configured. When adding tests, use Jest or Vitest with React Testing Library.

## Tech Stack

- **Framework:** Next.js 16+ with App Router
- **Language:** TypeScript 5+ (strict mode enabled)
- **Styling:** Tailwind CSS v4 with custom color palette
- **State Management:** Zustand with persist middleware
- **Icons:** Lucide React
- **Utilities:** clsx + tailwind-merge for class merging

## Code Style Guidelines

### TypeScript Conventions

**Types & Interfaces:**
- Use explicit return types on functions
- Prefer `interface` over `type` for object shapes
- Export types from `src/types/` directory
- Use strict null checks

**Naming Conventions:**
- Components: PascalCase (`GameBoard.tsx`)
- Functions: camelCase (`handleTileClick`)
- Constants: UPPER_SNAKE_CASE (`BOARD_SIZE`)
- Types/Interfaces: PascalCase (`GameState`, `GameConfig`)
- Files: PascalCase for components, camelCase for utilities

### Import Patterns

**Order:**
1. React/Next imports
2. Third-party libraries
3. Absolute imports (`@/components`, `@/lib`, `@/types`)
4. Relative imports (only when necessary)

```typescript
import { useState } from 'react';
import { useGameStore } from '@/store/game-store';
import { cn } from '@/lib/utils';
import type { GameState } from '@/types/game';
```

**Path Aliases:**
- `@/components/*` - React components
- `@/lib/*` - Utility functions
- `@/types/*` - TypeScript types
- `@/store/*` - Zustand stores
- `@/app/*` - Next.js app router files

### Component Structure

**Function Components:**
```typescript
interface ComponentProps {
  className?: string;
  onAction?: () => void;
}

export function ComponentName({ className, onAction }: ComponentProps) {
  // Component logic
  return <div className={cn('base-styles', className)}>...</div>;
}
```

**Client Components:**
- Add `'use client';` at the top for interactive components
- Keep server components default when possible

### Styling with Tailwind

**Class Ordering:**
- Layout (position, display, grid/flex)
- Spacing (padding, margin, gap)
- Sizing (width, height)
- Typography (font, text)
- Visual (bg, border, shadow)
- Interactive (hover, focus, disabled)

**Use `cn()` Utility:**
```typescript
className={cn(
  'base-classes',
  conditional && 'conditional-classes',
  className // Allow override
)}
```

**Color Palette (Custom):**
- Primary: Purple (`primary-400` to `primary-900`)
- Secondary: Teal (`secondary-400` to `secondary-900`)
- Success: Green (`success-500`)
- Error: Red (`error-500`)
- Warning: Amber (`warning-500`)
- Neutral: Gray scale (`neutral-100` to `neutral-950`)

### State Management (Zustand)

**Store Pattern:**
- Define state interface and actions
- Use `subscribeWithSelector` for performance
- Implement auto-persistence when needed
- Access store via hooks: `useGameStore()`

**Selectors:**
```typescript
const gameState = useGameStore(state => state.gameState);
const { selectTile, deselectTile } = useGameStore();
```

### Error Handling

**Patterns:**
- Use TypeScript strict mode to catch errors at compile time
- Wrap localStorage access in try-catch
- Validate function inputs with type guards
- Use console.warn for non-critical errors
- Return default values for failed operations

```typescript
export function safeOperation<T>(fn: () => T, defaultValue: T): T {
  try {
    return fn();
  } catch (error) {
    console.warn('Operation failed:', error);
    return defaultValue;
  }
}
```

### File Organization

```
src/
├── app/              # Next.js app router
├── components/       # React components
│   └── ui/          # Reusable UI components
├── lib/             # Utility functions
├── store/           # Zustand stores
└── types/           # TypeScript types
```

### Accessibility

- Include proper ARIA labels
- Support keyboard navigation
- Respect `prefers-reduced-motion`
- Use semantic HTML elements
- Maintain focus management

### Performance

- Use `React.memo()` for expensive renders
- Implement debounce/throttle for events
- Lazy load components when appropriate
- Minimize re-renders with proper selectors
