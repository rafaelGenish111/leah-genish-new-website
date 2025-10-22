import api from './api.js';

export const authService = {
    // Login user
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data.data;
    },

    // Logout user
    logout: async () => {
        const response = await api.post('/auth/logout');
        return response.data;
    },

    // Get current user
    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data.data.user;
    },

    // Update password
    updatePassword: async (data) => {
        const response = await api.put('/auth/update-password', data);
        return response.data;
    },

    // Register new admin (admin only)
    register: async (data) => {
        const response = await api.post('/auth/register', data);
        return response.data.data;
    }
};
