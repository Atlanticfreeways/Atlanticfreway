import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const authApi = axios.create({
    baseURL: `${API_URL}/auth`,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const loginUser = async (credentials: any) => {
    try {
        const response = await authApi.post('/login', credentials);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.error || { message: 'Login failed' };
    }
};

export const registerUser = async (userData: any) => {
    try {
        const response = await authApi.post('/register', userData);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.error || { message: 'Registration failed' };
    }
};

export const getProfile = async (token: string) => {
    try {
        const response = await authApi.get('/me', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.error || { message: 'Failed to fetch profile' };
    }
};
