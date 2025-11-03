import express from 'express';
import rateLimit from 'express-rate-limit';
import { handleWebhook, syncCalendlyEvents } from '../controllers/calendlyController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Rate limiting for webhook (more lenient for webhooks)
const webhookLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
    message: {
        success: false,
        message: 'Too many webhook requests'
    }
});

// Public webhook route (requires signature verification)
router.post('/webhook', webhookLimiter, handleWebhook);

// Admin only route for manual sync
router.post('/sync', auth, syncCalendlyEvents);

export default router;

