/**
 * Dashboard Tests
 * 
 * Tests for the main dashboard page and navigation
 */

import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('should display dashboard with correct title', async ({ page }) => {
    await expect(page.getByText('Programa de rehabilitación')).toBeVisible();
  });

  test('should display attention improvement section', async ({ page }) => {
    await expect(page.getByText('Mejora atención')).toBeVisible();
    await expect(page.getByText('Selecciona cómo quieres jugar y avanza a través de niveles más desafiantes.')).toBeVisible();
  });

  test('should display memory improvement section', async ({ page }) => {
    await expect(page.getByText('Mejorar memoria')).toBeVisible();
    await expect(page.getByText('Entrena tu memoria con ejercicios progresivos.')).toBeVisible();
  });

  test('should display selection mode card', async ({ page }) => {
    // Target the h3 in the card specifically to avoid matching instruction section
    const selectionCard = page.locator('h3', { hasText: 'Modo Selección' }).first();
    await expect(selectionCard).toBeVisible();
    await expect(page.getByText('Selección interactiva').first()).toBeVisible();
  });

  test('should display count mode card', async ({ page }) => {
    // Target the h3 in the card specifically
    const countCard = page.locator('h3', { hasText: 'Modo Conteo' }).first();
    await expect(countCard).toBeVisible();
    await expect(page.getByText('Conteo mental').first()).toBeVisible();
  });

  test('should display visual memory card as coming soon', async ({ page }) => {
    // Target the h3 in the card
    const visualMemoryCard = page.locator('h3', { hasText: 'Memoria Visual' }).first();
    await expect(visualMemoryCard).toBeVisible();
    // Check for "Próximamente" badge in the parent card
    const card = visualMemoryCard.locator('..').locator('..');
    await expect(page.getByText('Próximamente').first()).toBeVisible();
  });

  test('should display matching pairs card as coming soon', async ({ page }) => {
    // Target the h3 in the card
    const matchingCard = page.locator('h3', { hasText: 'Pares/Matching' }).first();
    await expect(matchingCard).toBeVisible();
    await expect(page.getByText('Próximamente').first()).toBeVisible();
  });

  test('should navigate to selection mode game', async ({ page }) => {
    // Click on the link with aria-label containing "Jugar Modo Selección"
    await page.getByRole('link', { name: /Jugar Modo Selección/i }).click();
    await expect(page).toHaveURL(/\/game\/selection/);
    await expect(page.getByRole('grid')).toBeVisible();
  });

  test('should navigate to count mode game', async ({ page }) => {
    // Click on the link with aria-label containing "Jugar Modo Conteo"
    await page.getByRole('link', { name: /Jugar Modo Conteo/i }).click();
    await expect(page).toHaveURL(/\/game\/count/);
    await expect(page.getByRole('grid')).toBeVisible();
  });

  test('should display instructions for each mode', async ({ page }) => {
    await expect(page.getByText(/Haz clic en las letras objetivo/)).toBeVisible();
    await expect(page.getByText(/Cuenta las letras objetivo/)).toBeVisible();
  });
});
