const express = require('express');
const { requireAdmin, verifyCsrf } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');
const { loginLimiter } = require('../middleware/rateLimit');
const auth = require('../controllers/admin/auth.controller');
const dashboard = require('../controllers/admin/dashboard.controller');
const leads = require('../controllers/admin/leads.controller');
const blogs = require('../controllers/admin/blogs.controller');
const reviews = require('../controllers/admin/reviews.controller');
const settings = require('../controllers/admin/settings.controller');

const router = express.Router();

router.use((req, res, next) => {
  res.set('X-Robots-Tag', 'noindex, nofollow');
  res.set('Cache-Control', 'no-store');
  next();
});
router.use(express.json({ limit: '1mb' }));

/* Public (no session yet) */
router.post('/login', loginLimiter, auth.login);

/* Everything below needs a valid session, and state-changing calls need the CSRF header. */
router.use(requireAdmin, verifyCsrf);

router.post('/logout', auth.logout);
router.get('/me', auth.me);
router.get('/stats', dashboard.stats);

router.get('/leads', leads.list);
router.get('/leads/export.csv', leads.exportCsv);
router.patch('/leads/:id', leads.update);
router.delete('/leads/:id', leads.remove);

router.get('/blogs', blogs.list);
router.get('/blogs/:id', blogs.get);
router.post('/blogs', uploadSingle('cover'), blogs.create);
router.put('/blogs/:id', uploadSingle('cover'), blogs.update);
router.post('/blogs/:id/toggle', blogs.toggle);
router.delete('/blogs/:id', blogs.remove);

router.get('/reviews', reviews.list);
router.post('/reviews', reviews.create);
router.patch('/reviews/:id/status', reviews.setStatus);
router.delete('/reviews/:id', reviews.remove);

router.get('/settings', settings.get);
router.put('/settings', uploadSingle('founder_photo_file'), settings.update);

module.exports = router;
