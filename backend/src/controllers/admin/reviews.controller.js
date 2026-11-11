const reviewModel = require('../../models/review.model');
const { REVIEW_STATUSES } = require('../../constants/options');
const { clean } = require('../../utils/validate');

exports.list = (req, res) => {
  const filter = REVIEW_STATUSES.includes(req.query.status) ? req.query.status : '';
  res.json({ ok: true, reviews: reviewModel.adminList(filter), filter });
};

/** Reviews added here are real feedback the studio received elsewhere, so they publish immediately. */
exports.create = (req, res) => {
  const name = clean(req.body.name, 60);
  const city = clean(req.body.city, 60);
  const rating = parseInt(req.body.rating, 10);
  const body = clean(req.body.body, 700);
  if (name.length < 2 || body.length < 20 || !(rating >= 1 && rating <= 5)) {
    return res.status(422).json({ ok: false, message: 'Add a name, a rating from 1 to 5 and at least 20 characters of review text.' });
  }
  reviewModel.create({ name, city, rating, body }, 'approved', 'admin');
  res.status(201).json({ ok: true, message: 'Review added and published.' });
};

exports.setStatus = (req, res) => {
  const status = REVIEW_STATUSES.includes(req.body.status) ? req.body.status : null;
  if (!status) return res.status(422).json({ ok: false, message: 'Choose a valid status.' });
  reviewModel.setStatus(parseInt(req.params.id, 10), status);
  const message = status === 'approved' ? 'Review approved and published.' : status === 'hidden' ? 'Review hidden.' : 'Review moved to pending.';
  res.json({ ok: true, message });
};

exports.remove = (req, res) => {
  reviewModel.remove(parseInt(req.params.id, 10));
  res.json({ ok: true, message: 'Review deleted.' });
};
