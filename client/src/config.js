const config = {
  apiUrl: window.location.hostname === 'localhost'
    ? 'http://localhost:5001'
    : 'https://esd-testing-app-production.up.railway.app'
};

console.log('Config initialized with:', {
  hostname: window.location.hostname,
  apiUrl: config.apiUrl
});

export default config; 