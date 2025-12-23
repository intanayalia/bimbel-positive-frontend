import axios from 'axios';

// Pastikan URL ini sesuai dengan port backend Laravel Anda (biasanya 8000)
const API_BASE_URL = 'http://127.0.0.1:8000/api' // 'https://api.bimblepositive.my.id/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        // PENTING: Jangan set 'Content-Type' di sini secara manual.
        // Biarkan axios/browser mengaturnya otomatis (agar upload file FormData bisa jalan).
        
        'Accept': 'application/json', // Ini wajib agar Laravel tahu kita minta balikan JSON
    },
});

// Interceptor: Otomatis menyisipkan Token ke setiap request jika user sudah login
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;