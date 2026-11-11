const config = require('./config');
const { createApp } = require('./app');
const { seedBlogs } = require('./services/seed.service');
const settingsModel = require('./models/settings.model');
const mailer = require('./services/mailer');

const seeded = seedBlogs();
const app = createApp();

const server = app.listen(config.port, () => {
  console.log(`\n  ${settingsModel.get().site_name} API is running at http://localhost:${config.port}/api`);
  console.log(`  Health check: http://localhost:${config.port}/api/health`);
  console.log(`  Admin sign-in: ${config.admin.email}`);
  if (config.admin.usingDefaultPassword) {
    console.log('  WARNING: ADMIN_PASSWORD is not set, so the default password "ChangeMe123!" is in use. Set one in .env.');
  }
  console.log(`  Email (SMTP): ${mailer.isConfigured() ? 'configured' : 'NOT configured. Leads are saved, but no emails will be sent'}`);
  console.log(`  Website address (for email links and CORS): ${config.siteUrl}`);
  if (seeded) console.log(`  Seeded ${seeded} starter blog posts.`);
  console.log('');
});

function shutdown() {
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 5000).unref();
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
