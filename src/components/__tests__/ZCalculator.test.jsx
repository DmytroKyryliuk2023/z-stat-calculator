import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ZCalculator from '../ZCalculator';

// Мокаємо jStat для передбачуваних результатів
vi.mock('jstat', () => ({
  jStat: {
    ztest: vi.fn((z) => {
      if (Math.abs(z - 1.96) < 0.01) return 0.05;
      if (Math.abs(z - 2.58) < 0.01) return 0.01;
      return 0.5;
    })
  }
}));

describe('ZCalculator Component', () => {
  beforeEach(() => {
    render(<ZCalculator />);
  });

  it('рендерить компонент з заголовком', () => {
    expect(screen.getByText('Z-Score P-Value Calculator')).toBeInTheDocument();
  });

  it('рендерить поле введення та кнопку', () => {
    // Використовуємо getByRole для input замість getByLabelText
    const input = screen.getByRole('spinbutton'); // для type="number"
    expect(input).toBeInTheDocument();
    
    const button = screen.getByRole('button', { name: /calculate/i });
    expect(button).toBeInTheDocument();
  });

  it('не показує результати до натискання кнопки', () => {
    expect(screen.queryByText(/one-tailed p-value/i)).not.toBeInTheDocument();
  });

  it('обчислює та відображає p-values після введення значення', async () => {
    // Знаходимо елементи
    const input = screen.getByRole('spinbutton');
    const button = screen.getByRole('button', { name: /calculate/i });

    // Вводимо значення
    await userEvent.type(input, '1.96');
    fireEvent.click(button);

    // Очікуємо появи результатів
    await waitFor(() => {
      expect(screen.getByText(/one-tailed p-value:/i)).toBeInTheDocument();
      expect(screen.getByText(/two-tailed p-value:/i)).toBeInTheDocument();
    });

    // Перевіряємо конкретні значення
    expect(screen.getByText('0.02500')).toBeInTheDocument();
    expect(screen.getByText('0.05000')).toBeInTheDocument();
  });

  it('оновлює стан при зміні введеного значення', async () => {
    const input = screen.getByRole('spinbutton');
    
    await userEvent.type(input, '2.58');
    expect(input).toHaveValue(2.58);
  });

  it('обробляє невалідне введення без падіння', async () => {
    const input = screen.getByRole('spinbutton');
    const button = screen.getByRole('button', { name: /calculate/i });

    // Для type="number" неможливо ввести текст, тому перевіряємо порожнє значення
    await userEvent.clear(input);
    fireEvent.click(button);

    // Компонент не показує результати для порожнього вводу
    expect(screen.queryByText(/one-tailed p-value/i)).not.toBeInTheDocument();
  });
});