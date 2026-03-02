import express from 'express';
import { moveCard } from '../controllers/cardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.patch('/:id/move', protect, moveCard);

export default router;