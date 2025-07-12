import axios from 'axios';
import { API_URL } from '@env'; // auto-imports from .env
import AsyncStorage from '@react-native-async-storage/async-storage';
console.log("🚀 ~ API_UR23:", API_URL)

const api = axios.create({
    baseURL: API_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('authToken');
        console.log("🚀 ~ token:", token)
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
