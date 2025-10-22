import api from './api.js';

export const contactService = {
    // Send contact message (public)
    sendMessage: async (data) => {
        const response = await api.post('/contact', data);
        return response.data;
    }
};
