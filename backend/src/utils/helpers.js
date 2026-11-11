const crypto = require('crypto');

/** Turn a title into a URL slug. */
function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '');
}

/** Parse a SQLite datetime ('YYYY-MM-DD HH:MM:SS', UTC) or ISO string into a Date. */
function toDate(value) {
  if (!value) return null;
  const s = String(value);
  const iso = /[zZ]|[+-]\d{2}:?\d{2}$/.test(s) ? s : s.replace(' ', 'T') + 'Z';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

function fmtDate(value, withTime = false) {
  const d = toDate(value);
  if (!d) return '';
  const opts = withTime
    ? { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }
    : { day: 'numeric', month: 'short', year: 'numeric' };
  return new Intl.DateTimeFormat('en-IN', { ...opts, timeZone: 'Asia/Kolkata' }).format(d);
}

function isoDate(value) {
  const d = toDate(value);
  return d ? d.toISOString() : '';
}

function truncate(text, max) {
  const s = String(text || '').replace(/\s+/g, ' ').trim();
  if (s.length <= max) return s;
  return s.slice(0, max - 1).replace(/\s+\S*$/, '') + '…';
}

function escapeXml(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function sha256(text) {
  return crypto.createHash('sha256').update(String(text)).digest('hex');
}

function randomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex');
}

/** Constant-time string comparison that is safe for different lengths. */
function safeEqual(a, b) {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

function readingMinutes(text) {
  const words = String(text || '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Stop spreadsheet apps from executing cell content that starts with a formula character. */
function csvCell(value) {
  let s = String(value ?? '');
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return '"' + s.replace(/"/g, '""') + '"';
}

module.exports = {
  slugify, toDate, fmtDate, isoDate, truncate, escapeXml,
  sha256, randomToken, safeEqual, readingMinutes, csvCell,
};
