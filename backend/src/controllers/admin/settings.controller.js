const settingsModel = require('../../models/settings.model');
const { saveImage, removeUpload } = require('../../middleware/upload');
const { clean, EMAIL_RE } = require('../../utils/validate');

exports.get = (req, res) => {
  res.json({ ok: true, settings: settingsModel.get() });
};

exports.update = (req, res) => {
  const b = req.body || {};
  const errors = [];
  const values = {};
  const short = ['site_name', 'tagline', 'city', 'region', 'address', 'phone', 'whatsapp', 'email', 'hours', 'founder_name', 'founder_title', 'founder_quote'];
  for (const k of short) values[k] = clean(b[k], k === 'founder_quote' || k === 'address' ? 300 : 120);
  values.founder_bio = String(b.founder_bio || '').replace(/\r\n/g, '\n').slice(0, 3000).trim();

  for (const k of ['instagram', 'youtube', 'facebook']) {
    const v = clean(b[k], 200);
    if (v && !/^https?:\/\//i.test(v)) errors.push(`${k[0].toUpperCase() + k.slice(1)} link must start with http:// or https://`);
    values[k] = v;
  }
  if (values.email && !EMAIL_RE.test(values.email)) errors.push('Studio email address looks invalid.');
  if (!values.site_name) errors.push('Site name cannot be empty.');
  if (!values.city) errors.push('City cannot be empty.');
  values.whatsapp = values.whatsapp.replace(/[^\d]/g, '').slice(0, 15);

  const current = settingsModel.get();
  const img = saveImage(req.file);
  if (img.error) errors.push(img.error);

  if (errors.length) {
    if (img.path) removeUpload(img.path);
    return res.status(422).json({ ok: false, message: errors[0], errors });
  }

  if (img.path) {
    values.founder_photo = img.path;
    removeUpload(current.founder_photo);
  } else if (b.reset_photo === '1' || b.reset_photo === 'true') {
    values.founder_photo = settingsModel.DEFAULTS.founder_photo;
    removeUpload(current.founder_photo);
  }
  settingsModel.save(values);
  res.json({ ok: true, message: 'Settings saved.', settings: settingsModel.get() });
};
