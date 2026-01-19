import crypto from "crypto";

const TOKEN_SECRET = process.env.AUTH_TOKEN_SECRET || "dev-secret-change-me";
const TOKEN_EXPIRE_SECS = 60 * 60 * 24 * 7; // 7 days

function base64url(input: Buffer | string) {
  return Buffer.from(input).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function sign(payload: string) {
  return crypto.createHmac("sha256", TOKEN_SECRET).update(payload).digest("hex");
}

export function createToken(username: string) {
  const exp = Math.floor(Date.now() / 1000) + TOKEN_EXPIRE_SECS;
  const payload = JSON.stringify({ username, exp });
  const b = base64url(Buffer.from(payload));
  const sig = sign(b);
  return `${b}.${sig}`;
}

export function verifyToken(token: string): { ok: boolean; username?: string } {
  try {
    const [b, sig] = token.split(".");
    if (!b || !sig) return { ok: false };
    const expected = sign(b);
    if (!crypto.timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(sig, "hex"))) return { ok: false };
    const payload = JSON.parse(Buffer.from(b, "base64").toString("utf-8"));
    if (payload.exp < Math.floor(Date.now() / 1000)) return { ok: false };
    return { ok: true, username: payload.username };
  } catch (err) {
    return { ok: false };
  }
}
