import ZCalculator from './components/ZCalculator';
import './App.css';

function App() {
  // Отримуємо змінну оточення
  const appStatus = import.meta.env.VITE_APP_STATUS || 'unknown';

  return (
    <div className="app">
      <header className="app-header">
        <h1>📊 Z-Statistic Calculator</h1>
        <p className="subtitle">Calculate p-values for one-tailed and two-tailed tests</p>
        {/* Відображаємо статус у шапці */}
        <div className={`status-badge status-${appStatus}`}>
          Mode: {appStatus}
        </div>
      </header>
      <main>
        <ZCalculator />
      </main>
      <footer className="app-footer">
        <p>Laboratory work #1 | Build Automation</p>
        {/* Відображаємо статус також у футері */}
        <p className="footer-status">
          Running in <strong>{appStatus}</strong> mode
        </p>
      </footer>
    </div>
  );
}

export default App;