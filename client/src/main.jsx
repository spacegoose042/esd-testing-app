import React from 'react'
import ReactDOM from 'react-dom/client'
import config from './config'
import App from './App.jsx'
import './index.css'

// Debug log to verify config initialization
console.log('Main.jsx initializing with config:', config);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)