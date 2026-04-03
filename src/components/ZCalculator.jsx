import { useState } from "react";
import { jStat } from "jstat";
import posthog from 'posthog-js';

export default function ZCalculator() {
  const [zScore, setZScore] = useState("");
  const [oneTailedPValue, setOneTailedPValue] = useState(null);
  const [twoTailedPValue, setTwoTailedPValue] = useState(null);

  // Подія 1: натиснув на поле введення
  const handleInputFocus = () => {
    posthog.capture('input_focused', {
      field_name: 'zscore_input',
    });
  };

  // Подія 2: ввів значення
  const handleInputChange = (e) => {
    const value = e.target.value;
    setZScore(value);
    
    if (value && value !== '') {
      posthog.capture('value_entered', {
        input_value: value,
        value_length: value.length,
      });
    }
  };

  const calculatePValue = () => {
    const z = parseFloat(zScore);
    if (isNaN(z)) {
      return;
    }

    const twoTailed = jStat.ztest(Math.abs(z), 2);
    const oneTailed = twoTailed / 2;
    
    setOneTailedPValue(oneTailed);
    setTwoTailedPValue(twoTailed);
  };

  // Подія 3: натиснув кнопку "Calculate"
  const handleCalculateClick = () => {
    posthog.capture('calculate_button_clicked', {
      current_z_score: zScore || 'empty',
    });
    calculatePValue();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      calculatePValue();
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h2>Z-Score P-Value Calculator</h2>
      <div>
        <label htmlFor="zscore-input">Enter Z-Score: </label>
        <input
          id="zscore-input"
          type="number"
          step="0.01"
          value={zScore}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder="e.g., 1.96"
          style={{ marginRight: "1rem", padding: "0.3rem" }}
          data-testid="zscore-input"
        />
        <button 
          onClick={handleCalculateClick} 
          style={{ padding: "0.3rem 1rem" }}
          data-testid="calculate-button"
        >
          Calculate
        </button>
      </div>
      {oneTailedPValue !== null && (
        <div style={{ marginTop: "2rem" }} data-testid="results-container">
          <p data-testid="one-tailed-result">
            <strong>One-tailed p-value:</strong> {oneTailedPValue.toFixed(5)}
          </p>
          <p data-testid="two-tailed-result">
            <strong>Two-tailed p-value:</strong> {twoTailedPValue.toFixed(5)}
          </p>
        </div>
      )}
    </div>
  );
}