const reviewModel = require('../models/review.model');
const { validateReview } = require('../utils/validate');

exports.list = (req, res) => {
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 100));
  res.json({ ok: true, reviews: reviewModel.listApproved(limit) });
};

/** Public submissions always start as "pending" until an admin approves them. */
exports.submit = (req, res) => {
  const body = req.body || {};
  if (body.website) return res.json({ ok: true });
  const { ok, errors, data } = validateReview(body);
  if (!ok) return res.status(422).json({ ok: false, message: 'Please fix the highlighted details.', errors });
  reviewModel.create(data, 'pending', 'website');
  res.status(201).json({ ok: true });
};
