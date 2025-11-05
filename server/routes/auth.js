import express from 'express';
import rateLimit from 'express-rate-limit';
import {
    register,
    login,
    logout,
    getMe,
    updatePassword
} from '../controllers/authController.js';
import { auth, adminAuth } from '../middleware/auth.js';
import {
    validateRegister,
    validateLogin,
    validatePasswordUpdate,
    handleValidationErrors
} from '../utils/validators.js';

const router = express.Router();

// Rate limiting for login attempts
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: {
        success: false,
        message: 'Too many login attempts, please try again later'
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

// Rate limiting for registration
const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 attempts per hour
    message: {
        success: false,
        message: 'Too many registration attempts, please try again later'
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
router.post('/login', loginLimiter, validateLogin, handleValidationErrors, login);
router.post('/logout', logout);

// First admin registration (no auth required if no users exist)
router.post('/register-first-admin', registerLimiter, validateRegister, handleValidationErrors, register);

// Protected routes (require authentication)
router.get('/me', auth, getMe);
router.put('/update-password', auth, validatePasswordUpdate, handleValidationErrors, updatePassword);

// Admin-only routes (require admin authentication)
router.post('/register', registerLimiter, auth, adminAuth, validateRegister, handleValidationErrors, register);

export default router;
