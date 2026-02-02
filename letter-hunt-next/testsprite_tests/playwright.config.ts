import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for TestSprite Tests
 * 
 * E2E tests with trace recording enabled for debugging
 * View traces at: https://trace.playwright.dev/
 */
export default defineConfig({
  testDir: '.',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: 'http://localhost:3000',
    // Trace configuration for trace.playwright.dev - record everything
    trace: {
      mode: 'on',
      snapshots: true,
      screenshots: true,
      sources: true,
    },
    screenshot: 'on', // Take screenshots on all tests
    video: 'on', // Record video for all tests
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
  // Output directory for test artifacts (traces, screenshots, videos)
  outputDir: './test-results',
});
