const config = require('../config');
const sessionModel = require('../models/session.model');
const { sha256, randomToken, safeEqual } = require('../utils/helpers');

const COOKIE = 'yy_admin';
const SESSION_HOURS = 12;

function cookieOptions() {
  return { httpOnly: true, sameSite: 'strict', secure: config.isProd, path: '/', maxAge: SESSION_HOURS * 3600 * 1000 };
}

function credentialsValid(email, password) {
  const emailOk = safeEqual(String(email || '').trim().toLowerCase(), config.admin.email);
  const passOk = safeEqual(String(password || ''), config.admin.password);
  return emailOk && passOk;
}

function createSession(res) {
  const token = randomToken(32);
  const csrf = randomToken(16);
  sessionModel.create(sha256(token), csrf, Date.now() + SESSION_HOURS * 3600 * 1000);
  res.cookie(COOKIE, token, cookieOptions());
  return csrf;
}

function destroySession(req, res) {
  const token = req.cookies && req.cookies[COOKIE];
  if (token) sessionModel.remove(sha256(token));
  res.clearCookie(COOKIE, { path: '/' });
}

function loadSession(req) {
  const token = req.cookies && req.cookies[COOKIE];
  return token ? sessionModel.find(sha256(token)) : null;
}

/** Gate for every admin route except login. Answers 401 as JSON so the frontend can redirect. */
function requireAdmin(req, res, next) {
  const session = loadSession(req);
  if (!session) return res.status(401).json({ ok: false, message: 'Please sign in to continue.' });
  req.admin = session;
  next();
}

/** Checks the CSRF token (sent in the X-CSRF-Token header) on state-changing admin requests. */
function verifyCsrf(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const sent = req.get('x-csrf-token') || '';
  if (!req.admin || !sent || !safeEqual(sent, req.admin.csrf)) {
    return res.status(403).json({ ok: false, message: 'Your session token did not match, so nothing was changed. Refresh the page and try again.' });
  }
  next();
}

module.exports = { requireAdmin, verifyCsrf, credentialsValid, createSession, destroySession, loadSession };
