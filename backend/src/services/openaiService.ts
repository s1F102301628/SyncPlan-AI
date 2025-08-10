import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const getPlanFromAI = async (location: string, date: string) => {
  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: `場所: ${location}, 日付: ${date} のイベントプランを作ってください。`
  });
  return response.output_text;
};
