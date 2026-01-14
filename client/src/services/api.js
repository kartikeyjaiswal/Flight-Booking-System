import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Add interceptor if needed (e.g. for auth tokens later)
// api.interceptors.request.use(config => { ... });

export default api;
