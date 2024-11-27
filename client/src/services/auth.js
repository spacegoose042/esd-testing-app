import config from '../config';

export const login = async (email, password) => {
    const loginEndpoint = `${config.apiUrl}/api/auth/login`;
    
    try {
        console.log('Login attempt starting:', {
            endpoint: loginEndpoint,
            email,
            timestamp: new Date().toISOString()
        });
        
        const response = await fetch(loginEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }

        return response.json();
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}; 