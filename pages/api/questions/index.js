// pages/api/questions/index.js
import dbConnect from "@/lib/mongodb";
import Question from "@/models/Question";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const questions = await Question.find();
    return res.status(200).json(questions);
  }

  if (req.method === "POST") {
    const { question, options, answer } = req.body;
    const newQuestion = await Question.create({ question, options, answer });
    return res.status(201).json(newQuestion);
  }

  res.status(405).end(); // Method Not Allowed
}
