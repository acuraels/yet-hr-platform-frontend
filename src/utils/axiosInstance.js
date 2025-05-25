// src/utils/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://192.168.1.122:8000/api/v1/',
    headers: {
        'Content-Type': 'application/json',
    }
});

axiosInstance.interceptors.request.use(config => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh_token');

            if (refreshToken) {
                try {
                    const { data } = await axios.post(
                        'http://192.168.1.122:8000/api/v1/accounts/token/refresh/',
                        { refresh: refreshToken }
                    );
                    localStorage.setItem('access_token', data.access);
                    axiosInstance.defaults.headers['Authorization'] = 'Bearer ' + data.access;
                    originalRequest.headers['Authorization'] = 'Bearer ' + data.access;
                    return axiosInstance(originalRequest);
                } catch {
                    // рефреш упал — дальше очистка
                }
            }

            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user_role');
            localStorage.removeItem('user_id');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
