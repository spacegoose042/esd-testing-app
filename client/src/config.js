const defaultConfig = {
    apiUrl: window.location.origin,
    isProduction: true
};

const config = window.__APP_CONFIG__ || defaultConfig;

console.log('Config initialized:', config);

export default config; 