import config from '../config';

export const login = async (email, password) => {
    const loginEndpoint = 'https://esd-testing-app-production.up.railway.app/api/auth/login';
    
    // Debug logging
    console.log('Login request configuration:', {
        endpoint: loginEndpoint,
        configUrl: config.apiUrl,
        mode: import.meta.env.MODE,
        timestamp: new Date().toISOString()
    });
    
    const response = await fetch(loginEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
        const error = await response.json();
        console.error('Server response:', error);
        throw new Error(error.message || 'Login failed');
    }

    return response.json();
}; 