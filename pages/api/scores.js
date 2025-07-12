// pages/api/scores.js
import dbConnect from "@/lib/mongodb";
import Score from "@/models/Score";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    const { user, score } = req.body;
    const saved = await Score.create({ user, score });
    return res.status(201).json(saved);
  }

  if (req.method === "GET") {
    const scores = await Score.find().sort({ date: -1 });
    return res.status(200).json(scores);
  }

  res.status(405).end();
}
