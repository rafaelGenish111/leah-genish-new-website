import express from 'express';
import {
    getImages,
    getImage,
    uploadImages,
    updateImage,
    deleteImage
} from '../controllers/galleryController.js';
import { auth } from '../middleware/auth.js';
import { uploadMultiple, handleUploadError } from '../middleware/upload.js';
import {
    validateImage,
    validateObjectId,
    validatePagination,
    handleValidationErrors
} from '../utils/validators.js';

const router = express.Router();

// Public routes
router.get('/', validatePagination, handleValidationErrors, getImages);
router.get('/:id', validateObjectId, handleValidationErrors, getImage);

// Admin routes (require authentication)
router.post('/', auth, uploadMultiple, handleUploadError, validateImage, handleValidationErrors, uploadImages);
router.put('/:id', auth, validateObjectId, handleValidationErrors, validateImage, handleValidationErrors, updateImage);
router.delete('/:id', auth, validateObjectId, handleValidationErrors, deleteImage);

export default router;
