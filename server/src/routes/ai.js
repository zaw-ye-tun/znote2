import express from 'express';
import { summarize, explain, improve } from '../controllers/aiController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.post('/summarize', summarize);
router.post('/explain', explain);
router.post('/improve', improve);

export default router;
