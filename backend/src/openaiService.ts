import { GoogleGenerativeAI } from "@google/generative-ai";

// ここは Gemini 用のキー（AIza...）を .env の GEMINI_API_KEY に入れておいてね
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function getAIReply(history: any) {
  try {
    // モデル名はもっとも標準的な gemini-1.5-flash を使用
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      tools: [
        {
          // 最新の指定方法はこちらです
          // @ts-ignore
          googleSearch: {}, 
        },
      ], // これだけで最新情報を拾いに行きます！
    });

    // 1. システム指示（人格）をオブジェクト形式で定義
    const systemInstruction = {
      role: "system",
      parts: [{
        text: `あなたは旅行コンシェルジュです。✨
【重要ルール】
- 明るくポップな口調（「～だよ！」「～だね！」）で話す。
- 重要な店名や場所は **太字** にする。`
      }],
    };

    // 2. 履歴をGeminiが理解できる形式に変換
    const chatHistory = history.slice(0, -1).map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content[0].text }],
    }));

    // 3. チャット開始
    const chat = model.startChat({
      history: chatHistory,
      systemInstruction: systemInstruction,
    });

    // 4. 送信
    const userMessage = history[history.length - 1].content[0].text;
    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    
    return response.text();

  } catch (error: any) {
    console.error("Gemini API Error:", error.message);
    return "ごめんね、Geminiくんがちょっと疲れちゃったみたい。もう一度送ってみて！";
  }
}