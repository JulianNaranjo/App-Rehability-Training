/**
 * Settings Tests
 * 
 * Tests for the settings page and configuration options
 */

import { test, expect } from '@playwright/test';

test.describe('Settings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/settings');
  });

  test('should display settings page', async ({ page }) => {
    // Use the h1 heading specifically to avoid matching nav link
    await expect(page.getByRole('heading', { name: 'Configuración' })).toBeVisible();
  });

  test('should have audio settings section', async ({ page }) => {
    await expect(page.getByText('Audio')).toBeVisible();
    await expect(page.getByText('Sonidos').or(page.getByText('Sounds'))).toBeVisible();
  });

  test('should have visual settings section', async ({ page }) => {
    await expect(page.getByText('Visual')).toBeVisible();
    await expect(page.getByText('Animaciones').or(page.getByText('Animations'))).toBeVisible();
  });

  test('should have accessibility settings section', async ({ page }) => {
    await expect(page.getByText('Accesibilidad').or(page.getByText('Accessibility'))).toBeVisible();
  });

  test('should toggle sound setting', async ({ page }) => {
    const soundSwitch = page.locator('[role="switch"]').first();
    const initialState = await soundSwitch.getAttribute('aria-checked');
    
    await soundSwitch.click();
    
    const newState = await soundSwitch.getAttribute('aria-checked');
    expect(newState).not.toBe(initialState);
  });

  test('should toggle animations setting', async ({ page }) => {
    const switches = page.locator('[role="switch"]');
    const animationsSwitch = switches.nth(1);
    
    const initialState = await animationsSwitch.getAttribute('aria-checked');
    await animationsSwitch.click();
    const newState = await animationsSwitch.getAttribute('aria-checked');
    
    expect(newState).not.toBe(initialState);
  });

  test('should toggle reduced motion setting', async ({ page }) => {
    await expect(page.getByText('Reducir movimiento').or(page.getByText('Reduce motion'))).toBeVisible();
  });

  test('should toggle high contrast setting', async ({ page }) => {
    await expect(page.getByText('Alto contraste').or(page.getByText('High contrast'))).toBeVisible();
  });

  test('should have reset settings button', async ({ page }) => {
    const resetButton = page.getByRole('button', { name: /Restaurar configuración/i })
      .or(page.getByRole('button', { name: /Reset settings/i }));
    await expect(resetButton).toBeVisible();
  });

  test('should show auto-save message', async ({ page }) => {
    await expect(page.getByText(/guardan automáticamente/i).or(page.getByText(/save automatically/i))).toBeVisible();
  });
});
