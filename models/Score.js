// models/Score.js
import mongoose from "mongoose";

const ScoreSchema = new mongoose.Schema({
  user: String,
  score: Number,
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Score || mongoose.model("Score", ScoreSchema);
