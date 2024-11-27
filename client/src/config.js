const config = {
  apiUrl: window.location.hostname.includes('railway.app')
    ? window.location.origin
    : 'http://localhost:5173',
  isProduction: window.location.hostname.includes('railway.app')
};

window.__APP_CONFIG__ = config;
export default config; 