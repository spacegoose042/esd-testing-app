import config from '../config';

export const login = async (email, password) => {
    const loginEndpoint = `${config.apiUrl}/api/auth/login`;
    
    console.log('Login attempt details:', {
        email,
        targetUrl: loginEndpoint,
        configState: config,
        environment: import.meta.env.MODE,
        timestamp: new Date().toISOString()
    });
    
    try {
        const response = await fetch(loginEndpoint, {
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
            url: loginEndpoint,
            timestamp: new Date().toISOString()
        });
        throw error;
    }
}; 