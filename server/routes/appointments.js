import express from 'express';
import rateLimit from 'express-rate-limit';
import {
    getAppointments,
    getAvailableSlots,
    getAppointment,
    createAppointment,
    updateAppointment,
    cancelAppointment,
    updateStatus,
    markArrived
} from '../controllers/appointmentsController.js';
import { auth } from '../middleware/auth.js';
import {
    validateAppointment,
    validateObjectId,
    validatePagination,
    validateDateRange,
    handleValidationErrors
} from '../utils/validators.js';

const router = express.Router();

// Rate limiting for appointment creation
const appointmentLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // 3 appointment attempts per window
    message: {
        success: false,
        message: 'Too many appointment requests, please try again later'
    }
});

// Public routes
router.get('/available-slots', getAvailableSlots);
router.post('/', appointmentLimiter, validateAppointment, handleValidationErrors, createAppointment);
router.delete('/:id', validateObjectId, handleValidationErrors, cancelAppointment);

// Admin routes (require authentication)
router.get('/', auth, validatePagination, validateDateRange, handleValidationErrors, getAppointments);
router.get('/:id', auth, validateObjectId, handleValidationErrors, getAppointment);
router.put('/:id', auth, validateObjectId, handleValidationErrors, updateAppointment);
router.put('/:id/status', auth, validateObjectId, handleValidationErrors, updateStatus);
router.put('/:id/arrived', auth, validateObjectId, handleValidationErrors, markArrived);

export default router;
