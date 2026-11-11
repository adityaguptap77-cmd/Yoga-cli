function notFound(req, res) {
  res.status(404).json({ ok: false, message: 'Not found.' });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  if (status >= 500) console.error(err);
  const message = err.type === 'entity.too.large' ? 'That request was too large.'
    : status >= 500 ? 'Something went wrong. Please try again.'
      : err.message || 'Bad request.';
  res.status(status).json({ ok: false, message });
}

/** Lets controllers be async without try/catch. */
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = { notFound, errorHandler, wrap };
