import express from 'express';
import rateLimit from 'express-rate-limit';
import {
    getDeclarations,
    getDeclaration,
    submitDeclaration,
    deleteDeclaration,
    exportPDF
} from '../controllers/healthController.js';
import { auth } from '../middleware/auth.js';
import {
    validateHealthDeclaration,
    validateObjectId,
    validatePagination,
    validateDateRange,
    handleValidationErrors
} from '../utils/validators.js';

const router = express.Router();

// Rate limiting for health declaration submission
const healthDeclarationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 submissions per hour per IP
    message: {
        success: false,
        message: 'Too many health declaration submissions, please try again later'
    }
});

// Public routes
router.post('/', healthDeclarationLimiter, validateHealthDeclaration, handleValidationErrors, submitDeclaration);

// Admin routes (require authentication)
router.get('/', auth, validatePagination, validateDateRange, handleValidationErrors, getDeclarations);
router.get('/:id', auth, validateObjectId, handleValidationErrors, getDeclaration);
router.delete('/:id', auth, validateObjectId, handleValidationErrors, deleteDeclaration);
router.get('/export/:id', auth, validateObjectId, handleValidationErrors, exportPDF);

export default router;
