import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Initialize config before anything else
const config = {
  apiUrl: window.location.origin,
  isProduction: true
};
window.__APP_CONFIG__ = config;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)