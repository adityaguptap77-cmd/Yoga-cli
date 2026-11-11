const db = require('../db');

/** Editable from Admin > Settings. Everything here is public, so never put a secret in this list. */
const DEFAULTS = {
  site_name: 'Yovana Yoga',
  tagline: 'Small-batch yoga and breathwork in India',
  city: 'New Delhi',
  region: 'Delhi',
  address: '',
  phone: '',
  whatsapp: '',
  email: '',
  hours: 'Mon to Sat, 6:00 am to 8:30 pm',
  instagram: '',
  youtube: '',
  facebook: '',
  founder_name: 'Yovana',
  founder_title: 'Founder and lead teacher',
  founder_quote: 'Nobody needs to touch their toes. They need to feel what their body is saying.',
  founder_bio:
    'Yovana started teaching in a rented hall with six mats and a rule that still holds: nobody gets lost at the back of the room.\n\nThe classes here are built around breath first and poses second. You will be asked how you slept, where you feel tight, and what you want from your practice before you are asked to move.\n\nThe studio stays small on purpose, so corrections are specific, modifications are normal, and beginners are never made to feel behind.',
  founder_photo: '/img/founder.svg',
};

let cache = null;

function get() {
  if (cache) return cache;
  const rows = db.prepare('SELECT key, value FROM settings').all();
  cache = { ...DEFAULTS, ...Object.fromEntries(rows.map((r) => [r.key, r.value])) };
  return cache;
}

function save(values) {
  const upsert = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value');
  db.transaction((entries) => {
    for (const [k, v] of entries) if (k in DEFAULTS) upsert.run(k, String(v ?? ''));
  })(Object.entries(values));
  cache = null;
}

module.exports = { DEFAULTS, get, save };
