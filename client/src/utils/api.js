export const getBaseUrl = () => {
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:5001';
  }
  // For production, use the actual Railway URL of your backend API
  return 'https://esd-testing-app-production.up.railway.app';
};

export const API_URL = getBaseUrl(); 