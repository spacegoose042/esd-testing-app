console.log('Config module loading...');

const API_URL = import.meta.env.PROD 
  ? 'https://esd-testing-app-production.up.railway.app'
  : 'http://localhost:5001';

console.log('API URL:', API_URL);
export default API_URL; 