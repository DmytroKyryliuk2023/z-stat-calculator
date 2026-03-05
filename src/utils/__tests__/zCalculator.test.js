import { describe, it, expect, vi } from 'vitest';
import { calculatePValues, formatPValue, validateZScore } from '../zCalculator';
// Видаляємо непотрібний імпорт
// import { jStat } from 'jstat';

// Мокаємо jStat для контролю над результатами
vi.mock('jstat', () => ({
  jStat: {
    // Додаємо _ перед невикористовуваним параметром
    ztest: vi.fn((z, _sides) => {
      // Повертаємо передбачувані значення для тестів
      if (Math.abs(z - 1.96) < 0.01) return 0.05;
      if (Math.abs(z - 2.58) < 0.01) return 0.01;
      if (Math.abs(z - 0) < 0.01) return 1;
      return 0.5; // значення за замовчуванням
    })
  }
}));

describe('calculatePValues', () => {
  it('повертає коректні p-values для z = 1.96', () => {
    const result = calculatePValues('1.96');
    expect(result.oneTailedPValue).toBeCloseTo(0.025, 3);
    expect(result.twoTailedPValue).toBeCloseTo(0.05, 3);
    expect(result.error).toBeNull();
  });

  it('повертає коректні p-values для z = 2.58', () => {
    const result = calculatePValues('2.58');
    expect(result.oneTailedPValue).toBeCloseTo(0.005, 3);
    expect(result.twoTailedPValue).toBeCloseTo(0.01, 3);
    expect(result.error).toBeNull();
  });

  it('повертає 1 для двостороннього тесту при z = 0', () => {
    const result = calculatePValues('0');
    expect(result.twoTailedPValue).toBe(1);
    expect(result.oneTailedPValue).toBe(0.5);
  });

  it('обробляє від\'ємні z-значення', () => {
    const positiveResult = calculatePValues('1.96');
    const negativeResult = calculatePValues('-1.96');
    expect(negativeResult.oneTailedPValue).toBe(positiveResult.oneTailedPValue);
    expect(negativeResult.twoTailedPValue).toBe(positiveResult.twoTailedPValue);
  });

  it('повертає помилку для невалідного вводу', () => {
    const result = calculatePValues('not a number');
    expect(result.oneTailedPValue).toBeNull();
    expect(result.twoTailedPValue).toBeNull();
    expect(result.error).toBe('Invalid input');
  });

  it('обробляє порожній рядок', () => {
    const result = calculatePValues('');
    expect(result.oneTailedPValue).toBeNull();
    expect(result.twoTailedPValue).toBeNull();
    expect(result.error).toBe('Invalid input');
  });
});

describe('formatPValue', () => {
  it('форматує число з 5 десятковими знаками', () => {
    expect(formatPValue(0.123456789)).toBe('0.12346');
  });

  it('повертає "N/A" для null', () => {
    expect(formatPValue(null)).toBe('N/A');
  });

  it('повертає "N/A" для undefined', () => {
    expect(formatPValue(undefined)).toBe('N/A');
  });
});

describe('validateZScore', () => {
  it('валідний z-score проходить перевірку', () => {
    const result = validateZScore('1.96');
    expect(result.isValid).toBe(true);
    expect(result.message).toBe('');
  });

  it('від\'ємний z-score проходить перевірку', () => {
    const result = validateZScore('-2.5');
    expect(result.isValid).toBe(true);
  });

  it('порожнє значення не проходить перевірку', () => {
    const result = validateZScore('');
    expect(result.isValid).toBe(false);
    expect(result.message).toBe('Please enter a Z-score');
  });

  it('нечислове значення не проходить перевірку', () => {
    const result = validateZScore('abc');
    expect(result.isValid).toBe(false);
    expect(result.message).toBe('Please enter a valid number');
  });

  it('занадто велике значення не проходить перевірку', () => {
    const result = validateZScore('100');
    expect(result.isValid).toBe(false);
    expect(result.message).toBe('Z-score should typically be between -10 and 10');
  });
});