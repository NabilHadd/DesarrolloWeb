import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

let root;

function startApp() {
  const container = document.getElementById('root');

  // Inicializa el root solo una vez
  if (!root) {
    root = createRoot(container);
  }

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// Cordova o Web normal
if (window.cordova) {
  document.addEventListener('deviceready', startApp, false);
} else {
  startApp();
}

reportWebVitals();
