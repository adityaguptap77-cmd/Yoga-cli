const express = require('express');
const site = require('../controllers/site.controller');
const blogs = require('../controllers/blog.controller');
const leads = require('../controllers/lead.controller');
const reviews = require('../controllers/review.controller');
const { leadLimiter, reviewLimiter } = require('../middleware/rateLimit');

const router = express.Router();

router.get('/health', site.health);
router.get('/settings', site.settings);
router.get('/form-options', site.formOptions);
router.get('/home', site.home);
router.get('/sitemap-data', site.sitemapData);

router.get('/blogs', blogs.list);
router.get('/blogs/:slug', blogs.bySlug);

router.get('/reviews', reviews.list);
router.post('/reviews', reviewLimiter, express.json({ limit: '10kb' }), reviews.submit);

router.post('/leads', leadLimiter, express.json({ limit: '20kb' }), leads.submit);

module.exports = router;
