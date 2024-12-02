const apiUrl = import.meta.env.VITE_API_URL || 'https://esd-testing-app-production.up.railway.app';

console.log('API URL:', apiUrl); // Debugging line

const config = {
  apiUrl,
  // Add any other configuration values here
};

if (!config.apiUrl) {
  console.error('API URL is not defined in environment variables');
}

export default config; 