import express from 'express';
import { auth, adminAuth } from '../middleware/auth.js';
import { getAdminStats } from '../controllers/adminStatsController.js';

const router = express.Router();

// Admin statistics dashboard
router.get('/stats', auth, adminAuth, getAdminStats);

export default router;


