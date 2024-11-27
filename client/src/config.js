const config = {
    apiUrl: window.location.hostname.includes('railway.app')
        ? 'https://esd-testing-app-production.up.railway.app'
        : import.meta.env.VITE_API_URL || 'http://localhost:5001'
};

console.log('Config initialized:', {
    apiUrl: config.apiUrl,
    environment: import.meta.env.MODE,
    viteApiUrl: import.meta.env.VITE_API_URL,
    timestamp: new Date().toISOString()
});

export default config; 