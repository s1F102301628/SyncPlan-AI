import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const getPlanFromAI = async (location: string, date: string) => {
//   const response = await client.responses.create({
//     model: "gpt-3.5-turbo",
//     input: `場所: ${location}, 日付: ${date} のイベントプランを作ってください。`
//   });
//   return response.output_text;


////////////////    後で上のコメントアウトに置き換え    ////////////////
    return {
    location,
    date,
    activities: [
      { time: "09:00", activity: "集合" },
      { time: "10:00", activity: "観光開始" },
      { time: "12:00", activity: "ランチ" },
    ]
  };

////////////////////////////////////////////////////////////////////

};
