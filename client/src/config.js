const config = window.__APP_CONFIG__ || {
    apiUrl: window.location.origin,
    isProduction: import.meta.env.MODE === 'production'
};

console.log('Config initialized:', {
    apiUrl: config.apiUrl,
    environment: import.meta.env.MODE,
    hostname: window.location.hostname,
    buildTime: new Date().toISOString()
});

export default config; 