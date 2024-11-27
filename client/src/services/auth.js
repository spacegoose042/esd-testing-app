import config from '../config';

// Force production URL for login endpoint
const LOGIN_URL = 'https://esd-testing-app-production.up.railway.app/api/auth/login';

console.log('Auth service initialization:', {
    configObject: config,
    apiUrl: config.apiUrl,
    loginUrl: LOGIN_URL,
    timestamp: new Date().toISOString()
});

export const login = async (email, password) => {
    console.log('Login attempt details:', {
        email,
        targetUrl: LOGIN_URL,
        configState: config,
        timestamp: new Date().toISOString()
    });
    
    try {
        const response = await fetch(LOGIN_URL, {
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
        console.error('Login error details:', {
            error: error.message,
            type: error.name,
            config: config,
            url: LOGIN_URL,
            timestamp: new Date().toISOString()
        });
        throw error;
    }
}; 