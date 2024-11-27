// Initialize config before exporting
const initConfig = () => {
  const config = {
    apiUrl: window.location.hostname.includes('railway.app')
      ? 'https://esd-testing-app-production.up.railway.app'
      : 'http://localhost:5173',
    isProduction: window.location.hostname.includes('railway.app')
  };

  // Make config available globally
  window.__APP_CONFIG__ = config;
  return config;
};

export default initConfig(); 