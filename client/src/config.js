console.log('Config module loading...');
console.log('PROD environment:', import.meta.env.PROD);

const API_URL = import.meta.env.PROD 
  ? 'https://esd-testing-app-production.up.railway.app'
  : 'http://localhost:5001';

console.log('Selected API_URL:', API_URL);
export default API_URL; 