import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Targeted the unique ID 'surplus-matchmaker-root' to bypass any legacy conflicts
const rootElement = document.getElementById('surplus-matchmaker-root');

if (!rootElement) {
  throw new Error("Could not find root element 'surplus-matchmaker-root' to mount application");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);