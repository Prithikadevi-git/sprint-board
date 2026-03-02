import mongoose from 'mongoose';

const cardSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dueDate: { type: Date },
  list: { type: mongoose.Schema.Types.ObjectId, ref: 'List', required: true },
  board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Card', cardSchema);