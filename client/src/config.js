const config = {
    apiUrl: window.location.hostname.includes('railway.app')
        ? 'https://esd-testing-app-production.up.railway.app'
        : import.meta.env.VITE_API_URL || 'http://localhost:5001',
    isProduction: import.meta.env.MODE === 'production'
};

// Ensure config is loaded early and accessible
window.__APP_CONFIG__ = config;

console.log('Config initialized:', {
    apiUrl: config.apiUrl,
    environment: import.meta.env.MODE,
    buildTime: new Date().toISOString()
});

export default config; 