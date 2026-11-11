const rateLimit = require('express-rate-limit');

function limiter(windowMs, limit, message) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (req, res) => res.status(429).json({ ok: false, message }),
  });
}

module.exports = {
  leadLimiter: limiter(10 * 60 * 1000, 6, 'Too many requests. Please wait a few minutes and try again.'),
  reviewLimiter: limiter(60 * 60 * 1000, 4, 'Too many reviews from this connection. Please try again later.'),
  loginLimiter: limiter(15 * 60 * 1000, 10, 'Too many sign-in attempts. Please wait 15 minutes and try again.'),
};
