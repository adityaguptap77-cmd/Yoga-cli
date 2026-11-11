const { INTERESTS, LEVELS, MODES, TIMES } = require('../constants/options');

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[A-Za-z]{2,}$/;
const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M}\s.'’-]{1,79}$/u;

function clean(value, max) {
  return String(value ?? '')
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '')
    .trim()
    .slice(0, max);
}

/** Normalise an Indian mobile number to 10 digits, or return '' if invalid. */
function normalisePhone(input) {
  let digits = String(input || '').replace(/[^\d+]/g, '');
  digits = digits.replace(/^\+?91/, '').replace(/^0+/, '');
  return /^[6-9]\d{9}$/.test(digits) ? digits : '';
}

function validateLead(body = {}) {
  const errors = {};
  const data = {
    name: clean(body.name, 80).replace(/\s+/g, ' '),
    phone: '',
    email: clean(body.email, 120).toLowerCase(),
    interest: clean(body.interest, 60),
    level: clean(body.level, 40),
    mode: clean(body.mode, 40),
    preferred_time: clean(body.preferred_time, 40),
    message: clean(body.message, 600),
  };

  if (!NAME_RE.test(data.name)) errors.name = 'Please enter your name (letters only, at least 2 characters).';

  data.phone = normalisePhone(body.phone);
  if (!data.phone) errors.phone = 'Enter a valid 10-digit Indian mobile number.';

  if (!EMAIL_RE.test(data.email) || data.email.length > 120) errors.email = 'Enter a valid email address.';

  if (!INTERESTS.includes(data.interest)) errors.interest = 'Choose a class from the list.';
  if (!LEVELS.includes(data.level)) errors.level = 'Choose your experience level.';
  if (!MODES.includes(data.mode)) errors.mode = 'Choose how you would like to attend.';
  if (!TIMES.includes(data.preferred_time)) errors.preferred_time = 'Choose a preferred time.';

  const consent = body.consent === true || body.consent === 'true' || body.consent === 'on' || body.consent === '1';
  if (!consent) errors.consent = 'Please agree so we can contact you about your class.';

  return { ok: Object.keys(errors).length === 0, errors, data };
}

function validateReview(body = {}) {
  const errors = {};
  const data = {
    name: clean(body.name, 60).replace(/\s+/g, ' '),
    city: clean(body.city, 60),
    rating: parseInt(body.rating, 10),
    body: clean(body.body, 700),
  };
  if (!NAME_RE.test(data.name)) errors.name = 'Please enter your name.';
  if (!(data.rating >= 1 && data.rating <= 5)) errors.rating = 'Choose a rating from 1 to 5.';
  if (data.body.length < 20) errors.body = 'Please write at least a couple of sentences (20+ characters).';
  return { ok: Object.keys(errors).length === 0, errors, data };
}

module.exports = { validateLead, validateReview, normalisePhone, clean, EMAIL_RE };
