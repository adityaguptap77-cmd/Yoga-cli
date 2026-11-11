/** SQLite schema. Every statement is idempotent, so it runs on each start. */
const SCHEMA = `
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  interest TEXT NOT NULL DEFAULT '',
  level TEXT NOT NULL DEFAULT '',
  mode TEXT NOT NULL DEFAULT '',
  preferred_time TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'new',
  notes TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL DEFAULT 'website',
  ip TEXT NOT NULL DEFAULT '',
  user_agent TEXT NOT NULL DEFAULT '',
  email_user_sent INTEGER NOT NULL DEFAULT 0,
  email_admin_sent INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at);

CREATE TABLE IF NOT EXISTS blogs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  content_md TEXT NOT NULL DEFAULT '',
  content_html TEXT NOT NULL DEFAULT '',
  cover_image TEXT NOT NULL DEFAULT '',
  cover_alt TEXT NOT NULL DEFAULT '',
  meta_title TEXT NOT NULL DEFAULT '',
  meta_description TEXT NOT NULL DEFAULT '',
  keywords TEXT NOT NULL DEFAULT '',
  faqs TEXT NOT NULL DEFAULT '[]',
  author TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'General',
  status TEXT NOT NULL DEFAULT 'draft',
  reading_minutes INTEGER NOT NULL DEFAULT 1,
  published_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status, published_at);

CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT '',
  rating INTEGER NOT NULL DEFAULT 5,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  source TEXT NOT NULL DEFAULT 'website',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  csrf TEXT NOT NULL,
  expires_at INTEGER NOT NULL
);
`;

module.exports = { SCHEMA };
