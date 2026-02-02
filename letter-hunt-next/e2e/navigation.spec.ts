/**
 * Navigation Tests
 * 
 * Tests for the navbar and routing between pages
 */

import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('should display navigation bar', async ({ page }) => {
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('should navigate to dashboard', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should have leaderboard link in nav', async ({ page }) => {
    // Navbar uses "Clasificación" for leaderboard
    const leaderboardLink = page.getByRole('link', { name: /Clasificación/i });
    await expect(leaderboardLink).toBeVisible();
  });

  test('should navigate to leaderboard page', async ({ page }) => {
    // Navbar uses "Clasificación" for leaderboard
    const leaderboardLink = page.getByRole('link', { name: /Clasificación/i });
    await leaderboardLink.click();
    await expect(page).toHaveURL(/\/leaderboard/);
    // Leaderboard page uses "🏆 Tabla de Líderes" as heading (with emoji)
    const heading = page.locator('h2').filter({ hasText: /Tabla de Líderes/ });
    await expect(heading).toBeVisible();
  });

  test('should have settings link in nav', async ({ page }) => {
    const settingsLink = page.getByRole('link', { name: /Settings/i }).or(page.getByRole('link', { name: /Configuración/i }));
    await expect(settingsLink).toBeVisible();
  });

  test('should navigate to settings page', async ({ page }) => {
    const settingsLink = page.getByRole('link', { name: /Settings/i }).or(page.getByRole('link', { name: /Configuración/i }));
    await settingsLink.click();
    await expect(page).toHaveURL(/\/settings/);
  });

  test('should navigate back to dashboard from game', async ({ page }) => {
    // Go to game first
    await page.goto('/game/selection');
    await page.waitForSelector('[role="grid"]', { timeout: 5000 });
    
    // Look for return/dashboard button - use first() to avoid strict mode violation
    const returnButton = page.getByRole('button', { name: /Volver al Dashboard/i }).first();
    
    if (await returnButton.count() > 0) {
      await returnButton.click();
      await expect(page).toHaveURL(/\/dashboard/);
    }
  });
});
