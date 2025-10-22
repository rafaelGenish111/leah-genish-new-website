import api from './api.js';

export const appointmentsService = {
    // Get all appointments (admin)
    getAppointments: async (params = {}) => {
        const response = await api.get('/appointments', { params });
        return response.data.data;
    },

    // Get available time slots (public)
    getAvailableSlots: async (date, serviceType) => {
        const response = await api.get('/appointments/available-slots', {
            params: { date, serviceType }
        });
        return response.data.data;
    },

    // Get single appointment
    getAppointment: async (id) => {
        const response = await api.get(`/appointments/${id}`);
        return response.data.data.appointment;
    },

    // Create appointment (public)
    createAppointment: async (data) => {
        const response = await api.post('/appointments', data);
        return response.data.data;
    },

    // Update appointment (admin)
    updateAppointment: async (id, data) => {
        const response = await api.put(`/appointments/${id}`, data);
        return response.data.data.appointment;
    },

    // Cancel appointment (public with token or admin)
    cancelAppointment: async (id, token = null) => {
        const params = token ? { token } : {};
        const response = await api.delete(`/appointments/${id}`, { params });
        return response.data;
    },

    // Update appointment status (admin)
    updateStatus: async (id, status) => {
        const response = await api.put(`/appointments/${id}/status`, { status });
        return response.data.data.appointment;
    },

    // Mark appointment as arrived (admin)
    markArrived: async (id) => {
        const response = await api.put(`/appointments/${id}/arrived`);
        return response.data.data.appointment;
    }
};
