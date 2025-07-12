// pages/api/quiz.js
import dbConnect from "@/lib/mongodb";
import Question from "@/models/Question";

export default async function handler(req, res) {
  await dbConnect();

  try {
    const questions = await Question.find({});
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch questions" });
  }
}
