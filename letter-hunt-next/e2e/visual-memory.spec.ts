/**
 * Visual Memory Game E2E Tests
 *
 * Tests for the Visual Memory game at /memory/visual
 */

import { test, expect } from '@playwright/test';

test.describe('Visual Memory Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/memory/visual');
    await expect(page.getByText('Memoria Visual - Nivel 1')).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to /memory/visual and display game', async ({ page }) => {
    await expect(page).toHaveURL(/\/memory\/visual/);
    await expect(page.getByText('Memoria Visual - Nivel 1')).toBeVisible();
  });

  test('should display memorize phase with instructions and shapes', async ({ page }) => {
    await expect(page.getByText('Instrucciones')).toBeVisible();
    const continueButton = page.getByRole('button', { name: /Continuar/i });
    await expect(continueButton).toBeVisible();
  });

  test('should display elapsed time counter', async ({ page }) => {
    const timer = page.locator('.font-mono');
    await expect(timer.first()).toBeVisible();
  });

  test('should transition from memorize to recall phase on Continuar', async ({ page }) => {
    await page.getByRole('button', { name: /Continuar/i }).click();

    await expect(page.getByText('Ahora dibuja')).toBeVisible({ timeout: 5000 });
  });

  test('should display drawing board and action buttons in recall phase', async ({ page }) => {
    await page.getByRole('button', { name: /Continuar/i }).click();

    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 5000 });

    const clearButton = page.getByRole('button', { name: /Limpiar/i });
    await expect(clearButton).toBeVisible();

    const finishButton = page.getByRole('button', { name: /Ya terminé/i });
    await expect(finishButton).toBeVisible();
  });

  test('should enable Ya terminé button only after drawing on canvas', async ({ page }) => {
    await page.getByRole('button', { name: /Continuar/i }).click();

    const finishButton = page.getByRole('button', { name: /Ya terminé/i });
    await expect(finishButton).toBeDisabled({ timeout: 5000 });

    const canvas = page.locator('canvas');
    const box = await canvas.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width * 0.3, box.y + box.height * 0.3);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width * 0.7, box.y + box.height * 0.7);
      await page.mouse.up();
    }

    await expect(finishButton).toBeEnabled({ timeout: 3000 });
  });

  test('should transition to results phase after finishing drawing', async ({ page }) => {
    await page.getByRole('button', { name: /Continuar/i }).click();

    const canvas = page.locator('canvas');
    const box = await canvas.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width * 0.3, box.y + box.height * 0.3);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width * 0.7, box.y + box.height * 0.7);
      await page.mouse.up();
    }

    await page.getByRole('button', { name: /Ya terminé/i }).click();

    await expect(page.getByText('Resultados')).toBeVisible({ timeout: 5000 });
  });

  test('should display shape selector and stats in results', async ({ page }) => {
    await page.getByRole('button', { name: /Continuar/i }).click();

    const canvas = page.locator('canvas');
    const box = await canvas.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width * 0.3, box.y + box.height * 0.3);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width * 0.7, box.y + box.height * 0.7);
      await page.mouse.up();
    }

    await page.getByRole('button', { name: /Ya terminé/i }).click();

    await expect(page.getByText('Aciertos')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Promedio')).toBeVisible();
  });

  test('should display Jugar de Nuevo button in results', async ({ page }) => {
    await page.getByRole('button', { name: /Continuar/i }).click();

    const canvas = page.locator('canvas');
    const box = await canvas.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width * 0.3, box.y + box.height * 0.3);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width * 0.7, box.y + box.height * 0.7);
      await page.mouse.up();
    }

    await page.getByRole('button', { name: /Ya terminé/i }).click();

    const playAgainButton = page.getByRole('button', { name: /Jugar de Nuevo/i });
    await expect(playAgainButton).toBeVisible({ timeout: 5000 });
  });
});
