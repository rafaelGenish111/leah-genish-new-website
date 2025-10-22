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
    }
});

// Public routes
router.post('/', contactLimiter, validateContact, handleValidationErrors, sendContactMessage);

export default router;
