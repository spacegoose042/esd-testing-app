import config from '../config';

console.log('Auth service initialization:', {
    configObject: config,
    apiUrl: config.apiUrl,
    timestamp: new Date().toISOString()
});

export const login = async (email, password) => {
    console.log('Login attempt details:', {
        email,
        targetUrl: `${config.apiUrl}/api/auth/login`,
        configState: config,
        timestamp: new Date().toISOString()
    });
    
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
        console.error('Login error details:', {
            error: error.message,
            type: error.name,
            config: config,
            timestamp: new Date().toISOString()
        });
        throw error;
    }
}; 