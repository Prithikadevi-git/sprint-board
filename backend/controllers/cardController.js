import Card from '../models/Card.js';
import { logActivity } from '../utils/activityLogger.js';

export const moveCard = async (req, res) => {
  const { id } = req.params;
  const { newListId, newOrder } = req.body;

  try {
    const card = await Card.findById(id);
    if (!card) return res.status(404).json({ message: 'Card not found' });

    const oldListId = card.list;
    card.list = newListId;
    card.order = newOrder;
    await card.save();

    // Log the move for the Activity Panel
    if (oldListId.toString() !== newListId.toString()) {
      await logActivity(`moved card "${card.title}" to a new list`, req.user._id, card.board);
    }

    res.json(card);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};