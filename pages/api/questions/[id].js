// pages/api/questions/[id].js
import dbConnect from "@/lib/mongodb";
import Question from "@/models/Question";

export default async function handler(req, res) {
  await dbConnect();

  const { id } = req.query;

  if (req.method === "DELETE") {
    await Question.findByIdAndDelete(id);
    return res.status(204).end();
  }

  res.status(405).end();
}
