console.log('Config module loading...');

const getApiUrl = () => {
    const hostname = window.location.hostname;
    console.log('Current hostname:', hostname);
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:5001';
    }
    
    return 'https://esd-testing-app-production.up.railway.app';
};

const config = {
    get apiUrl() {
        const url = getApiUrl();
        console.log('Returning API URL:', url);
        return url;
    }
};

export default config; 