import { useState } from "react";
import { jStat } from "jstat";

export default function ZCalculator() {
  const [zScore, setZScore] = useState("");
  const [oneTailedPValue, setOneTailedPValue] = useState(null);
  const [twoTailedPValue, setTwoTailedPValue] = useState(null);

  const calculatePValue = () => {
    console.log('Calculating with zScore:', zScore);
    const z = parseFloat(zScore);
    if (isNaN(z)) {
      console.log('Invalid zScore');
      return;
    }

    const twoTailed = jStat.ztest(Math.abs(z), 2);
    const oneTailed = twoTailed / 2;

    console.log('Calculated:', { oneTailed, twoTailed });
    
    setOneTailedPValue(oneTailed);
    setTwoTailedPValue(twoTailed);
  };

  const handleKeyDown = (e) => {
    console.log('Key pressed:', e.key);
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
          onChange={(e) => setZScore(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g., 1.96"
          style={{ marginRight: "1rem", padding: "0.3rem" }}
          data-testid="zscore-input"
        />
        <button 
          onClick={calculatePValue} 
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