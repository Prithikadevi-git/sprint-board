import Activity from '../models/Activity.js';

export const logActivity = async (action, userId, boardId) => {
  try {
    await Activity.create({ action, user: userId, board: boardId });
  } catch (err) {
    console.error("Activity Log Error:", err);
  }
};