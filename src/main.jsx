import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import posthog from 'posthog-js';
import * as Sentry from "@sentry/react";

posthog.init('phc_sYTJUY56AMQXL2wd5QSNPtKWFwBnNDXJAG2L2sUuiGSN', {
  api_host: 'https://eu.i.posthog.com',
  person_profiles: 'identified_only',
});

Sentry.init({
  dsn: "https://09bcb5e395ed9bc7c886e59abdba7ad2@o4511179621269504.ingest.de.sentry.io/4511179705811024",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  environment: import.meta.env.VITE_APP_STATUS || "development",
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)