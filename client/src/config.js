const config = {
    apiUrl: import.meta.env.PROD 
        ? 'https://esd-testing-app-production.up.railway.app'
        : 'http://localhost:5001'
};

console.log('Config initialized:', {
    apiUrl: config.apiUrl,
    environment: import.meta.env.MODE,
    timestamp: new Date().toISOString()
});

export default config; 