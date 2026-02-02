# E2E Testing Guide for Letter Hunt

This project uses Playwright for end-to-end testing.

## Test Structure

```
e2e/
├── dashboard.spec.ts       # Dashboard page tests
├── game-selection.spec.ts  # Selection mode game tests
├── game-count.spec.ts      # Count mode game tests
├── leaderboard.spec.ts     # Leaderboard page tests
├── navigation.spec.ts      # Navigation and routing tests
├── settings.spec.ts        # Settings page tests
└── integration.spec.ts     # Full user flow integration tests
```

## Running Tests

### Run all tests
```bash
npm run test:e2e
```

### Run specific test file
```bash
npx playwright test e2e/dashboard.spec.ts
```

### Run tests in headed mode (see browser)
```bash
npx playwright test --headed
```

### Run tests with UI mode
```bash
npx playwright test --ui
```

### Debug tests
```bash
npx playwright test --debug
```

## Test Coverage

### Dashboard Tests
- Title and section visibility
- Game mode card display
- Navigation to game modes
- Instruction display

### Game Board Tests (Selection Mode)
- 15x15 grid with 225 tiles
- Tile selection/deselection
- Progress tracking
- Answer verification
- Keyboard navigation
- Game reset
- Timer and score display

### Game Board Tests (Count Mode)
- Input field for count
- Answer verification
- Feedback display
- New game functionality

### Leaderboard Tests
- Page display
- Empty state handling
- Score display structure

### Settings Tests
- All settings sections visible
- Toggle switches work
- Settings persistence
- Reset functionality

### Navigation Tests
- Navbar visibility
- All routes accessible
- Dashboard redirect from root

### Integration Tests
- Complete game flows
- Cross-page navigation
- Settings persistence
- Keyboard accessibility

## Configuration

Tests are configured in `playwright.config.ts`:
- Base URL: `http://localhost:3000`
- Browser: Chromium
- Test directory: `./e2e`
- Auto-starts dev server

## Adding New Tests

1. Create a new `.spec.ts` file in the `e2e/` directory
2. Import `{ test, expect } from '@playwright/test'`
3. Use `test.describe()` for grouping
4. Use `test.beforeEach()` for setup
5. Use page locators with accessibility selectors when possible

## Best Practices

- Use `getByRole()` for interactive elements
- Use `getByText()` for text content
- Add `data-testid` attributes for complex selectors
- Use `await page.waitForSelector()` for dynamic content
- Keep tests independent and isolated
- Use descriptive test names

## Troubleshooting

If tests fail:
1. Run with `--headed` to see what's happening
2. Use `--debug` to step through
3. Check the HTML report: `npx playwright show-report`
4. Verify the dev server is running on port 3000
