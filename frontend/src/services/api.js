import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000
});

// Interceptor de request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

//Interceptor de response
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const esRutaLogin = error.config?.url?.includes('/login');
        if (status === 401 && !esRutaLogin) {
            const mensaje = error.response?.data?.error;
            if (mensaje) sessionStorage.setItem('mensaje_sesion', mensaje);
            localStorage.removeItem('token');
            localStorage.removeItem('nombre_usuario');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;