import { test, expect } from '@playwright/test';

test.describe('Z-Statistic Calculator E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Чекаємо завантаження компонента
    await page.waitForSelector('[data-testid="zscore-input"]', { timeout: 5000 });
  });

  test('відображає головну сторінку з калькулятором', async ({ page }) => {
    await expect(page.locator('h1')).toContainText(/Z-Statistic Calculator/i);
    await expect(page.locator('h2')).toContainText(/Z-Score P-Value Calculator/i);
    await expect(page.locator('[data-testid="zscore-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="calculate-button"]')).toBeVisible();
  });

  test('користувач може ввести Z-score та отримати результати', async ({ page }) => {
    await page.locator('[data-testid="zscore-input"]').fill('1.96');
    await page.locator('[data-testid="calculate-button"]').click();
    
    // Чекаємо появи результатів
    await expect(page.locator('[data-testid="results-container"]')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('[data-testid="one-tailed-result"]')).toBeVisible();
    await expect(page.locator('[data-testid="two-tailed-result"]')).toBeVisible();
  });

  test('інтерфейс реагує на різні Z-значення', async ({ page }) => {
    const testCases = [
      { 
        input: '1.96', 
        expectedOneTailed: 0.025,
        tolerance: 0.001
      },
      { 
        input: '2.58', 
        expectedOneTailed: 0.005,
        tolerance: 0.001  // 0.00494 ± 0.001 = [0.00394, 0.00594]
      },
      { 
        input: '0', 
        expectedOneTailed: 0.5,
        tolerance: 0.001
      }
    ];

    for (const testCase of testCases) {
      console.log(`Testing with input: ${testCase.input}`);
      
      await page.locator('[data-testid="zscore-input"]').fill(testCase.input);
      await page.locator('[data-testid="calculate-button"]').click();
      
      // Чекаємо появи результатів
      await expect(page.locator('[data-testid="results-container"]')).toBeVisible({ timeout: 5000 });
      
      // Отримуємо текст результату
      const oneTailedElement = page.locator('[data-testid="one-tailed-result"]');
      const oneTailedText = await oneTailedElement.textContent();
      
      // Витягуємо число з тексту
      const match = oneTailedText.match(/(\d+\.?\d*)/);
      const actualValue = parseFloat(match[0]);
      
      console.log(`Expected: ${testCase.expectedOneTailed}, Actual: ${actualValue}`);
      
      // Перевіряємо, що фактичне значення в межах допуску
      expect(Math.abs(actualValue - testCase.expectedOneTailed)).toBeLessThan(testCase.tolerance);
      
      const twoTailedElement = page.locator('[data-testid="two-tailed-result"]');
      await expect(twoTailedElement).toBeVisible();
      
      await page.waitForTimeout(500);
    }
  });

  test('кнопка Calculate працює при натисканні Enter', async ({ page }) => {
    const input = page.locator('[data-testid="zscore-input"]');
    await expect(input).toBeVisible();
    
    await input.fill('1.96');
    await input.press('Enter');
    
    // Чекаємо появи результатів
    await expect(page.locator('[data-testid="results-container"]')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('[data-testid="one-tailed-result"]')).toBeVisible();
    await expect(page.locator('[data-testid="two-tailed-result"]')).toBeVisible();
    
    // Перевіряємо, що значення не порожні
    const oneTailedText = await page.locator('[data-testid="one-tailed-result"]').textContent();
    expect(oneTailedText.length).toBeGreaterThan(20);
  });

  test('дизайн адаптивний та елементи видимі', async ({ page }) => {
    await expect(page.locator('.app-header')).toBeVisible();
    await expect(page.locator('.app-footer')).toBeVisible();
    await expect(page.locator('[data-testid="zscore-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="calculate-button"]')).toBeVisible();
  });
});