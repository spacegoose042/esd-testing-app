const defaultConfig = {
    apiUrl: window.location.hostname.includes('railway.app')
        ? 'https://esd-testing-app-production.up.railway.app'
        : 'http://localhost:5173',
    isProduction: window.location.hostname.includes('railway.app')
};

const config = window.__APP_CONFIG__ || defaultConfig;

console.log('Config initialized:', config);

export default config; 