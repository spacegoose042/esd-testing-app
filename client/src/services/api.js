import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://esd-testing-app-production.up.railway.app',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api; 