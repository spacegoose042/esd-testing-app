const config = {
  apiUrl: window.location.hostname.includes('railway.app')
    ? 'https://esd-testing-app-production.up.railway.app'
    : 'http://localhost:5001'
};

export default config; 