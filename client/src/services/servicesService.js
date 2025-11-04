import api from './api.js';

export const servicesService = {
    // Get all active services (public)
    getActiveServices: async () => {
        const response = await api.get('/services');
        return response.data.data.services;
    },

    // Get all services (admin)
    getAllServices: async () => {
        const response = await api.get('/services/admin/all');
        return response.data.data.services;
    },

    // Get single service (public)
    getService: async (id) => {
        const response = await api.get(`/services/${id}`);
        return response.data.data.service;
    },

    // Create service (admin)
    createService: async (data) => {
        const formData = new FormData();

        // Append all fields
        Object.keys(data).forEach(key => {
            if (data[key] !== null && data[key] !== undefined) {
                formData.append(key, data[key]);
            }
        });

        const response = await api.post('/services', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data.service;
    },

    // Update service (admin)
    updateService: async (id, data) => {
        const formData = new FormData();

        // Append all fields
        Object.keys(data).forEach(key => {
            if (data[key] !== null && data[key] !== undefined) {
                formData.append(key, data[key]);
            }
        });

        const response = await api.put(`/services/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data.service;
    },

    // Delete service (admin)
    deleteService: async (id) => {
        const response = await api.delete(`/services/${id}`);
        return response.data;
    },

    // Seed default services (admin)
    seedDefaults: async () => {
        const response = await api.post('/services/admin/seed-defaults');
        return response.data.data?.services || [];
    }
};
