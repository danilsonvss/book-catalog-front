import axios from 'axios';
require('dotenv').config()

const token = localStorage.getItem('token');

const api = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
});

export default api;