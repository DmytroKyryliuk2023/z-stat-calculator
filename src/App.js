import ZCalculator from './components/ZCalculator';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>📊 Z-Statistic Calculator</h1>
        <p className="subtitle">Calculate p-values for one-tailed and two-tailed tests</p>
      </header>
      <main>
        <ZCalculator />
      </main>
      <footer className="app-footer">
        <p>Laboratory work #1 | Git Branching & Code Review</p>
      </footer>
    </div>
  );
}

export default App;