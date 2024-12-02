import axios from 'axios';
import config from '../config';

console.log('API Service initialized with URL:', config.apiUrl);

const api = axios.create({
  baseURL: config.apiUrl,
  // You can add other axios configurations here
});

export default api; 