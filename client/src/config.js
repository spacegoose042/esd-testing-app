const getApiUrl = () => {
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost';
    
    console.log('URL Detection:', {
        hostname,
        isLocalhost,
        fullUrl: window.location.href,
        protocol: window.location.protocol
    });

    const apiUrl = isLocalhost
        ? 'http://localhost:5001'
        : 'https://esd-testing-app-production.up.railway.app';

    console.log('Selected API URL:', apiUrl);
    return apiUrl;
};

const config = {
    apiUrl: getApiUrl()
};

export default config; 