import express from 'express';
import {
    getPublishedArticles,
    getAdminArticles,
    getArticle,
    createArticle,
    updateArticle,
    deleteArticle,
    publishArticle,
    incrementViews
} from '../controllers/articlesController.js';
import { auth, optionalAuth } from '../middleware/auth.js';
import { uploadSingle, handleUploadError } from '../middleware/upload.js';
import {
    validateArticle,
    validateObjectId,
    validatePagination,
    handleValidationErrors
} from '../utils/validators.js';

const router = express.Router();

// Public routes
router.get('/', validatePagination, handleValidationErrors, getPublishedArticles);
router.get('/:id', validateObjectId, handleValidationErrors, optionalAuth, getArticle);
router.post('/:id/increment-views', validateObjectId, handleValidationErrors, incrementViews);

// Admin routes (require authentication)
router.get('/admin/all', auth, validatePagination, handleValidationErrors, getAdminArticles);
router.post('/', auth, uploadSingle, handleUploadError, validateArticle, handleValidationErrors, createArticle);
router.put('/:id', auth, validateObjectId, handleValidationErrors, uploadSingle, handleUploadError, validateArticle, handleValidationErrors, updateArticle);
router.delete('/:id', auth, validateObjectId, handleValidationErrors, deleteArticle);
router.put('/:id/publish', auth, validateObjectId, handleValidationErrors, publishArticle);

export default router;
