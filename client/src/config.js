const defaultConfig = {
  apiUrl: window.location.hostname.includes('railway.app')
    ? window.location.origin
    : 'http://localhost:5001',
  isProduction: window.location.hostname.includes('railway.app')
};

// Use existing config if defined, otherwise use default
window.__APP_CONFIG__ = window.__APP_CONFIG__ || defaultConfig;

export default window.__APP_CONFIG__; 