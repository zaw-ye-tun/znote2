import express from 'express';
import { getIdeas, createIdea, updateIdea, deleteIdea } from '../controllers/ideasController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getIdeas);
router.post('/', createIdea);
router.put('/:id', updateIdea);
router.delete('/:id', deleteIdea);

export default router;
