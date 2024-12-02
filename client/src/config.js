const config = {
  apiUrl: import.meta.env.VITE_API_URL
};

console.log('Current environment:', import.meta.env.MODE);
console.log('API URL:', config.apiUrl);

export default config; 