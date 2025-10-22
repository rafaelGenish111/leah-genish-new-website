import api from './api.js';

export const galleryService = {
    // Get all images (public)
    getImages: async (params = {}) => {
        const response = await api.get('/gallery', { params });
        // API shape: { success, data: { images, pagination } }
        const payload = response?.data?.data || response?.data || {};
        const images = Array.isArray(payload.images) ? payload.images : (Array.isArray(payload) ? payload : []);
        return images;
    },

    // Get single image (public)
    getImage: async (id) => {
        const response = await api.get(`/gallery/${id}`);
        return response.data.data.image;
    },

    // Upload images (admin)
    uploadImages: async (files, data = {}) => {
        const formData = new FormData();

        // Append files
        if (Array.isArray(files)) {
            files.forEach(file => {
                formData.append('images', file);
            });
        } else {
            formData.append('images', files);
        }

        // Append other data
        Object.keys(data).forEach(key => {
            if (data[key] !== null && data[key] !== undefined) {
                formData.append(key, data[key]);
            }
        });

        const response = await api.post('/gallery', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data.images;
    },

    // Update image details (admin)
    updateImage: async (id, data) => {
        const response = await api.put(`/gallery/${id}`, data);
        return response.data.data.image;
    },

    // Delete image (admin)
    deleteImage: async (id) => {
        const response = await api.delete(`/gallery/${id}`);
        return response.data;
    }
};
