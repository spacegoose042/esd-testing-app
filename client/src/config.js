const config = {
  apiUrl: window.location.hostname.includes('railway.app')
    ? window.location.origin
    : 'http://localhost:5001',
  isProduction: window.location.hostname.includes('railway.app')
};

// Make config available both as a module export and global variable
window.__APP_CONFIG__ = config;
export default config; 