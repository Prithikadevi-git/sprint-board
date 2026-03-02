import List from '../models/List.js';

export const createList = async (req, res) => {
  const { title, boardId, order } = req.body;
  const list = await List.create({ title, board: boardId, order });
  res.status(201).json(list);
};

export const deleteList = async (req, res) => {
  const list = await List.findById(req.params.id);
  await list.deleteOne();
  res.json({ message: 'List removed' });
};