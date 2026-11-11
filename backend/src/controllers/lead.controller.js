const leadModel = require('../models/lead.model');
const mailer = require('../services/mailer');
const { validateLead } = require('../utils/validate');

/** Saves the lead first, then sends both emails in the background so the visitor never waits on SMTP. */
exports.submit = (req, res) => {
  const body = req.body || {};

  // Honeypot: real people never fill this field. Pretend success so bots learn nothing.
  if (body.website) return res.json({ ok: true });

  const { ok, errors, data } = validateLead(body);
  if (!ok) return res.status(422).json({ ok: false, message: 'Please fix the highlighted details.', errors });

  const lead = leadModel.create(data, {
    ip: String(req.ip || '').slice(0, 64),
    userAgent: String(req.get('user-agent') || '').slice(0, 300),
  });

  Promise.allSettled([mailer.sendLeadConfirmation(lead), mailer.sendLeadNotification(lead)])
    .then(([user, admin]) => {
      const result = (r) => (r.status === 'fulfilled' ? r.value : { ok: false, error: r.reason && r.reason.message });
      const u = result(user);
      const a = result(admin);
      leadModel.markEmails(lead.id, u.ok, a.ok);
      for (const r of [u, a]) if (!r.ok && !r.skipped) console.error(`[mail] lead #${lead.id}:`, r.error);
    })
    .catch((e) => console.error('[mail] unexpected error', e));

  res.status(201).json({ ok: true, id: lead.id, emailConfigured: mailer.isConfigured() });
};
