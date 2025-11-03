import api from './api.js';

export const availabilityService = {
    // Get all availability
    getAvailability: async () => {
        const response = await api.get('/availability');
        return response.data.data;
    },

    // Create availability
    createAvailability: async (data) => {
        const response = await api.post('/availability', data);
        return response.data.data;
    },

    // Update availability
    updateAvailability: async (id, data) => {
        const response = await api.put(`/availability/${id}`, data);
        return response.data.data;
    },

    // Delete availability
    deleteAvailability: async (id) => {
        const response = await api.delete(`/availability/${id}`);
        return response.data;
    },

    // Get exceptions
    getExceptions: async (startDate = null, endDate = null) => {
        let url = '/availability/exceptions';
        const params = {};
        
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        
        if (Object.keys(params).length > 0) {
            url += '?' + new URLSearchParams(params).toString();
        }
        
        const response = await api.get(url);
        return response.data.data;
    },

    // Create exception
    createException: async (data) => {
        const response = await api.post('/availability/exceptions', data);
        return response.data.data;
    },

    // Update exception
    updateException: async (id, data) => {
        const response = await api.put(`/availability/exceptions/${id}`, data);
        return response.data.data;
    },

    // Delete exception
    deleteException: async (id) => {
        const response = await api.delete(`/availability/exceptions/${id}`);
        return response.data;
    }
};

