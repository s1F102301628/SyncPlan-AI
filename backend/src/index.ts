import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";
import express from "express";
import cors from "cors";
import OpenAI from "openai";

import { getAIReply } from "./openaiService";
import authRouter from "./login";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing in .env");
}

const client = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const app = express();
app.use(express.json());

app.use(cors());
app.use(express.json());

// Auth routes: /auth/register, /auth/login, /auth/me
app.use("/auth", authRouter);

// Legacy OAuth callback redirect (preserve query) so Google Console can use /oauth2callback
app.get("/oauth2callback", (req: Request, res: Response) => {
  const qs = new URLSearchParams(req.query as Record<string, string>).toString();
  const target = "/auth/oauth2callback" + (qs ? `?${qs}` : "");
  res.redirect(302, target);
});

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

/**
 * チャットエンドポイント
 * POST http://localhost:3000/api/chat
 */
app.post('/api/chat', async (req, res) => {
  const { message, userId, isFirstMessage, history } = req.body;

  // ログを出して確認
  console.log("--- 受信データチェック ---");
  console.log("userId:", userId);
  console.log("message:", message);
  console.log("isFirstMessage:", isFirstMessage);
  console.log("history件数:", history?.length || 0);
  console.log("------------------------");

  if (!message || !userId) {
    return res.status(400).json({ error: "messageとuserIdが必要です" });
  }

  try {
    // 1. YouTube履歴に基づいた分析・提案をGeminiから取得
    // ここで SuggestionService を呼び出す
    const aiResponse = await getTravelSuggestions(Number(userId), message, isFirstMessage, history);
    res.json({
      reply: aiResponse
    });

  } catch (error) {
    console.error("Chat API Error:", error);
    res.status(500).json({ error: "サーバー側でエラーが発生しました" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

import { getTravelSuggestions } from './SuggestionService';

/**
 * チャット送信時の処理
 */
app.post('/chat', async (req, res) => {
  const { message, userId } = req.body; // フロントからメッセージとユーザーIDを受け取る

  console.log(`User ${userId} からのメッセージ: ${message}`);

  try {
    // 1. YouTube履歴に基づいたAI提案を取得
    // ※ メッセージ内容に応じて「提案が必要か」を判断するロジックを入れても面白いです
    const aiSuggestion = await getTravelSuggestions(Number(userId), message, true); // trueは初回メッセージの例

    // 2. チャット内容とAIの回答を組み合わせて返却
    res.json({
      userMessage: message,
      aiResponse: aiSuggestion,
      status: "success"
    });
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: "エラーが発生しました" });
  }
});