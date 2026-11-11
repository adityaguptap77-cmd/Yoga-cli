const db = require('../db');

function listApproved(limit) {
  return db.prepare(`SELECT id, name, city, rating, body, created_at FROM reviews
    WHERE status = 'approved' ORDER BY created_at DESC, id DESC LIMIT ?`).all(limit);
}

function create({ name, city, rating, body }, status = 'pending', source = 'website') {
  return db.prepare('INSERT INTO reviews (name, city, rating, body, status, source) VALUES (?, ?, ?, ?, ?, ?)')
    .run(name, city, rating, body, status, source).lastInsertRowid;
}

function adminList(status) {
  return db.prepare(`SELECT * FROM reviews ${status ? 'WHERE status = ?' : ''}
    ORDER BY CASE status WHEN 'pending' THEN 0 ELSE 1 END, created_at DESC, id DESC`).all(...(status ? [status] : []));
}

function setStatus(id, status) {
  return db.prepare('UPDATE reviews SET status = ? WHERE id = ?').run(status, id).changes;
}

function remove(id) {
  return db.prepare('DELETE FROM reviews WHERE id = ?').run(id).changes;
}

function pendingCount() {
  return db.prepare("SELECT COUNT(*) AS n FROM reviews WHERE status = 'pending'").get().n;
}

module.exports = { listApproved, create, adminList, setStatus, remove, pendingCount };
