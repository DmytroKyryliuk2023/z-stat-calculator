import { test, expect } from '@playwright/test';

test.describe('Critical User Path', () => {
  test('повний робочий процес: відкриття, введення, розрахунок', async ({ page }) => {
    // Крок 1: Відкриваємо сторінку
    await page.goto('/');
    
    // Крок 2: Перевіряємо, що сторінка завантажилась
    await expect(page).toHaveTitle(/zstat-calculator/);
    
    // Крок 3: Вводимо Z-score
    await page.locator('[data-testid="zscore-input"]').waitFor({ timeout: 5000 });
    await page.locator('[data-testid="zscore-input"]').click();
    await page.locator('[data-testid="zscore-input"]').fill('2.5');
    
    // Крок 4: Натискаємо Calculate
    await page.locator('[data-testid="calculate-button"]').click();
    
    // Крок 5: Перевіряємо результати
    await expect(page.locator('[data-testid="results-container"]')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('[data-testid="one-tailed-result"]')).toBeVisible();
    
    // Крок 6: Робимо скріншот для документації
    await page.screenshot({ path: 'test-results/calculator-result.png' });
  });
});