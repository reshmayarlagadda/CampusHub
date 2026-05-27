import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const rootEl = document.getElementById('root');
// If the page was refreshed, replace the current URL with home path
try {
  const navEntries = typeof performance.getEntriesByType === 'function' ? performance.getEntriesByType('navigation') : [];
  const navType = (navEntries && navEntries.length) ? navEntries[0].type : (performance.navigation && performance.navigation.type === 1 ? 'reload' : null);
  if (navType === 'reload') {
    window.history.replaceState(null, '', '/');
  }
} catch (e) {}

// Global handlers to surface runtime errors into the DOM for debugging
window.onerror = (message, source, lineno, colno, error) => {
  if (rootEl) rootEl.innerText = `Runtime error: ${error?.message || message}`;
};
window.addEventListener('unhandledrejection', (e) => {
  if (rootEl) rootEl.innerText = `Unhandled rejection: ${e.reason?.message || e.reason}`;
});

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
