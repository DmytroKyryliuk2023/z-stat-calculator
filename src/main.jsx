import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import posthog from 'posthog-js';

posthog.init('phc_sYTJUY56AMQXL2wd5QSNPtKWFwBnNDXJAG2L2sUuiGSN', {
api_host: 'https://eu.i.posthog.com',
person_profiles: 'identified_only', // або 'always' для анонімних користувачів
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)