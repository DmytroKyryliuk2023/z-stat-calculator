import { useState } from "react";
import { jStat } from "jstat";

export default function ZCalculator() {
  const [zScore, setZScore] = useState("");
  const [oneTailedPValue, setOneTailedPValue] = useState(null);
  const [twoTailedPValue, setTwoTailedPValue] = useState(null);

  const calculatePValue = () => {
    const z = parseFloat(zScore);
    if (isNaN(z)) return;

    // Використовуємо вбудовану функцію jStat для z-тесту
    // Це повертає p-value для двостороннього тесту (sides=2)
    const twoTailed = jStat.ztest(Math.abs(z), 2);
    // Односторонній — це половина двостороннього
    const oneTailed = twoTailed / 2;

    setOneTailedPValue(oneTailed);
    setTwoTailedPValue(twoTailed);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h2>Z-Score P-Value Calculator</h2>
      <div>
        <label>Enter Z-Score: </label>
        <input
          type="number"
          step="0.01"
          value={zScore}
          onChange={(e) => setZScore(e.target.value)}
          placeholder="e.g., 1.96"
          style={{ marginRight: "1rem", padding: "0.3rem" }}
        />
        <button onClick={calculatePValue} style={{ padding: "0.3rem 1rem" }}>
          Calculate
        </button>
      </div>
      {oneTailedPValue !== null && (
        <div style={{ marginTop: "2rem" }}>
          <p>
            <strong>One-tailed p-value:</strong> {oneTailedPValue.toFixed(5)}
          </p>
          <p>
            <strong>Two-tailed p-value:</strong> {twoTailedPValue.toFixed(5)}
          </p>
        </div>
      )}
    </div>
  );
}