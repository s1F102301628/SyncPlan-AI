import "dotenv/config";
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// 関数の外でクライアントを定義（初期値はnull）
let supabase: SupabaseClient | null = null;

/**
 * 必要な時だけSupabaseクライアントを初期化する関数
 */
function getSupabase() {
    console.log("現在読み込めているキー一覧:", Object.keys(process.env).filter(k => k.includes('SUPABASE')));
  if (supabase) return supabase;

  const url = process.env.SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_KEY || '';

  if (!url || !key) {
    // ここでエラーを投げずに警告を出し、nullのままにしておけばクラッシュを防げる
    console.warn('Supabase configuration missing (SUPABASE_URL/KEY)');
    return null;
  }

  supabase = createClient(url, key);
  return supabase;
}

/**
 * DBから動画リストを取得し、Geminiに投げて旅先提案をもらう
 * @param history フロントエンドから送られてくる会話履歴
 */
export async function getTravelSuggestions(
  appUserId: number, 
  userMessage: string, 
  isFirstMessage: boolean,
  history: { sender: string, text: string }[] = [] // 会話履歴を受け取るように追加
) {
  try {
    const db = getSupabase();
    if (!db) return "Supabaseの接続設定が不足しています。";

    let contextData = "";

    // 1. 初回のみDBから動画履歴を取得
    if (isFirstMessage) {
      const { data: videos, error } = await db
        .from('liked_videos')
        .select('title, channel_title')
        .eq('app_user_id', appUserId)
        .limit(50);

      if (error) throw error;
      if (videos && videos.length > 0) {
        contextData = "【ユーザーのYouTube視聴履歴】\n" + 
          videos.map((v, i) => `${i + 1}. ${v.title}`).join('\n');
      }
    }

    // 2. 過去の会話をテキスト化（Geminiに文脈を教える）
    const conversationHistory = history
      .map(m => `${m.sender === 'user' ? 'ユーザー' : 'あなた'}: ${m.text}`)
      .join('\n');

    // 3. Gemini API 呼び出し（モデル名は安定版の 1.5-flash 推奨）
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    // 2. モデル取得時に「Google Search」を使うためのツール設定を追加します
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

    // 1. 検索クエリを生成するための小さなプロンプト
    const queryGenPrompt = `ユーザーの「${userMessage}」という要望を叶えるために、Google検索で調べるべき具体的なキーワードを、**ユーザーが入力した言葉からのみで**カンマ区切りで出して。`.trim();

    const queryResult = await model.generateContent(queryGenPrompt);
    const searchQueries = queryResult.response.text();

    // --- ステップ2: 検索結果を統合して回答生成 ---
    const finalPrompt = `
Google Search Queries: [${searchQueries}]

【最重要ルール】
- 上記の検索クエリを用いてGoogle検索を行い、実在する具体的な店舗・施設名を必ず挙げてください。
- ユーザーの好み（YouTube履歴）と場所を紐づけて提案してください。

${contextData}

【過去の会話履歴】
${conversationHistory}

【最新の質問】
ユーザー: ${userMessage}
`.trim();

    const result = await model.generateContent(finalPrompt);
    const response = await result.response;

    // 🟢 検索が行われたかチェックするログ
    console.log("--- Gemini ツール使用状況チェック ---");
    const groundings = response.candidates?.[0]?.groundingMetadata;
    if (groundings) {
    console.log("✅ Google検索を使用しました！");
    console.log(searchQueries)
    console.log("参考URL:", JSON.stringify(groundings.searchEntryPoint, null, 2));
    } else {
    console.log("❌ 検索ツールは使用されませんでした（内部知識のみで回答）");
    }
    console.log("------------------------------------");
    return result.response.text();

  } catch (err) {
    console.error('Gemini API Error:', err);
    return "提案の生成中にエラーが発生しました。";
  }
}