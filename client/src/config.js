const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'https://esd-testing-app-production.up.railway.app'
};

console.log('Config loaded:', config);
console.log('API URL from env:', import.meta.env.VITE_API_URL);

export default config; 