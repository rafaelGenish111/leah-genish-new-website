import Article from '../models/Article.js';
import cloudinary from '../config/cloudinary.js';

// Get published articles (public)
export const getPublishedArticles = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Build query
        const query = { published: true };

        // Category filter
        if (req.query.category && req.query.category !== 'all') {
            query.category = req.query.category;
        }

        // Tags filter
        if (req.query.tags) {
            const tags = req.query.tags.split(',');
            query.tags = { $in: tags };
        }

        // Search filter
        if (req.query.search) {
            query.$text = { $search: req.query.search };
        }

        // Sort options
        let sort = { createdAt: -1 }; // Default: newest first
        if (req.query.sort === 'views') {
            sort = { views: -1 };
        } else if (req.query.sort === 'title') {
            sort = { title_he: 1 };
        }

        // Execute query
        const articles = await Article.find(query)
            .populate('author', 'name')
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .select('-content_he -content_en'); // Exclude full content for list view

        const total = await Article.countDocuments(query);
        const pages = Math.ceil(total / limit);

        res.json({
            success: true,
            data: {
                articles,
                pagination: {
                    currentPage: page,
                    totalPages: pages,
                    totalArticles: total,
                    hasNextPage: page < pages,
                    hasPrevPage: page > 1
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get all articles for admin
export const getAdminArticles = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Build query
        const query = {};

        // Status filter
        if (req.query.published !== undefined) {
            query.published = req.query.published === 'true';
        }

        // Category filter
        if (req.query.category && req.query.category !== 'all') {
            query.category = req.query.category;
        }

        // Search filter
        if (req.query.search) {
            query.$text = { $search: req.query.search };
        }

        // Sort options
        let sort = { createdAt: -1 };
        if (req.query.sort === 'views') {
            sort = { views: -1 };
        } else if (req.query.sort === 'title') {
            sort = { title_he: 1 };
        } else if (req.query.sort === 'published') {
            sort = { published: -1, createdAt: -1 };
        }

        // Execute query
        const articles = await Article.find(query)
            .populate('author', 'name')
            .sort(sort)
            .skip(skip)
            .limit(limit);

        const total = await Article.countDocuments(query);
        const pages = Math.ceil(total / limit);

        res.json({
            success: true,
            data: {
                articles,
                pagination: {
                    currentPage: page,
                    totalPages: pages,
                    totalArticles: total,
                    hasNextPage: page < pages,
                    hasPrevPage: page > 1
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get single article
export const getArticle = async (req, res, next) => {
    try {
        const article = await Article.findById(req.params.id)
            .populate('author', 'name');

        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article not found'
            });
        }

        // Check if article is published or user is authenticated
        if (!article.published && !req.user) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Article is not published.'
            });
        }

        res.json({
            success: true,
            data: { article }
        });
    } catch (error) {
        next(error);
    }
};

// Create article
export const createArticle = async (req, res, next) => {
    try {
        const articleData = {
            ...req.body,
            author: req.user.id
        };

        // Handle featured image upload
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'leah-genish/articles',
                transformation: [
                    { width: 1200, height: 800, crop: 'limit', quality: 'auto' }
                ]
            });
            articleData.featuredImage = result.secure_url;
        }

        const article = await Article.create(articleData);
        await article.populate('author', 'name');

        res.status(201).json({
            success: true,
            message: 'Article created successfully',
            data: { article }
        });
    } catch (error) {
        next(error);
    }
};

// Update article
export const updateArticle = async (req, res, next) => {
    try {
        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article not found'
            });
        }

        // Check ownership
        if (article.author.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You can only update your own articles.'
            });
        }

        // Handle new featured image upload
        if (req.file) {
            // Delete old image if exists
            if (article.featuredImage) {
                const publicId = article.featuredImage.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(`leah-genish/articles/${publicId}`);
            }

            // Upload new image
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'leah-genish/articles',
                transformation: [
                    { width: 1200, height: 800, crop: 'limit', quality: 'auto' }
                ]
            });
            req.body.featuredImage = result.secure_url;
        }

        const updatedArticle = await Article.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('author', 'name');

        res.json({
            success: true,
            message: 'Article updated successfully',
            data: { article: updatedArticle }
        });
    } catch (error) {
        next(error);
    }
};

// Delete article
export const deleteArticle = async (req, res, next) => {
    try {
        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article not found'
            });
        }

        // Check ownership
        if (article.author.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You can only delete your own articles.'
            });
        }

        // Delete featured image if exists
        if (article.featuredImage) {
            const publicId = article.featuredImage.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`leah-genish/articles/${publicId}`);
        }

        await Article.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Article deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Publish/unpublish article
export const publishArticle = async (req, res, next) => {
    try {
        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article not found'
            });
        }

        // Check ownership
        if (article.author.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You can only publish/unpublish your own articles.'
            });
        }

        article.published = !article.published;
        await article.save();

        res.json({
            success: true,
            message: `Article ${article.published ? 'published' : 'unpublished'} successfully`,
            data: { article }
        });
    } catch (error) {
        next(error);
    }
};

// Increment view count
export const incrementViews = async (req, res, next) => {
    try {
        const article = await Article.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { new: true }
        );

        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article not found'
            });
        }

        res.json({
            success: true,
            data: { views: article.views }
        });
    } catch (error) {
        next(error);
    }
};
