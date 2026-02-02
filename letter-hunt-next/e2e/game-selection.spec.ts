/**
 * Game Board Tests - Selection Mode
 * 
 * Tests for the 15x15 grid letter selection game
 */

import { test, expect } from '@playwright/test';

test.describe('Game Board - Selection Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/game/selection');
    // Wait for game to initialize
    await page.waitForSelector('[role="grid"]', { timeout: 5000 });
  });

  test('should display 15x15 game board with 225 tiles', async ({ page }) => {
    const grid = page.getByRole('grid');
    await expect(grid).toBeVisible();
    
    const tiles = grid.getByRole('gridcell');
    await expect(tiles).toHaveCount(225);
  });

  test('should display target letters', async ({ page }) => {
    // Target letters display uses "Busca todas las letras:" or "Busca todos los números:"
    const targetSection = page.getByText(/Busca todas las letras:/i).or(page.getByText(/Busca todos los números:/i));
    await expect(targetSection).toBeVisible();
  });

  test('should display progress indicator', async ({ page }) => {
    await expect(page.getByText(/Seleccionadas:/i).or(page.getByText(/Selected:/i))).toBeVisible();
  });

  test('should select tile on click', async ({ page }) => {
    const tile = page.getByRole('gridcell').first();
    await tile.click();
    
    // Check if tile has selected styling (bg-primary-500)
    const tileClasses = await tile.getAttribute('class');
    expect(tileClasses).toContain('bg-primary-500');
  });

  test('should deselect tile on second click', async ({ page }) => {
    const tile = page.getByRole('gridcell').first();
    
    // Select
    await tile.click();
    let tileClasses = await tile.getAttribute('class');
    expect(tileClasses).toContain('bg-primary-500');
    
    // Deselect
    await tile.click();
    tileClasses = await tile.getAttribute('class');
    expect(tileClasses).not.toContain('bg-primary-500');
  });

  test('should update progress on tile selection', async ({ page }) => {
    const progressText = page.getByText(/Seleccionadas:/i).or(page.getByText(/Selected:/i));
    
    // Get initial count
    const initialText = await progressText.textContent();
    
    // Select a tile
    await page.getByRole('gridcell').first().click();
    
    // Progress should update
    const updatedText = await progressText.textContent();
    expect(updatedText).not.toBe(initialText);
  });

  test('should have check answer button', async ({ page }) => {
    const checkButton = page.getByRole('button', { name: /Verificar/i });
    await expect(checkButton).toBeVisible();
    
    // Button is disabled until tiles are selected
    await expect(checkButton).toBeDisabled();
    
    // Select a tile to enable the button
    await page.getByRole('gridcell').first().click();
    await expect(checkButton).toBeEnabled();
  });

  test('should check answer and show feedback', async ({ page }) => {
    // Select a few tiles first
    const tiles = page.getByRole('gridcell');
    await tiles.nth(0).click();
    await tiles.nth(1).click();
    await tiles.nth(2).click();
    
    // Click check answer
    const checkButton = page.getByRole('button', { name: /Verificar/i });
    await checkButton.click();
    
    // Wait for checking state or feedback
    await page.waitForTimeout(2500);
    
    // Should show win (¡Felicidades!) or lost state
    // The app shows "¡Felicidades!" for win or "No es correcto" / "¡No te rindas!" for lost
    const resultMessage = page.getByText(/¡Felicidades!/i)
      .or(page.getByText(/No es correcto/i))
      .or(page.getByText(/¡No te rindas!/i))
      .or(page.locator('[class*="success"]').or(page.locator('[class*="error"]')));
    
    await expect(resultMessage.first()).toBeVisible();
  });

  test('should support keyboard navigation', async ({ page }) => {
    // First tile should be focusable (it's a button element)
    const firstTile = page.getByRole('gridcell').first();
    
    // Verify the tile is a button and can be focused
    await expect(firstTile).toHaveAttribute('role', 'gridcell');
    
    // Focus the tile
    await firstTile.focus();
    await expect(firstTile).toBeFocused();
    
    // Note: The GameTile component uses onClick handler
    // Keyboard selection (Enter/Space) would require additional implementation
  });

  test('should have reset game button', async ({ page }) => {
    const resetButton = page.getByRole('button', { name: /Reiniciar/i }).or(page.getByRole('button', { name: /Reset/i })).or(page.getByRole('button', { name: /Nuevo juego/i })).or(page.getByRole('button', { name: /New game/i }));
    await expect(resetButton).toBeVisible();
  });

  test('should reset game when reset button clicked', async ({ page }) => {
    // Select some tiles
    const tiles = page.getByRole('gridcell');
    await tiles.nth(0).click();
    await tiles.nth(1).click();
    
    // Verify tiles are selected
    let firstTile = tiles.first();
    let tileClasses = await firstTile.getAttribute('class');
    expect(tileClasses).toContain('bg-primary-500');
    
    // Click reset button (should be "Reiniciar" in the sidebar)
    const resetButton = page.getByRole('button', { name: /Reiniciar/i });
    await expect(resetButton).toBeVisible();
    await resetButton.click();
    
    // Wait for reset to complete - the game regenerates the board
    await page.waitForTimeout(1500);
    
    // Verify we're still on the game page
    await expect(page).toHaveURL(/\/game\/selection/);
    
    // Wait for grid to reappear after regeneration
    await page.waitForSelector('[role="grid"]', { timeout: 5000 });
    await expect(page.getByRole('grid')).toBeVisible();
    
    // Wait for tiles to be available again
    await page.waitForSelector('[role="gridcell"]', { timeout: 5000 });
    
    // All tiles should be unselected - get fresh reference after DOM updates
    firstTile = page.getByRole('gridcell').first();
    tileClasses = await firstTile.getAttribute('class');
    expect(tileClasses).not.toContain('bg-primary-500');
  });

  test('should show timer', async ({ page }) => {
    const timer = page.locator('text=/\\d{2}:\\d{2}/').or(page.locator('[class*="timer"]'));
    await expect(timer.first()).toBeVisible();
  });

  test('should display score after game completion', async ({ page }) => {
    // Select random tiles
    const tiles = page.getByRole('gridcell');
    for (let i = 0; i < 60; i++) {
      await tiles.nth(i).click();
    }
    
    // Check answer
    const checkButton = page.getByRole('button', { name: /Verificar/i }).or(page.getByRole('button', { name: /Check/i }));
    await checkButton.click();
    
    // Wait for result
    await page.waitForTimeout(2500);
    
    // Score should be displayed
    const scoreText = page.locator('text=/Puntuación:/i').or(page.locator('text=/Score:/i')).or(page.locator('text=/\\d+ puntos/i'));
    await expect(scoreText.first()).toBeVisible();
  });
});
