import express from 'express';
import { getProfile, updateProfile, getXpHistory, getStats } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/xp-history', getXpHistory);
router.get('/stats', getStats);

export default router;
