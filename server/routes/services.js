import express from 'express';
import {
    getActiveServices,
    getAllServices,
    getService,
    createService,
    updateService,
    deleteService
} from '../controllers/servicesController.js';
import { auth } from '../middleware/auth.js';
import { uploadSingle, handleUploadError } from '../middleware/upload.js';
import {
    validateService,
    validateObjectId,
    handleValidationErrors
} from '../utils/validators.js';

const router = express.Router();

// Public routes
router.get('/', getActiveServices);
router.get('/:id', validateObjectId, handleValidationErrors, getService);

// Admin routes (require authentication)
router.get('/admin/all', auth, getAllServices);
router.post('/', auth, uploadSingle, handleUploadError, validateService, handleValidationErrors, createService);
router.put('/:id', auth, validateObjectId, handleValidationErrors, uploadSingle, handleUploadError, validateService, handleValidationErrors, updateService);
router.delete('/:id', auth, validateObjectId, handleValidationErrors, deleteService);

export default router;
