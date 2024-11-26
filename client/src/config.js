const config = {
  apiUrl: process.env.NODE_ENV === 'production'
    ? 'https://esd-testing-app-production.up.railway.app'
    : 'http://localhost:5001'
};

export default config; 