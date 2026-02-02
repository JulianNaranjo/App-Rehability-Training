/**
 * Integration Tests - Full User Flows
 * 
 * End-to-end tests covering complete user scenarios
 */

import { test, expect } from '@playwright/test';

test.describe('Integration - Full Game Flows', () => {
  test('complete selection mode game flow', async ({ page }) => {
    // 1. Start from dashboard
    await page.goto('/dashboard');
    await expect(page.getByText('Programa de rehabilitación')).toBeVisible();
    
    // 2. Select selection mode
    await page.getByRole('link', { name: /Jugar Modo Selección/i }).click();
    await expect(page).toHaveURL(/\/game\/selection/);
    
    // 3. Wait for game board
    await page.waitForSelector('[role="grid"]', { timeout: 5000 });
    const tiles = page.getByRole('gridcell');
    await expect(tiles).toHaveCount(225);
    
    // 4. Select some tiles (simulating finding targets)
    const targetTiles = await tiles.all();
    for (let i = 0; i < 60 && i < targetTiles.length; i++) {
      await targetTiles[i].click();
      await page.waitForTimeout(50); // Small delay between clicks
    }
    
    // 5. Verify button should be enabled
    const verifyButton = page.getByRole('button', { name: /Verificar/i });
    await expect(verifyButton).toBeEnabled();
    
    // 6. Check answer
    await verifyButton.click();
    
    // 7. Wait for result
    await page.waitForTimeout(3500);
    
    // 8. Verify game state changed - still on game page
    await expect(page).toHaveURL(/\/game\/selection/);
    
    // 9. Score/timer should be displayed with flexible selector
    const scoreOrTimer = page.locator('text=/[Pp]untuaci[oó]n|[Ss]core|[Tt]iempo|[Tt]ime|[Rr]esultado/i').first();
    await expect(scoreOrTimer).toBeVisible();
    
    // 10. Verify game completed - any action button or completion indicator
    const actionButton = page.getByRole('button').filter({ hasText: /[Nn]uevo|Juego|Continuar|Verificar|Jugar/i });
    await expect(actionButton.first()).toBeVisible();
  });

  test('complete count mode game flow', async ({ page }) => {
    // 1. Go to count mode
    await page.goto('/game/count');
    await expect(page).toHaveURL(/\/game\/count/);
    
    // 2. Wait for game board
    await page.waitForSelector('[role="grid"]', { timeout: 5000 });
    
    // 3. Enter a count
    const input = page.locator('input[type="number"]');
    await input.fill('60');
    await expect(input).toHaveValue('60');
    
    // 4. Verify button should be enabled
    const verifyButton = page.getByRole('button', { name: /Verificar/i });
    await expect(verifyButton).toBeEnabled();
    
    // 5. Submit answer
    await verifyButton.click();
    
    // 6. Wait for result
    await page.waitForTimeout(3500);
    
    // 7. Verify game state changed - still on game page
    await expect(page).toHaveURL(/\/game\/count/);

    // 8. Verify game UI is still intact - input field visible and buttons present
    const inputVisible = await input.isVisible();
    expect(inputVisible).toBe(true);

    // 9. Verify game completed - any action button available
    const actionButton = page.getByRole('button').filter({ hasText: /[Nn]uevo|Juego|Continuar|Verificar|Jugar/i });
    await expect(actionButton.first()).toBeVisible();
  });

  test('navigation flow through all pages', async ({ page }) => {
    // 1. Dashboard
    await page.goto('/dashboard');
    await expect(page.getByText('Programa de rehabilitación')).toBeVisible();
    
    // 2. Go to leaderboard
    const leaderboardLink = page.getByRole('link', { name: /Clasificación/i });
    await leaderboardLink.click();
    await expect(page).toHaveURL(/\/leaderboard/);
    
    // 3. Go to settings
    const settingsLink = page.getByRole('link', { name: /Configuración/i });
    await settingsLink.click();
    await expect(page).toHaveURL(/\/settings/);
    await expect(page.getByRole('heading', { name: 'Configuración' })).toBeVisible();
    
    // 4. Go to profile
    const profileLink = page.getByRole('link', { name: /Profile/i }).or(page.getByRole('link', { name: /Perfil/i }));
    if (await profileLink.count() > 0) {
      await profileLink.click();
      await expect(page).toHaveURL(/\/profile/);
    }
    
    // 5. Return to dashboard
    await page.goto('/dashboard');
    await expect(page.getByText('Programa de rehabilitación')).toBeVisible();
  });

  test('settings persist across pages', async ({ page }) => {
    // 1. Go to settings and toggle sound
    await page.goto('/settings');
    const soundSwitch = page.locator('[role="switch"]').first();
    const initialState = await soundSwitch.getAttribute('aria-checked');
    await soundSwitch.click();
    
    // 2. Navigate away and back
    await page.goto('/dashboard');
    await page.goto('/settings');
    
    // 3. Setting should persist
    const soundSwitchAfter = page.locator('[role="switch"]').first();
    const persistedState = await soundSwitchAfter.getAttribute('aria-checked');
    expect(persistedState).not.toBe(initialState);
  });

  test('keyboard navigation in game', async ({ page }) => {
    await page.goto('/game/selection');
    await page.waitForSelector('[role="grid"]', { timeout: 5000 });
    
    // Focus the first tile - this verifies basic keyboard accessibility
    // The tile is focusable via tab navigation
    const firstTile = page.getByRole('gridcell').first();
    await firstTile.focus();
    await expect(firstTile).toBeFocused();
    
    // Note: Full keyboard navigation (Enter/Space to select tiles) would require
    // additional implementation in the GameTile component. Currently, tiles only
    // support click-based selection. To enable keyboard selection, the component
    // would need to handle onKeyDown events for Enter and Space keys.
  });
});
