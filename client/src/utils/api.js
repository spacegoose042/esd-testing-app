export const getBaseUrl = () => {
  return window.location.hostname === 'localhost' 
    ? 'http://localhost:5001' 
    : 'https://esd-testing-app-production.up.railway.app';
}; 