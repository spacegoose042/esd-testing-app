const config = {
    apiUrl: window.location.hostname.includes('railway.app') || window.location.hostname === 'localhost'
        ? window.location.origin
        : import.meta.env.VITE_API_URL,
    isProduction: import.meta.env.MODE === 'production'
};

window.__APP_CONFIG__ = config;

console.log('Config initialized:', {
    apiUrl: config.apiUrl,
    environment: import.meta.env.MODE,
    hostname: window.location.hostname,
    buildTime: new Date().toISOString()
});

export default config; 