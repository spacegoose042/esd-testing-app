import config from '../config';

console.log('Auth service loaded, API_URL:', config.apiUrl);

export const login = async (email, password) => {
    console.log('Login called with email:', email);
    console.log('Will attempt to connect to:', `${config.apiUrl}/api/auth/login`);
    
    try {
        const response = await fetch(`${config.apiUrl}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Login failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}; 