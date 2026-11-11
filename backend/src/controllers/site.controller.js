const settingsModel = require('../models/settings.model');
const blogModel = require('../models/blog.model');
const reviewModel = require('../models/review.model');
const { INTERESTS, LEVELS, MODES, TIMES } = require('../constants/options');
const mailer = require('../services/mailer');
const config = require('../config');

exports.health = (req, res) => {
  res.json({ ok: true, service: 'yovana-yoga-api', email: mailer.isConfigured() ? 'configured' : 'not configured', devDefaultPassword: Boolean(config.admin.usingDefaultPassword) });
};

exports.settings = (req, res) => {
  res.json({ ok: true, settings: settingsModel.get() });
};

exports.formOptions = (req, res) => {
  res.json({ ok: true, interests: INTERESTS, levels: LEVELS, modes: MODES, times: TIMES });
};

/** Everything the frontend needs to build sitemap.xml. */
exports.sitemapData = (req, res) => {
  res.json({ ok: true, posts: blogModel.sitemapEntries() });
};

/** Data for the home page in one call: latest posts and approved reviews. */
exports.home = (req, res) => {
  res.json({ ok: true, posts: blogModel.latest(3), reviews: reviewModel.listApproved(8) });
};
