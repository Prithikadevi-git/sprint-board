import express from 'express';
import { getBoards, createBoard, getBoardData, getBoardActivity } from '../controllers/boardController.js';
import { protect } from '../middleware/authMiddleware.js';
// Make sure these paths match your folder structure exactly!
import List from '../models/List.js';
import Activity from '../models/Activity.js';

const router = express.Router();

// 1. Base routes for /api/boards
router.route('/')
    .get(protect, getBoards)
    .post(protect, createBoard);

// 2. Specific board data and activity
router.get('/:id', protect, getBoardData);
router.get('/:id/activity', protect, getBoardActivity); 

// 3. Add list to a specific board

// Changed 'authMiddleware' to 'protect' to match your import abovev
router.post('/:id/lists', protect, async (req, res) => {
  try {
    const { title } = req.body;
    const boardId = req.params.id;

    // 1. Create the new list
    const newList = await List.create({
      title,
      board: boardId, // CHANGED THIS from boardId: boardId
      order: 0 
    });

    // 2. Log activity
    const userId = req.user?._id || req.user?.id;
    if (userId) {
      await Activity.create({
        board: boardId, // Check if your Activity schema also uses 'board' instead of 'boardId'
        user: userId,
        action: `created list "${title}"`
      });
    }

    res.status(201).json(newList);
  } catch (err) {
    console.error("Error creating list:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

export default router;