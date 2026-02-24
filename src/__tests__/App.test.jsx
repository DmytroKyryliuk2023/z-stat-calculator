import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App.jsx';

describe('App Component', () => {
  it('рендерить заголовок додатку', () => {
    render(<App />);
    expect(screen.getByText(/Z-Statistic Calculator/i)).toBeInTheDocument();
  });

  it('рендерить підзаголовок', () => {
    render(<App />);
    expect(screen.getByText(/calculate p-values/i)).toBeInTheDocument();
  });

  it('рендерить компонент ZCalculator', () => {
    render(<App />);
    expect(screen.getByText('Z-Score P-Value Calculator')).toBeInTheDocument();
  });

  it('рендерить футер з інформацією про лабораторну роботу', () => {
    render(<App />);
    expect(screen.getByText(/laboratory work #1/i)).toBeInTheDocument();
  });
});