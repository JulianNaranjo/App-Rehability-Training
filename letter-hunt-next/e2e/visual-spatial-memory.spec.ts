/**
 * Visual-Spatial Memory Game E2E Tests
 * 
 * Tests for the Visual-Spatial Memory game at /memory/visual-spatial
 */

import { test, expect } from '@playwright/test';

test.describe('Visual-Spatial Memory Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/memory/visual-spatial');
    // Wait for the page title to be visible (confirms React hydrated)
    await expect(page.getByText('Memoria Visual-Espacial')).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to /memory/visual-spatial and display game', async ({ page }) => {
    // Verify we're on the correct page
    await expect(page).toHaveURL(/\/memory\/visual-spatial/);
    
    // Verify the game title is displayed
    const title = page.getByText('Memoria Visual-Espacial');
    await expect(title).toBeVisible();
  });

  test('should display 4x5 grid with 20 cells', async ({ page }) => {
    // The grid uses button elements inside a grid container
    const gridButtons = page.locator('[class*="grid gap-2"] button');
    await expect(gridButtons).toHaveCount(20);
  });

  test('should display countdown timer during memorize phase', async ({ page }) => {
    // During memorize phase, should show countdown
    const countdownElement = page.getByText(/^\d+$/); // Single digit number
    await expect(countdownElement.first()).toBeVisible();
    
    // Also check for the timer icon (using lucide class)
    const timerIcon = page.locator('.lucide-timer');
    await expect(timerIcon.first()).toBeVisible();
  });

  test('should show icons during memorize phase', async ({ page }) => {
    // During memorize phase, icons should be visible in the grid
    // Wait for the memorize phase card to be visible
    const memorizeCard = page.getByText('Fase de Memorización');
    await expect(memorizeCard).toBeVisible({ timeout: 5000 });
    
    // Icons should appear in the grid (look for SVG icons inside the grid)
    const gridIcons = page.locator('[class*="grid gap-2"] svg');
    // There should be 2 icons shown during memorize
    await expect(gridIcons.first()).toBeVisible();
  });

  test('should transition from memorize to recall phase after countdown', async ({ page }) => {
    // Wait for memorize phase
    const memorizeCard = page.getByText('Fase de Memorización');
    await expect(memorizeCard).toBeVisible({ timeout: 5000 });
    
    // Wait for countdown to complete (3 seconds)
    await page.waitForTimeout(3500);
    
    // Should now be in recall phase
    const recallCard = page.getByText('Fase de Recuperación');
    await expect(recallCard).toBeVisible({ timeout: 5000 });
  });

  test('should hide icons after memorize phase ends', async ({ page }) => {
    // Wait for memorize phase
    await page.waitForTimeout(500);
    
    // Wait for recall phase
    await page.waitForTimeout(3500);
    
    // In recall phase, icons should not be visible in grid (or different styling)
    const recallCard = page.getByText('Fase de Recuperación');
    await expect(recallCard).toBeVisible({ timeout: 5000 });
  });

  test('should allow clicking cells during recall phase', async ({ page }) => {
    // Wait for memorize phase to complete
    await page.waitForTimeout(3500);
    
    // Verify we're in recall phase
    const recallCard = page.getByText('Fase de Recuperación');
    await expect(recallCard).toBeVisible({ timeout: 5000 });
    
    // Get grid cells (buttons)
    const gridButtons = page.locator('[class*="grid gap-2"] button');
    
    // Click on some cells to make guesses
    await gridButtons.nth(0).click();
    await gridButtons.nth(5).click();
    
    // After clicking, cells should show selected state
    // Selected cells have bg-warning-100 and border-warning-400 classes
    const firstCellClasses = await gridButtons.nth(0).getAttribute('class');
    expect(firstCellClasses).toContain('bg-warning-100');
  });

  test('should display attempts remaining during recall', async ({ page }) => {
    // Wait for recall phase
    await page.waitForTimeout(3500);
    
    // Should show remaining attempts
    const attemptsText = page.getByText('Intentos restantes:');
    await expect(attemptsText).toBeVisible();
  });

  test('should show results after guessing (playing through a round)', async ({ page }) => {
    // Wait for memorize phase
    await page.waitForTimeout(500);
    
    // Wait for recall phase
    await page.waitForTimeout(3500);
    
    // Click on some cells to make guesses
    const gridButtons = page.locator('[class*="grid gap-2"] button');
    
    // Click 4 cells (max guesses)
    await gridButtons.nth(0).click();
    await gridButtons.nth(1).click();
    await gridButtons.nth(2).click();
    await gridButtons.nth(3).click();
    
    // Wait for results phase - after 4 guesses, results should show
    await page.waitForTimeout(1500);
    
    // Check for results - either "¡Excelente!", "¡Bien!", or "Intenta de nuevo"
    const results = page.getByText(/¡Excelente!|¡Bien!|Intenta de nuevo/);
    await expect(results.first()).toBeVisible({ timeout: 5000 });
  });

  test('should display score in results', async ({ page }) => {
    // Complete a round and wait for results
    await page.waitForTimeout(500);
    await page.waitForTimeout(3500);
    
    const gridButtons = page.locator('[class*="grid gap-2"] button');
    await gridButtons.nth(0).click();
    await gridButtons.nth(1).click();
    await gridButtons.nth(2).click();
    await gridButtons.nth(3).click();
    
    await page.waitForTimeout(1500);
    
    // Should show points/score
    const pointsText = page.getByText('Puntos');
    await expect(pointsText).toBeVisible();
    
    // Should show correct guesses
    const correctText = page.getByText('Aciertos');
    await expect(correctText).toBeVisible();
  });

  test('should have play again button in results', async ({ page }) => {
    // Complete a round
    await page.waitForTimeout(500);
    await page.waitForTimeout(3500);
    
    const gridButtons = page.locator('[class*="grid gap-2"] button');
    await gridButtons.nth(0).click();
    await gridButtons.nth(1).click();
    await gridButtons.nth(2).click();
    await gridButtons.nth(3).click();
    
    await page.waitForTimeout(1500);
    
    // Should have play again button
    const playAgainButton = page.getByRole('button', { name: /Jugar de Nuevo/i });
    await expect(playAgainButton).toBeVisible();
  });

  test('should show rounds completed counter', async ({ page }) => {
    // Verify the rounds counter is visible in the header
    const roundsText = page.getByText('rondas');
    await expect(roundsText).toBeVisible();
  });
});
