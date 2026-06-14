/**
 * Visual-Verbal Memory Game E2E Tests
 *
 * Tests for the Visual-Verbal (Viso-Verbal) Memory game at /memory/visual-verbal
 */

import { test, expect } from '@playwright/test';

test.describe('Visual-Verbal Memory Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/memory/visual-verbal');
    await expect(page.getByText('Memoria Viso-Verbal')).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to /memory/visual-verbal and display game', async ({ page }) => {
    await expect(page).toHaveURL(/\/memory\/visual-verbal/);
    await expect(page.getByText('Memoria Viso-Verbal')).toBeVisible();
    await expect(page.getByText('Relaciona imágenes con nombres')).toBeVisible();
  });

  test('should display memorize phase with instructions and image grid', async ({ page }) => {
    await expect(page.getByText('Instrucciones')).toBeVisible();
    const continueButton = page.getByRole('button', { name: /Continuar/i });
    await expect(continueButton).toBeVisible();
  });

  test('should display elapsed time counter', async ({ page }) => {
    const timer = page.locator('.font-mono');
    await expect(timer.first()).toBeVisible();
  });

  test('should display image items in memorize phase', async ({ page }) => {
    const images = page.locator('img[alt]');
    await expect(images.first()).toBeVisible();
  });

  test('should transition from memorize to recall phase on Continuar', async ({ page }) => {
    await page.getByRole('button', { name: /Continuar/i }).click();

    await expect(page.getByText('Escribe los nombres')).toBeVisible({ timeout: 5000 });
  });

  test('should display name inputs in recall phase', async ({ page }) => {
    await page.getByRole('button', { name: /Continuar/i }).click();

    const inputs = page.locator('input[type="text"]');
    await expect(inputs.first()).toBeVisible({ timeout: 5000 });
    const count = await inputs.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should have Verificar Respuestas button disabled until all inputs filled', async ({ page }) => {
    await page.getByRole('button', { name: /Continuar/i }).click();

    const submitButton = page.getByRole('button', { name: /Verificar Respuestas/i });
    await expect(submitButton).toBeVisible({ timeout: 5000 });
    await expect(submitButton).toBeDisabled();
  });

  test('should enable Verificar Respuestas when all inputs are filled', async ({ page }) => {
    await page.getByRole('button', { name: /Continuar/i }).click();

    const inputs = page.locator('input[type="text"]');
    await expect(inputs.first()).toBeVisible({ timeout: 5000 });
    const count = await inputs.count();

    for (let i = 0; i < count; i++) {
      await inputs.nth(i).fill(`nombre${i + 1}`);
    }

    const submitButton = page.getByRole('button', { name: /Verificar Respuestas/i });
    await expect(submitButton).toBeEnabled();
  });

  test('should transition to results phase after submitting answers', async ({ page }) => {
    await page.getByRole('button', { name: /Continuar/i }).click();

    const inputs = page.locator('input[type="text"]');
    await expect(inputs.first()).toBeVisible({ timeout: 5000 });
    const count = await inputs.count();

    for (let i = 0; i < count; i++) {
      await inputs.nth(i).fill(`nombre${i + 1}`);
    }

    await page.getByRole('button', { name: /Verificar Respuestas/i }).click();

    await expect(page.getByText('Resultados')).toBeVisible({ timeout: 5000 });
  });

  test('should display score and stats in results', async ({ page }) => {
    await page.getByRole('button', { name: /Continuar/i }).click();

    const inputs = page.locator('input[type="text"]');
    await expect(inputs.first()).toBeVisible({ timeout: 5000 });
    const count = await inputs.count();

    for (let i = 0; i < count; i++) {
      await inputs.nth(i).fill(`nombre${i + 1}`);
    }

    await page.getByRole('button', { name: /Verificar Respuestas/i }).click();

    await expect(page.getByText('Resultados')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Mejor puntuación')).toBeVisible();
    await expect(page.getByText('Promedio')).toBeVisible();
  });

  test('should display Jugar de Nuevo button in results', async ({ page }) => {
    await page.getByRole('button', { name: /Continuar/i }).click();

    const inputs = page.locator('input[type="text"]');
    await expect(inputs.first()).toBeVisible({ timeout: 5000 });
    const count = await inputs.count();

    for (let i = 0; i < count; i++) {
      await inputs.nth(i).fill(`nombre${i + 1}`);
    }

    await page.getByRole('button', { name: /Verificar Respuestas/i }).click();

    const playAgainButton = page.getByRole('button', { name: /Jugar de Nuevo/i });
    await expect(playAgainButton).toBeVisible({ timeout: 5000 });
  });

  test('should restart game when clicking Jugar de Nuevo', async ({ page }) => {
    await page.getByRole('button', { name: /Continuar/i }).click();

    const inputs = page.locator('input[type="text"]');
    await expect(inputs.first()).toBeVisible({ timeout: 5000 });
    const count = await inputs.count();

    for (let i = 0; i < count; i++) {
      await inputs.nth(i).fill(`nombre${i + 1}`);
    }

    await page.getByRole('button', { name: /Verificar Respuestas/i }).click();
    await page.getByRole('button', { name: /Jugar de Nuevo/i }).click();

    await expect(page.getByText('Instrucciones')).toBeVisible({ timeout: 5000 });
  });
});
