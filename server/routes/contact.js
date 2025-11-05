import express from 'express';
import rateLimit from 'express-rate-limit';
import { sendContactMessage } from '../controllers/contactController.js';
import {
    validateContact,
    handleValidationErrors
} from '../utils/validators.js';

const router = express.Router();

// Rate limiting for contact messages
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 messages per hour per IP
    message: {
        success: false,
        message: 'Too many contact messages, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipFailedRequests: true,
    keyGenerator: (req) => {
        const xff = req.headers['x-forwarded-for'];
        if (typeof xff === 'string' && xff.length > 0) {
            return xff.split(',')[0].trim();
        }
        if (Array.isArray(xff) && xff.length > 0) {
            return String(xff[0]).split(',')[0].trim();
        }
        return (req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress || 'unknown');
    }
});

// Public routes
router.post('/', contactLimiter, validateContact, handleValidationErrors, sendContactMessage);

export default router;
