const db = require('../db');

function create(data, meta) {
  const info = db.prepare(`
    INSERT INTO leads (name, phone, email, interest, level, mode, preferred_time, message, ip, user_agent)
    VALUES (@name, @phone, @email, @interest, @level, @mode, @preferred_time, @message, @ip, @user_agent)
  `).run({ ...data, ip: meta.ip, user_agent: meta.userAgent });
  return findById(info.lastInsertRowid);
}

function findById(id) {
  return db.prepare('SELECT * FROM leads WHERE id = ?').get(id);
}

function markEmails(id, userSent, adminSent) {
  db.prepare('UPDATE leads SET email_user_sent = ?, email_admin_sent = ? WHERE id = ?').run(userSent ? 1 : 0, adminSent ? 1 : 0, id);
}

function whereClause({ status, q }) {
  const where = [];
  const params = [];
  if (status) { where.push('status = ?'); params.push(status); }
  if (q) {
    where.push("(name LIKE ? ESCAPE '\\' OR email LIKE ? ESCAPE '\\' OR phone LIKE ? ESCAPE '\\')");
    const like = `%${q.replace(/[\\%_]/g, (c) => '\\' + c)}%`;
    params.push(like, like, like);
  }
  return { clause: where.length ? 'WHERE ' + where.join(' AND ') : '', params };
}

function count(filter) {
  const { clause, params } = whereClause(filter);
  return db.prepare(`SELECT COUNT(*) AS n FROM leads ${clause}`).get(...params).n;
}

function list(filter, limit, offset) {
  const { clause, params } = whereClause(filter);
  return db.prepare(`SELECT * FROM leads ${clause} ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?`).all(...params, limit, offset);
}

function all(filter) {
  const { clause, params } = whereClause(filter);
  return db.prepare(`SELECT * FROM leads ${clause} ORDER BY created_at DESC, id DESC`).all(...params);
}

function countsByStatus() {
  return Object.fromEntries(db.prepare('SELECT status, COUNT(*) AS n FROM leads GROUP BY status').all().map((r) => [r.status, r.n]));
}

function update(id, status, notes) {
  return db.prepare("UPDATE leads SET status = ?, notes = ?, updated_at = datetime('now') WHERE id = ?").run(status, notes, id).changes;
}

function remove(id) {
  return db.prepare('DELETE FROM leads WHERE id = ?').run(id).changes;
}

function stats() {
  const n = (sql) => db.prepare(sql).get().n;
  return {
    leadsTotal: n('SELECT COUNT(*) AS n FROM leads'),
    leadsNew: n("SELECT COUNT(*) AS n FROM leads WHERE status = 'new'"),
    leadsWeek: n("SELECT COUNT(*) AS n FROM leads WHERE created_at >= datetime('now', '-7 days')"),
  };
}

function recent(limit) {
  return db.prepare('SELECT * FROM leads ORDER BY created_at DESC, id DESC LIMIT ?').all(limit);
}

module.exports = { create, findById, markEmails, count, list, all, countsByStatus, update, remove, stats, recent };
