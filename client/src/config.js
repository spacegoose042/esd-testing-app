const hostname = window.location.hostname;
const isProduction = hostname.includes('railway.app');

console.log('Environment detection:', {
    hostname,
    isProduction,
    fullUrl: window.location.href
});

const config = {
    apiUrl: isProduction
        ? 'https://esd-testing-app-production.up.railway.app'
        : 'http://localhost:5001'
};

console.log('Using API URL:', config.apiUrl);

export default config; 