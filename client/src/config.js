const isRailwayApp = window.location.hostname.includes('railway.app');
const apiUrl = isRailwayApp 
    ? 'https://esd-testing-app-production.up.railway.app'
    : 'http://localhost:5001';

console.log('Config Debug:', {
    hostname: window.location.hostname,
    isRailwayApp,
    apiUrl
});

const config = { apiUrl };
export default config; 