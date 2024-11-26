import API_URL from '../config';

console.log('Auth service loaded, API_URL:', API_URL);

export const login = async (email, password) => {
    console.log('Login called with email:', email);
    console.log('Will attempt to connect to:', `${API_URL}/api/auth/login`);
    
    try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}; 