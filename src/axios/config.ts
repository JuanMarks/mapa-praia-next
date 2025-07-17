import axios from 'axios';

const api = axios.create({
    baseURL: 'https://backend-teste-production-e474.up.railway.app/',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

export default api;