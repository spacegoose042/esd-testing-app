import config from '../config';

export const login = async (email, password) => {
    const loginEndpoint = 'https://esd-testing-app-production.up.railway.app/api/auth/login';
    
    console.log('Login attempt starting:', {
        endpoint: loginEndpoint,
        email: email,
        timestamp: new Date().toISOString()
    });
    
    try {
        const response = await fetch(loginEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Origin': 'https://esd-testing-app-production.up.railway.app'
            },
            credentials: 'include',
            mode: 'cors',
            body: JSON.stringify({ email, password })
        });

        // Log response details
        console.log('Server response:', {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries())
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Login successful');
        return data;
    } catch (error) {
        console.error('Login error:', {
            message: error.message,
            type: error.name,
            stack: error.stack
        });
        throw error;
    }
}; 