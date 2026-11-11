const db = require('../db');

function purgeExpired() {
  db.prepare('DELETE FROM sessions WHERE expires_at < ?').run(Date.now());
}

function create(tokenHash, csrf, expiresAt) {
  purgeExpired();
  db.prepare('INSERT INTO sessions (token_hash, csrf, expires_at) VALUES (?, ?, ?)').run(tokenHash, csrf, expiresAt);
}

function find(tokenHash) {
  const row = db.prepare('SELECT * FROM sessions WHERE token_hash = ?').get(tokenHash);
  return row && row.expires_at >= Date.now() ? row : null;
}

function remove(tokenHash) {
  db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(tokenHash);
}

module.exports = { create, find, remove };
