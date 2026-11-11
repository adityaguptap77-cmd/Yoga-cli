const leadModel = require('../../models/lead.model');
const { LEAD_STATUS_VALUES } = require('../../constants/options');
const { clean } = require('../../utils/validate');
const { csvCell, fmtDate } = require('../../utils/helpers');

const PER_PAGE = 25;

function filterFrom(query) {
  return {
    status: LEAD_STATUS_VALUES.includes(query.status) ? query.status : '',
    q: clean(query.q, 80),
  };
}

exports.list = (req, res) => {
  const filter = filterFrom(req.query);
  const total = leadModel.count(filter);
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));
  const page = Math.min(Math.max(1, parseInt(req.query.page, 10) || 1), pages);
  res.json({
    ok: true,
    leads: leadModel.list(filter, PER_PAGE, (page - 1) * PER_PAGE),
    total, page, pages, counts: leadModel.countsByStatus(), ...filter,
  });
};

exports.exportCsv = (req, res) => {
  const rows = leadModel.all(filterFrom(req.query));
  const header = ['ID', 'Received (IST)', 'Name', 'Phone', 'Email', 'Class', 'Level', 'Format', 'Preferred time', 'Message', 'Status', 'Notes'];
  const lines = [header.map(csvCell).join(',')];
  for (const r of rows) {
    lines.push([r.id, fmtDate(r.created_at, true), r.name, r.phone, r.email, r.interest, r.level, r.mode, r.preferred_time, r.message, r.status, r.notes]
      .map(csvCell).join(','));
  }
  res.set('Content-Type', 'text/csv; charset=utf-8');
  res.set('Content-Disposition', `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`);
  res.send('﻿' + lines.join('\r\n') + '\r\n');
};

exports.update = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const status = LEAD_STATUS_VALUES.includes(req.body.status) ? req.body.status : null;
  if (!status) return res.status(422).json({ ok: false, message: 'Choose a valid status.' });
  if (!leadModel.update(id, status, clean(req.body.notes, 2000))) return res.status(404).json({ ok: false, message: 'That lead no longer exists.' });
  res.json({ ok: true, message: 'Lead updated.' });
};

exports.remove = (req, res) => {
  leadModel.remove(parseInt(req.params.id, 10));
  res.json({ ok: true, message: 'Lead deleted.' });
};
