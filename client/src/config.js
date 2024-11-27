const config = {
    apiUrl: import.meta.env.VITE_API_URL || 'https://esd-testing-app-production.up.railway.app'
};

console.log('Config initialized:', {
    apiUrl: config.apiUrl,
    environment: import.meta.env.MODE,
    timestamp: new Date().toISOString()
});

export default config; 