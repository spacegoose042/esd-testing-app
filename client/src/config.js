const config = {
  apiUrl: window.location.hostname.includes('railway.app')
    ? 'https://esd-testing-app-production.up.railway.app'
    : 'http://localhost:5001'
};

console.log('Current hostname:', window.location.hostname);
console.log('Using API URL:', config.apiUrl);

export default config; 