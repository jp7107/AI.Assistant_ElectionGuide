import mongoose from 'mongoose';

const chatHistorySchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },
    role: { type: String, enum: ['user', 'model'], required: true },
    content: { type: String, required: true },
    userMeta: {
      age: Number,
      state: String,
      firstTimeVoter: Boolean,
    },
  },
  { timestamps: true }
);

export default mongoose.model('ChatHistory', chatHistorySchema);
