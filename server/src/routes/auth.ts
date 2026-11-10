import { Router } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { env } from '../config/env.js';
import { db } from '../database/db.js';
import { COOKIE, requireAuth, setSessionCookie } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { authLimiter, resetLimiter } from '../middleware/limits.js';
import { forgotPasswordSchema, googleLoginSchema, loginSchema, passwordChangeSchema, profileSchema, registerSchema, resetPasswordSchema } from '../validators/schemas.js';
import { sendMail } from '../services/notifications/mail.js';
import { conflict, unauthorized, badRequest } from '../lib/errors.js';
import { audit } from '../lib/audit.js';

export const authRouter = Router();
const DUMMY_HASH = bcrypt.hashSync('dummy-password-for-timing', 10);

function me(userId: number) {
  const u = db.prepare('SELECT id,full_name,email,phone,role,preferred_language,created_at FROM users WHERE id=?').get(userId) as any;
  const org = db.prepare('SELECT id,display_name,status FROM organizers WHERE user_id=?').get(userId) as any;
  const app = db.prepare('SELECT id,status,organizer_name,review_note,created_at FROM organizer_applications WHERE user_id=? ORDER BY id DESC LIMIT 1').get(userId) as any;
  const unread = (db.prepare('SELECT COUNT(*) c FROM notifications WHERE user_id=? AND is_read=0').get(userId) as any).c;
  return { ...u, organizer: org ?? null, application: app ?? null, unread_notifications: unread };
}

authRouter.post('/register', authLimiter, validateBody(registerSchema), (req, res) => {
  const { full_name, email, phone, password, preferred_language } = req.body;
  if (db.prepare('SELECT 1 FROM users WHERE email=?').get(email)) throw conflict('email_taken');
  const hash = bcrypt.hashSync(password, 12);
  // Role is ALWAYS traveler here. Nobody can self-assign organizer/admin.
  const r = db.prepare("INSERT INTO users (full_name,email,phone,password_hash,role,preferred_language) VALUES (?,?,?,?, 'traveler', ?)")
    .run(full_name, email, phone || null, hash, preferred_language || 'rw');
  setSessionCookie(res, Number(r.lastInsertRowid));
  res.status(201).json({ user: me(Number(r.lastInsertRowid)) });
});

authRouter.post('/login', authLimiter, validateBody(loginSchema), (req, res) => {
  const { email, password } = req.body;
  const u = db.prepare('SELECT id,password_hash,is_active,email FROM users WHERE email=?').get(email) as any;
  const ok = bcrypt.compareSync(password, u?.password_hash ?? DUMMY_HASH);
  if (!u || !ok) throw unauthorized('invalid_credentials');
  if (!u.is_active) throw unauthorized('account_disabled');
  setSessionCookie(res, u.id);
  audit(req, { id: u.id, email: u.email }, 'login');
  res.json({ user: me(u.id) });
});

/** Which optional sign-in methods are enabled (the client hides what is not configured). */
authRouter.get('/providers', (_req, res) => { res.json({ google: env.googleClientId || null }); });

interface GoogleIdToken { iss: string; aud: string; sub: string; email?: string; email_verified?: string | boolean; name?: string; exp: string }

