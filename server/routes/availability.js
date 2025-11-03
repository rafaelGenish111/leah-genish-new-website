import express from 'express';
import {
    getAvailability,
    createAvailability,
    updateAvailability,
    deleteAvailability,
    getExceptions,
    createException,
    updateException,
    deleteException
} from '../controllers/availabilityController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Public route - needed for slot calculation
router.get('/', getAvailability);

// Admin routes (require authentication)
router.post('/', auth, createAvailability);
router.put('/:id', auth, updateAvailability);
router.delete('/:id', auth, deleteAvailability);

// Exception routes
router.get('/exceptions', getExceptions);
router.post('/exceptions', auth, createException);
router.put('/exceptions/:id', auth, updateException);
router.delete('/exceptions/:id', auth, deleteException);

export default router;

