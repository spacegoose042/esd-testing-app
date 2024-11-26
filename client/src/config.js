const config = {
  apiUrl: window.location.hostname === 'localhost'
    ? 'http://localhost:5001'
    : window.location.protocol + '//esd-testing-app-production.up.railway.app'
};

// Add debug logging
const debugInfo = {
  currentHostname: window.location.hostname,
  currentProtocol: window.location.protocol,
  selectedApiUrl: config.apiUrl,
  fullCurrentUrl: window.location.href
};

console.log('Config Debug Info:', debugInfo);

export default config; 