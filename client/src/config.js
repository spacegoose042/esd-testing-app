const config = {
    apiUrl: 'https://esd-testing-app-production.up.railway.app'
};

window.addEventListener('load', () => {
    console.log('Window loaded');
    console.log('Using API_URL:', config.apiUrl);
});

export default config; 