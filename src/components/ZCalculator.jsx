import { useState, useEffect } from "react";
import { jStat } from "jstat";
import posthog from 'posthog-js';
import * as Sentry from "@sentry/react";

export default function ZCalculator() {
  const [zScore, setZScore] = useState("");
  const [oneTailedPValue, setOneTailedPValue] = useState(null);
  const [twoTailedPValue, setTwoTailedPValue] = useState(null);
  const [specialTheme, setSpecialTheme] = useState(false);

  // Перевірка Feature Flag
  useEffect(() => {
    const isEnabled = posthog.isFeatureEnabled('show-special-theme');
    setSpecialTheme(isEnabled);
  }, []);

  // Генерація унікального ID користувача (зберігається в localStorage)
  const [userId] = useState(() => {
    let id = localStorage.getItem('user_id');
    if (!id) {
      id = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('user_id', id);
    }
    return id;
  });

  // Передача контексту користувача в Sentry
  useEffect(() => {
    Sentry.setUser({
      id: userId,
      email: `${userId}@example.com`,
      segment: "calculator_user"
    });
  }, [userId]);

  const handleInputFocus = () => {
    posthog.capture('input_focused', {
      field_name: 'zscore_input',
    });
  };

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

  const handleCalculateClick = () => {
    posthog.capture('calculate_button_clicked', {
      current_z_score: zScore || 'empty',
    });
    calculatePValue();
  };

  const throwError = () => {
    throw new Error("Sentry Test Error: Something went wrong!");
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      calculatePValue();
    }
  };

  return (
    <div style={{
      padding: "2rem", fontFamily: "sans-serif",
      backgroundColor: specialTheme ? "white" : "transparent"
    }}>
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
        <button 
          onClick={throwError} 
          style={{ marginLeft: "0.5rem", padding: "0.3rem 1rem", backgroundColor: "#ff4444", color: "white", border: "none", borderRadius: "3px", cursor: "pointer" }}
        >
          Викликати помилку
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
          {/* Інформаційний блок з ID користувача */}
          <div style={{ marginTop: "1rem", padding: "0.5rem", backgroundColor: "#f0f0f0", borderRadius: "5px" }}>
            <small>👤 User ID: {userId}</small>
          </div>
        </div>
      )}
    </div>
  );
}