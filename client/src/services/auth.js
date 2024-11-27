import config from '../config';

export const login = async (email, password) => {
    // Force production URL and log the attempt
    const BASE_URL = 'https://esd-testing-app-production.up.railway.app';
    const loginEndpoint = `${BASE_URL}/api/auth/login`;
    
    console.log('Login attempt details:', {
        email,
        targetUrl: loginEndpoint,
        configState: config,
        baseUrl: BASE_URL,
        timestamp: new Date().toISOString()
    });
    
    try {
        const response = await fetch(loginEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Login failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Login error details:', error);
        throw error;
    }
}; 