/** Verifies a Google Identity Services ID token with Google's tokeninfo endpoint (checks signature + expiry server-side). */
async function verifyGoogleToken(credential: string): Promise<GoogleIdToken | null> {
  try {
    const r = await fetch('https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(credential), { signal: AbortSignal.timeout(8000) });
    if (!r.ok) return null;
    const p = (await r.json()) as GoogleIdToken;
    const issOk = p.iss === 'accounts.google.com' || p.iss === 'https://accounts.google.com';
    const verified = p.email_verified === true || p.email_verified === 'true';
    if (!issOk || p.aud !== env.googleClientId || !verified || !p.email || Number(p.exp) * 1000 < Date.now()) return null;
    return p;
  } catch { return null; }
}

authRouter.post('/google', authLimiter, validateBody(googleLoginSchema), async (req, res, next) => {
  try {
    if (!env.googleClientId) throw badRequest('google_not_configured');
    const g = await verifyGoogleToken(req.body.credential);
    if (!g) throw unauthorized('google_failed');
    const email = g.email!.toLowerCase();
    let u = db.prepare('SELECT id,is_active,email FROM users WHERE email=?').get(email) as any;
    let created = false;
    if (!u) {
      // New accounts are always travelers. A random, unusable password is stored; the user can set one via "Forgot password".
      const hash = bcrypt.hashSync(crypto.randomBytes(32).toString('hex'), 12);
      const name = (g.name || email.split('@')[0]).slice(0, 100);
      const r = db.prepare("INSERT INTO users (full_name,email,password_hash,role,preferred_language) VALUES (?,?,?, 'traveler', ?)")
        .run(name.length >= 2 ? name : email, email, hash, req.body.preferred_language || 'rw');
      u = { id: Number(r.lastInsertRowid), is_active: 1, email };
      created = true;
    }
    if (!u.is_active) throw unauthorized('account_disabled');
    setSessionCookie(res, u.id);
    audit(req, { id: u.id, email: u.email }, created ? 'register_google' : 'login_google');
    res.status(created ? 201 : 200).json({ user: me(u.id), created });
  } catch (e) { next(e); }
});

const RESET_TTL_MIN = 60;
const sha256 = (v: string) => crypto.createHash('sha256').update(v).digest('hex');

authRouter.post('/forgot-password', resetLimiter, validateBody(forgotPasswordSchema), (req, res) => {
  // Always the same response, so this endpoint cannot be used to discover which emails have accounts.
  res.json({ ok: true });
  const u = db.prepare('SELECT id,email,full_name,is_active,preferred_language FROM users WHERE email=?').get(req.body.email) as any;
  if (!u || !u.is_active) return;
  const token = crypto.randomBytes(32).toString('hex');
  db.prepare("UPDATE password_reset_tokens SET used_at=datetime('now') WHERE user_id=? AND used_at IS NULL").run(u.id);
  db.prepare(`INSERT INTO password_reset_tokens (user_id,token_hash,expires_at) VALUES (?,?,datetime('now','+${RESET_TTL_MIN} minutes'))`).run(u.id, sha256(token));
  const link = `${env.clientOrigin.replace(/\/$/, '')}/reset-password?token=${token}`;
  const rw = u.preferred_language === 'rw';
  const subject = rw ? 'Hindura ijambobanga - Explore Rwanda' : 'Reset your password - Explore Rwanda';
  const text = rw
    ? `Muraho ${u.full_name},\n\nKanda kuri iyi link kugira ngo uhindure ijambobanga (imara iminota ${RESET_TTL_MIN}):\n${link}\n\nNiba atari wowe wabisabye, wirengagize ubu butumwa.`
    : `Hello ${u.full_name},\n\nUse this link to choose a new password (valid for ${RESET_TTL_MIN} minutes):\n${link}\n\nIf you did not ask for this, you can ignore this email.`;
  audit(req, { id: u.id, email: u.email }, 'password_reset_requested', 'user', u.id);
  sendMail(u.email, subject, text).catch((e) => console.error('[mail] reset email failed:', e?.message || e));
});

authRouter.post('/reset-password', authLimiter, validateBody(resetPasswordSchema), (req, res) => {
  const row = db.prepare(`SELECT t.id,t.user_id,u.email,u.is_active FROM password_reset_tokens t JOIN users u ON u.id=t.user_id
    WHERE t.token_hash=? AND t.used_at IS NULL AND t.expires_at > datetime('now')`).get(sha256(req.body.token)) as any;
  if (!row) throw badRequest('invalid_token');
  db.transaction(() => {
    db.prepare("UPDATE users SET password_hash=?, updated_at=datetime('now') WHERE id=?").run(bcrypt.hashSync(req.body.password, 12), row.user_id);
    db.prepare("UPDATE password_reset_tokens SET used_at=datetime('now') WHERE user_id=? AND used_at IS NULL").run(row.user_id);
  })();
  audit(req, { id: row.user_id, email: row.email }, 'password_reset', 'user', row.user_id);
  if (row.is_active) setSessionCookie(res, row.user_id);
  res.json({ ok: true, user: row.is_active ? me(row.user_id) : null });
});

authRouter.post('/logout', (_req, res) => { res.clearCookie(COOKIE, { path: '/' }); res.json({ ok: true }); });

authRouter.get('/me', (req, res) => { res.json({ user: req.user ? me(req.user.id) : null }); });

authRouter.put('/profile', requireAuth, validateBody(profileSchema), (req, res) => {
  const { full_name, phone, preferred_language } = req.body;
  db.prepare("UPDATE users SET full_name=?, phone=?, preferred_language=COALESCE(?,preferred_language), updated_at=datetime('now') WHERE id=?")
    .run(full_name, phone || null, preferred_language ?? null, req.user!.id);
  res.json({ user: me(req.user!.id) });
});

authRouter.put('/password', requireAuth, authLimiter, validateBody(passwordChangeSchema), (req, res) => {
  const u = db.prepare('SELECT password_hash FROM users WHERE id=?').get(req.user!.id) as any;
  if (!bcrypt.compareSync(req.body.current_password, u.password_hash)) throw badRequest('wrong_current_password');
  db.prepare("UPDATE users SET password_hash=?, updated_at=datetime('now') WHERE id=?").run(bcrypt.hashSync(req.body.new_password, 12), req.user!.id);
  audit(req, req.user!, 'password_change', 'user', req.user!.id);
  res.json({ ok: true });
});
