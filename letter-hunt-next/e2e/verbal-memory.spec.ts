/**
 * Verbal Memory Game E2E Tests
 *
 * Tests for the Verbal Memory game at /memory/verbal
 */

import { test, expect } from '@playwright/test';

test.describe('Verbal Memory Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/memory/verbal');
    await expect(page.getByText('Memoria Verbal - Nivel 1')).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to /memory/verbal and display game', async ({ page }) => {
    await expect(page).toHaveURL(/\/memory\/verbal/);
    await expect(page.getByText('Memoria Verbal - Nivel 1')).toBeVisible();
  });

  test('should display level selector', async ({ page }) => {
    const levelSelector = page.getByRole('button', { name: /Nivel 1/i });
    await expect(levelSelector.first()).toBeVisible();
  });

  test('should display reading phase with instructions and word list', async ({ page }) => {
    await expect(page.getByText('Instrucciones')).toBeVisible();
    const continueButton = page.getByRole('button', { name: /Continuar/i });
    await expect(continueButton).toBeVisible();
  });

  test('should display elapsed time counter', async ({ page }) => {
    const timer = page.locator('.font-mono');
    await expect(timer.first()).toBeVisible();
  });

  test('should transition from reading to recall phase on Continuar', async ({ page }) => {
    const continueButton = page.getByRole('button', { name: /Continuar/i });
    await continueButton.click();

    const validateButton = page.getByRole('button', { name: /Validar Respuestas/i });
    await expect(validateButton).toBeVisible({ timeout: 5000 });
  });

  test('should show input fields in recall phase', async ({ page }) => {
    await page.getByRole('button', { name: /Continuar/i }).click();

    const inputs = page.locator('input[type="text"], input:not([type])');
    await expect(inputs.first()).toBeVisible({ timeout: 5000 });
  });

  test('should show results after validating answers', async ({ page }) => {
    await page.getByRole('button', { name: /Continuar/i }).click();
    await expect(page.getByRole('button', { name: /Validar Respuestas/i })).toBeVisible({ timeout: 5000 });

    await page.getByRole('button', { name: /Validar Respuestas/i }).click();

    const resultText = page.getByText(/Excelente trabajo|Buen intento|Sigue practicando/);
    await expect(resultText.first()).toBeVisible({ timeout: 5000 });
  });

  test('should display result stats: Correctas, Incorrectas, Tiempo, Total', async ({ page }) => {
    await page.getByRole('button', { name: /Continuar/i }).click();
    await page.getByRole('button', { name: /Validar Respuestas/i }).click();

    await expect(page.getByText('Correctas', { exact: true })).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Incorrectas', { exact: true })).toBeVisible();
    await expect(page.getByText('Tiempo', { exact: true })).toBeVisible();
    await expect(page.getByText('Total', { exact: true })).toBeVisible();
  });

  test('should display Jugar de Nuevo button in results', async ({ page }) => {
    await page.getByRole('button', { name: /Continuar/i }).click();
    await page.getByRole('button', { name: /Validar Respuestas/i }).click();

    const playAgainButton = page.getByRole('button', { name: /Jugar de Nuevo/i });
    await expect(playAgainButton).toBeVisible({ timeout: 5000 });
  });

  test('should restart game when clicking Jugar de Nuevo', async ({ page }) => {
    await page.getByRole('button', { name: /Continuar/i }).click();
    await page.getByRole('button', { name: /Validar Respuestas/i }).click();

    const playAgainButton = page.getByRole('button', { name: /Jugar de Nuevo/i });
    await expect(playAgainButton).toBeVisible({ timeout: 5000 });
    await playAgainButton.click();

    await expect(page.getByText('Instrucciones')).toBeVisible({ timeout: 5000 });
  });
});
