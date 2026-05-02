import mongoose from 'mongoose';

const quizScoreSchema = new mongoose.Schema(
  {
    playerName: { type: String, default: 'Anonymous' },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, default: 10 },
    percentage: { type: Number, required: true },
    answers: [
      {
        questionIndex: Number,
        selected: Number,
        correct: Number,
        isCorrect: Boolean,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('QuizScore', quizScoreSchema);
