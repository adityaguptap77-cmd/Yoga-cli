const config = require('../../config');
const { credentialsValid, createSession, destroySession } = require('../../middleware/auth');
const leadModel = require('../../models/lead.model');
const reviewModel = require('../../models/review.model');
const mailer = require('../../services/mailer');

function counts() {
  return { leads: leadModel.stats().leadsNew, reviews: reviewModel.pendingCount() };
}

exports.login = (req, res) => {
  const { email, password } = req.body || {};
  if (!credentialsValid(email, password)) {
    return res.status(401).json({ ok: false, message: 'That email and password do not match.' });
  }
  const csrf = createSession(res);
  res.json({ ok: true, csrf, email: config.admin.email });
};

exports.logout = (req, res) => {
  destroySession(req, res);
  res.json({ ok: true });
};

/** Used by the admin app on every page load to confirm the session and fetch the CSRF token. */
exports.me = (req, res) => {
  res.json({
    ok: true,
    email: config.admin.email,
    csrf: req.admin.csrf,
    counts: counts(),
    smtpReady: mailer.isConfigured(),
    notifyTo: config.notifyTo,
    usingDefaultPassword: config.admin.usingDefaultPassword,
  });
};
