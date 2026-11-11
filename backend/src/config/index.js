require('dotenv').config({ quiet: true });
const path = require('path');

const root = path.join(__dirname, '..', '..');
const isProd = process.env.NODE_ENV === 'production';
const port = parseInt(process.env.PORT, 10) || 4000;
const siteUrl = (process.env.SITE_URL || 'http://localhost:3000').replace(/\/+$/, '');

const config = {
  root,
  isProd,
  port,
  /** Public address of the website (the frontend). Used for links inside emails. */
  siteUrl,
  /** Browsers allowed to call this API directly. The frontend normally proxies, so this is a safety net. */
  corsOrigins: (process.env.CORS_ORIGINS || siteUrl).split(',').map((s) => s.trim().replace(/\/+$/, '')).filter(Boolean),
  dbPath: process.env.DB_PATH ? path.resolve(root, process.env.DB_PATH) : path.join(root, 'data', 'yovana.db'),
  uploadDir: process.env.UPLOAD_DIR ? path.resolve(root, process.env.UPLOAD_DIR) : path.join(root, 'uploads'),
  admin: {
    email: (process.env.ADMIN_EMAIL || 'admin@example.com').trim().toLowerCase(),
    password: process.env.ADMIN_PASSWORD || '',
    usingDefaultPassword: false,
  },
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: String(process.env.SMTP_SECURE || '').toLowerCase() === 'true',
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || '',
  },
  notifyTo: (process.env.NOTIFY_EMAIL || process.env.ADMIN_EMAIL || '').trim(),
};

if (!config.admin.password) {
  if (isProd) throw new Error('ADMIN_PASSWORD must be set in production (see .env.example).');
  config.admin.password = 'ChangeMe123!';
  config.admin.usingDefaultPassword = true;
}

module.exports = config;
