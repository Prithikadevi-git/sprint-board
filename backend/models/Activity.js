import mongoose from 'mongoose';

const activitySchema = mongoose.Schema({
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true }, // e.g., "moved 'Login Task' to Done"
}, { timestamps: true });

export default mongoose.model('Activity', activitySchema);