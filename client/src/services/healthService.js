import api from './api.js';

export const healthService = {
    // Get all health declarations (admin)
    getDeclarations: async (params = {}) => {
        const response = await api.get('/health', { params });
        return response.data.data;
    },

    // Get single health declaration (admin)
    getDeclaration: async (id) => {
        const response = await api.get(`/health/${id}`);
        return response.data.data.declaration;
    },

    // Submit health declaration (public)
    submitDeclaration: async (data) => {
        const response = await api.post('/health', data);
        return response.data.data.declaration;
    },

    // Delete health declaration (admin)
    deleteDeclaration: async (id) => {
        const response = await api.delete(`/health/${id}`);
        return response.data;
    },

    // Export health declaration as PDF (admin)
    exportPDF: async (id) => {
        const response = await api.get(`/health/export/${id}`, {
            responseType: 'blob'
        });
        return response.data;
    }
};
