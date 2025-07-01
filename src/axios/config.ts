import axios from 'axios';

const api = axios.create({
    baseURL: 'http://25.20.79.62:3000/',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

export default api;