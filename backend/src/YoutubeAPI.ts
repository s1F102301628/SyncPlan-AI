import "dotenv/config";
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.supabaseUrl || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.supabaseKey || '';
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.warn('Supabase not configured. Set SUPABASE_URL and SUPABASE_SERVICE_KEY to enable saving liked videos.');
}

// 2. 型を明示的に指定する (SupabaseClient 型 または null)
let supabase: SupabaseClient | null = null;

if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
} else {
  console.warn('Supabase not configured. Set SUPABASE_URL and SUPABASE_SERVICE_KEY to enable saving liked videos.');
}

/**
 * ユーザーが「高く評価した動画」を取得してSupabaseに保存する
 * @param oauth2 OAuth2Client with valid credentials
 * @param appUserId アプリ内のユーザーID（liked_videosテーブルと紐づけるため）
 */
export async function syncLikedVideos(oauth2: OAuth2Client, appUserId: number | string) {
  const youtube = google.youtube({ version: 'v3', auth: oauth2 });

  try {
    const response = await youtube.videos.list({
      part: ['snippet', 'contentDetails'],
      myRating: 'like',
      maxResults: 50,
    });

    const videos = response.data.items || [];
    console.log(`${videos.length} liked videos found.`);

    // 常にローカルに保存しておく
    try {
      const outDir = path.join(__dirname, '..', 'tokens');
      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
      const outPath = path.join(outDir, `liked_videos_${String(appUserId)}.json`);
      fs.writeFileSync(outPath, JSON.stringify({ fetched_at: new Date().toISOString(), videos }, null, 2), 'utf8');
      console.log('Saved liked videos to', outPath);
    } catch (e) {
      console.warn('Failed to save liked videos locally:', e && (e as Error).message);
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      console.warn('Supabase not configured — skipping remote save.');
      return { videos };
    }

    if (!supabase) {
      console.warn('Supabase client not initialized — skipping remote save.');
      return { videos };
    }

    // Prepare rows for bulk upsert
    const rows: any[] = [];
    for (const video of videos) {
      const id = (video as any).id;
      const snippet = (video as any).snippet;
      if (!id || !snippet) continue;

      rows.push({
        video_id: id,
        title: snippet.title || null,
        description: snippet.description || null,
        channel_title: snippet.channelTitle || null,
        published_at: snippet.publishedAt ? new Date(snippet.publishedAt).toISOString() : null,
        created_at: new Date().toISOString(),
        app_user_id: typeof appUserId === 'number' ? appUserId : String(appUserId),
      });
    }

    if (rows.length === 0) return { videos };

    // Try bulk upsert including app_user_id. If the table doesn't have that column,
    // fall back to upserting without app_user_id to maintain compatibility.
    try {
      const { error } = await supabase.from('liked_videos').upsert(rows, { onConflict: 'video_id' });
      if (error) {
        // If the error mentions unknown column, retry without app_user_id
        const msg = (error && (error.message || '')).toString();
        if (/column .*app_user_id/i.test(msg) || /unknown column/i.test(msg)) {
          const rowsNoUser = rows.map(r => {
            const { app_user_id, ...rest } = r;
            return rest;
          });
          const { error: e2 } = await supabase.from('liked_videos').upsert(rowsNoUser, { onConflict: 'video_id' });
          if (e2) console.error('Supabase upsert fallback error:', e2.message);
        } else {
          console.error('Supabase upsert error:', error.message);
        }
      }
    } catch (e) {
      console.error('Supabase upsert thrown error:', e && (e as Error).message);
    }

    return { videos };
  } catch (err) {
    console.error('YouTube API error:', err);
    throw err;
  }
}

export default syncLikedVideos;