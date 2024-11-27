const config = {
  apiUrl: window.location.hostname.includes('railway.app')
    ? window.location.origin
    : 'http://localhost:5001',
  isProduction: window.location.hostname.includes('railway.app')
};

window.__APP_CONFIG__ = config;
console.log('Config initialized:', config);
export default config; 