import api from './api.js';

export const articlesService = {
    // Get published articles (public)
    getPublishedArticles: async (params = {}) => {
        const response = await api.get('/articles', { params });
        return response.data.data;
    },

    // Get all articles for admin
    getAdminArticles: async (params = {}) => {
        const response = await api.get('/articles/admin/all', { params });
        return response.data.data;
    },

    // Get single article
    getArticle: async (id) => {
        const response = await api.get(`/articles/${id}`);
        return response.data.data.article;
    },

    // Create article (admin)
    createArticle: async (data) => {
        const formData = new FormData();

        // Append all fields
        Object.keys(data).forEach(key => {
            if (key === 'tags' && Array.isArray(data[key])) {
                formData.append(key, JSON.stringify(data[key]));
            } else if (data[key] !== null && data[key] !== undefined) {
                formData.append(key, data[key]);
            }
        });

        const response = await api.post('/articles', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data.article;
    },

    // Update article (admin)
    updateArticle: async (id, data) => {
        const formData = new FormData();

        // Append all fields
        Object.keys(data).forEach(key => {
            if (key === 'tags' && Array.isArray(data[key])) {
                formData.append(key, JSON.stringify(data[key]));
            } else if (data[key] !== null && data[key] !== undefined) {
                formData.append(key, data[key]);
            }
        });

        const response = await api.put(`/articles/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data.article;
    },

    // Delete article (admin)
    deleteArticle: async (id) => {
        const response = await api.delete(`/articles/${id}`);
        return response.data;
    },

    // Publish/unpublish article (admin)
    publishArticle: async (id) => {
        const response = await api.put(`/articles/${id}/publish`);
        return response.data.data.article;
    },

    // Increment view count (public)
    incrementViews: async (id) => {
        const response = await api.post(`/articles/${id}/increment-views`);
        return response.data.data.views;
    }
};
