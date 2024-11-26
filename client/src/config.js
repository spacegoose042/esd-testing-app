console.log('Config module loading...');

const API_URL = import.meta.env.PROD 
  ? 'https://esd-testing-app-production.up.railway.app'
  : 'http://localhost:5001';

export default API_URL; 