// models/Question.js
import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  answer: String,
});

export default mongoose.models.Question || mongoose.model("Question", QuestionSchema);
