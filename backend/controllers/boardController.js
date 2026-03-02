import Activity from '../models/Activity.js';
import Board from '../models/Board.js';
import List from '../models/List.js';
import Card from '../models/Card.js';
import { logActivity } from '../utils/activityLogger.js';

export const getBoardData = async (req, res) => {
  const { id } = req.params;
  const board = await Board.findById(id).populate('members', 'name email avatar');
  if (!board) return res.status(404).json({ message: 'Board not found' });

  const lists = await List.find({ board: id }).sort('order');
  const cards = await Card.find({ board: id }).sort('order');

  res.json({ board, lists, cards });
};

export const createBoard = async (req, res) => {
  const { title } = req.body;
  const board = await Board.create({ title, owner: req.user._id, members: [req.user._id] });
  await logActivity('created the board', req.user._id, board._id);
  res.status(201).json(board);
};
export const getBoards = async (req, res) => {
  try {
    // Find boards where user is either the owner OR a member
    const boards = await Board.find({
      $or: [
        { owner: req.user._id },
        { members: req.user._id }
      ]
    }).sort('-createdAt');
    
    res.json(boards);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
export const getBoardActivity = async (req, res) => {
  try {
    const activities = await Activity.find({ boardId: req.params.id })
      .populate('user', 'name')
      .sort('-createdAt')
      .limit(20);
    
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activity' });
  }
};