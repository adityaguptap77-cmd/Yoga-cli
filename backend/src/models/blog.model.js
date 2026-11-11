const db = require('../db');

const CARD_COLUMNS = 'id, slug, title, excerpt, cover_image, cover_alt, category, reading_minutes, published_at';

/* ---------- Public ---------- */

function listPublished({ category, limit, offset }) {
  const where = category ? "status = 'published' AND category = ?" : "status = 'published'";
  const params = category ? [category] : [];
  const total = db.prepare(`SELECT COUNT(*) AS n FROM blogs WHERE ${where}`).get(...params).n;
  const posts = db.prepare(`SELECT ${CARD_COLUMNS} FROM blogs WHERE ${where} ORDER BY published_at DESC, id DESC LIMIT ? OFFSET ?`)
    .all(...params, limit, offset);
  return { total, posts };
}

function categories() {
  return db.prepare("SELECT DISTINCT category FROM blogs WHERE status = 'published' ORDER BY category").all().map((r) => r.category);
}

function findPublishedBySlug(slug) {
  return db.prepare("SELECT * FROM blogs WHERE slug = ? AND status = 'published'").get(slug);
}

function latest(limit, excludeId = 0) {
  return db.prepare(`SELECT ${CARD_COLUMNS} FROM blogs WHERE status = 'published' AND id != ? ORDER BY published_at DESC, id DESC LIMIT ?`)
    .all(excludeId, limit);
}

function related(post, limit = 3) {
  let rows = db.prepare(`SELECT ${CARD_COLUMNS} FROM blogs WHERE status = 'published' AND id != ? AND category = ? ORDER BY published_at DESC LIMIT ?`)
    .all(post.id, post.category, limit);
  if (rows.length < limit) {
    const have = new Set(rows.map((r) => r.id));
    rows = rows.concat(latest(limit * 2, post.id).filter((r) => !have.has(r.id))).slice(0, limit);
  }
  return rows;
}

function sitemapEntries() {
  return db.prepare("SELECT slug, title, cover_image, updated_at, published_at FROM blogs WHERE status = 'published' ORDER BY published_at DESC").all();
}

/* ---------- Admin ---------- */

function listAll() {
  return db.prepare('SELECT id, slug, title, category, status, published_at, updated_at, cover_image FROM blogs ORDER BY updated_at DESC, id DESC').all();
}

function findById(id) {
  return db.prepare('SELECT * FROM blogs WHERE id = ?').get(id);
}

function uniqueSlug(base, ignoreId = 0) {
  let slug = base || 'post';
  let n = 2;
  const exists = db.prepare('SELECT 1 FROM blogs WHERE slug = ? AND id != ?');
  while (exists.get(slug, ignoreId)) slug = `${base}-${n++}`;
  return slug;
}

function create(data) {
  const info = db.prepare(`
    INSERT INTO blogs (slug, title, excerpt, content_md, content_html, cover_image, cover_alt, meta_title,
      meta_description, keywords, faqs, author, category, status, reading_minutes, published_at)
    VALUES (@slug, @title, @excerpt, @content_md, @content_html, @cover_image, @cover_alt, @meta_title,
      @meta_description, @keywords, @faqs, @author, @category, @status, @reading_minutes, @published_at)
  `).run(data);
  return findById(info.lastInsertRowid);
}

function update(id, data) {
  db.prepare(`
    UPDATE blogs SET slug=@slug, title=@title, excerpt=@excerpt, content_md=@content_md, content_html=@content_html,
      cover_image=@cover_image, cover_alt=@cover_alt, meta_title=@meta_title, meta_description=@meta_description,
      keywords=@keywords, faqs=@faqs, author=@author, category=@category, status=@status,
      reading_minutes=@reading_minutes, published_at=@published_at, updated_at=datetime('now')
    WHERE id=@id
  `).run({ ...data, id });
  return findById(id);
}

function setStatus(id, status, publishedAt) {
  db.prepare("UPDATE blogs SET status = ?, published_at = ?, updated_at = datetime('now') WHERE id = ?").run(status, publishedAt, id);
}

function remove(id) {
  return db.prepare('DELETE FROM blogs WHERE id = ?').run(id).changes;
}

function counts() {
  const n = (status) => db.prepare('SELECT COUNT(*) AS n FROM blogs WHERE status = ?').get(status).n;
  return { published: n('published'), draft: n('draft') };
}

function countAll() {
  return db.prepare('SELECT COUNT(*) AS n FROM blogs').get().n;
}

module.exports = {
  listPublished, categories, findPublishedBySlug, latest, related, sitemapEntries,
  listAll, findById, uniqueSlug, create, update, setStatus, remove, counts, countAll,
};
