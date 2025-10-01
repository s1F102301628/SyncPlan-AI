import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getAIReply(history: any) {
  const messages = history.map((m: any) => ({
    role: m.role,
    content: m.content[0].text,
  }));

  const completion = await client.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
  });

  return completion.choices[0].message?.content ?? "AIから返答がありません";
}
