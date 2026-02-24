import { jStat } from 'jstat';

export function calculatePValues(zScore) {
  const z = parseFloat(zScore);
  if (isNaN(z)) {
    return { oneTailedPValue: null, twoTailedPValue: null, error: 'Invalid input' };
  }

  // Використовуємо вбудовану функцію jStat для z-тесту
  const twoTailed = jStat.ztest(Math.abs(z), 2);
  const oneTailed = twoTailed / 2;

  return {
    oneTailedPValue: oneTailed,
    twoTailedPValue: twoTailed,
    error: null
  };
}

export function formatPValue(value) {
  if (value === null || value === undefined) return 'N/A';
  return value.toFixed(5);
}

export function validateZScore(zScore) {
  if (zScore === '') return { isValid: false, message: 'Please enter a Z-score' };
  
  const z = parseFloat(zScore);
  if (isNaN(z)) return { isValid: false, message: 'Please enter a valid number' };
  
  if (z < -10 || z > 10) return { isValid: false, message: 'Z-score should typically be between -10 and 10' };
  
  return { isValid: true, message: '' };
}