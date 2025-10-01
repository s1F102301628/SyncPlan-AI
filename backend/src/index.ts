import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";
import express from "express";
import cors from "cors";
import OpenAI from "openai";
import { getAIReply } from "./openaiService";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is missing in .env");
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "messageがありません" });

    const reply = await getAIReply(message);
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "サーバーエラーです" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
