const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DB_DIR = path.join(__dirname, '..', 'tokens');
const DB_PATH = path.join(DB_DIR, 'users.json');

function ensureDB() {
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify({ users: [], lastId: 0 }, null, 2));
}

// Encryption key for token storage. Provide as hex string (32 bytes -> 64 hex chars) in env DATA_ENC_KEY
const ENC_KEY_HEX = process.env.DATA_ENC_KEY || null;
let ENC_KEY = null;
if (ENC_KEY_HEX && typeof ENC_KEY_HEX === 'string' && ENC_KEY_HEX.length === 64) {
  ENC_KEY = Buffer.from(ENC_KEY_HEX, 'hex');
} else if (ENC_KEY_HEX) {
  console.warn('DATA_ENC_KEY provided but invalid length — tokens will be stored plaintext. Provide 32-byte hex string.');
}

function encryptToken(plain) {
  if (!ENC_KEY || !plain) return plain;
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', ENC_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(String(plain), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return iv.toString('hex') + ':' + tag.toString('hex') + ':' + encrypted.toString('hex');
}

function decryptToken(enc) {
  if (!ENC_KEY || !enc) return enc;
  try {
    const [ivHex, tagHex, dataHex] = String(enc).split(':');
    if (!ivHex || !tagHex || !dataHex) return enc;
    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    const data = Buffer.from(dataHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', ENC_KEY, iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
    return decrypted.toString('utf8');
  } catch (err) {
    console.warn('Failed to decrypt token:', err && err.message);
    return enc;
  }
}

function readDB() {
  ensureDB();
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw);
}

function writeDB(dbobj) {
  ensureDB();
  fs.writeFileSync(DB_PATH, JSON.stringify(dbobj, null, 2));
}

function findUserByGoogleId(googleId) {
  const dbobj = readDB();
  return dbobj.users.find((u) => u.google_id === googleId);
}

function findUserByEmail(email) {
  const dbobj = readDB();
  return dbobj.users.find((u) => u.email === email);
}

function createUserByGoogle(googleId, email, name) {
  const dbobj = readDB();
  const id = dbobj.lastId + 1;
  const user = { id, google_id: googleId, email: email || null, name: name || null, created_at: Math.floor(Date.now() / 1000), access_token: null, refresh_token: null, token_expiry: null };
  dbobj.users.push(user);
  dbobj.lastId = id;
  writeDB(dbobj);
  return user;
}

function findOrCreateByGoogle(googleId, email, name) {
  let u = findUserByGoogleId(googleId);
  if (u) return u;
  if (email) {
    const byEmail = findUserByEmail(email);
    if (byEmail) {
      byEmail.google_id = googleId;
      const dbobj = readDB();
      const idx = dbobj.users.findIndex((x) => x.id === byEmail.id);
      if (idx >= 0) {
        dbobj.users[idx] = byEmail;
        writeDB(dbobj);
      }
      return byEmail;
    }
  }
  return createUserByGoogle(googleId, email, name);
}

function updateUserTokensById(userId, accessToken, refreshToken, expiryDate) {
  const dbobj = readDB();
  const idx = dbobj.users.findIndex((u) => u.id === Number(userId));
  if (idx < 0) return null;
  if (accessToken !== undefined) dbobj.users[idx].access_token = accessToken ? encryptToken(accessToken) : null;
  if (refreshToken !== undefined) dbobj.users[idx].refresh_token = refreshToken ? encryptToken(refreshToken) : null;
  if (expiryDate !== undefined) dbobj.users[idx].token_expiry = expiryDate || null;
  writeDB(dbobj);
  return dbobj.users[idx];
}

function findUserById(id) {
  const dbobj = readDB();
  const u = dbobj.users.find((u) => u.id === Number(id));
  if (!u) return undefined;
  // decrypt tokens before returning
  const copy = Object.assign({}, u);
  try {
    copy.access_token = copy.access_token ? decryptToken(copy.access_token) : null;
    copy.refresh_token = copy.refresh_token ? decryptToken(copy.refresh_token) : null;
  } catch (err) {
    // if decryption fails, return stored values as-is
  }
  return copy;
}

module.exports = { findUserByGoogleId, findUserByEmail, createUserByGoogle, findOrCreateByGoogle, updateUserTokensById, findUserById };
