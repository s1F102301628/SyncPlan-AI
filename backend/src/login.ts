import express from "express";
import { OAuth2Client } from "google-auth-library";
import path from "path";
// Load runtime CommonJS DB implementation (db.js)
const db = require(path.join(__dirname, "db.js"));
import { createToken, verifyToken } from "./auth";
import { google } from "googleapis";
import syncLikedVideos from "./YoutubeAPI";

const router = express.Router();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || process.env.YOUTUBE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || process.env.YOUTUBE_CLIENT_SECRET;
const CALLBACK_URL = process.env.GOOGLE_OAUTH_CALLBACK || process.env.YOUTUBE_REDIRECT_URI || "http://localhost:3000/auth/google/callback";

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.warn("Google OAuth client ID/secret not set. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env to enable Google login.");
}

const oauth2Client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, CALLBACK_URL);

router.get("/google", (req, res) => {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    return res.status(500).send("Google OAuth is not configured on the server. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env");
  }
  // include redirect_uri explicitly to avoid 'Missing required parameter: redirect_uri'
  // Add YouTube scopes so we can access YouTube data and obtain refresh token for offline access
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "openid",
      "email",
      "profile",
      "https://www.googleapis.com/auth/youtube.readonly",
    ],
    prompt: "consent",
    redirect_uri: CALLBACK_URL,
  });
  res.redirect(url);
});

router.get("/google/callback", async (req, res) => {
  const code = req.query.code as string | undefined;
  if (!code) return res.status(400).send("code missing");
  await handleAuthCode(code, res);
});

// Support legacy redirect path used by some OAuth setups
router.get("/oauth2callback", async (req, res) => {
  const code = req.query.code as string | undefined;
  if (!code) return res.status(400).send("code missing");
  await handleAuthCode(code, res);
});

async function handleAuthCode(code: string, res: express.Response) {
  try {
    const r = await oauth2Client.getToken(code);
    const idToken = r.tokens.id_token;
    if (!idToken) return res.status(400).send("id_token missing");
    const ticket = await oauth2Client.verifyIdToken({ idToken, audience: GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    if (!payload) return res.status(400).send("invalid token payload");

    const googleId = payload.sub as string;
    const email = payload.email || null;
    const name = payload.name || null;

    const user = db.findOrCreateByGoogle(googleId, email, name);

    // Save tokens (access + refresh) to DB for later YouTube API calls
    const accessToken = r.tokens.access_token || null;
    const refreshToken = r.tokens.refresh_token || null;
    const expiryDate = r.tokens.expiry_date || null; // in ms
    db.updateUserTokensById(user.id, accessToken, refreshToken, expiryDate);

    const token = createToken(String(user.id));
    const redirectTo = process.env.FRONTEND_URL || "http://localhost:5173";
    return res.redirect(`${redirectTo}/?token=${token}`);
  } catch (err) {
    console.error(err);
    return res.status(500).send("auth error");
  }
}

router.get("/me", (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: "認証が必要です" });
    const [, token] = auth.split(" ");
    const v = verifyToken(token);
    if (!v.ok) return res.status(401).json({ error: "トークン無効" });
    // token username is user id in this implementation
    return res.json({ userId: v.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "サーバーエラー" });
  }
});

export default router;

// YouTube endpoints using stored tokens
router.get("/youtube/liked", async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: "認証が必要です" });
    const [, token] = auth.split(" ");
    const v = verifyToken(token);
    if (!v.ok) return res.status(401).json({ error: "トークン無効" });

    const user = db.findUserById(v.username);
    if (!user) return res.status(404).json({ error: "ユーザーが見つかりません" });
    if (!user.refresh_token && !user.access_token) return res.status(400).json({ error: "YouTube トークンが保存されていません" });

    const { OAuth2Client } = require('google-auth-library');
    const oauth2 = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, CALLBACK_URL);
    oauth2.setCredentials({
      access_token: user.access_token || undefined,
      refresh_token: user.refresh_token || undefined,
      expiry_date: user.token_expiry || undefined,
    });

    const result = await syncLikedVideos(oauth2, user.id);
    return res.json({ videos: result.videos });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'YouTube API error' });
  }
});
