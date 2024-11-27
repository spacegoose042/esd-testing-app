// Create a global config object
window.appConfig = {
    apiUrl: window.location.hostname.includes('railway.app')
        ? 'https://esd-testing-app-production.up.railway.app'
        : 'http://localhost:5173',
    isProduction: window.location.hostname.includes('railway.app')
};

// Export the config object
export default window.appConfig; 