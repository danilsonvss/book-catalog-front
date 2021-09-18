import axios from 'axios';

const token = localStorage.getItem('token');

const api = axios.create({
    baseURL: 'http://localhost/api/',
    timeout: 1000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
});

export default api;