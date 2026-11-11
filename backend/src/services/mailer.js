const path = require('path');
const ejs = require('ejs');
const nodemailer = require('nodemailer');
const config = require('../config');
const settingsModel = require('../models/settings.model');
const { fmtDate } = require('../utils/helpers');

const TEMPLATE_DIR = path.join(__dirname, '..', 'templates', 'emails');
let transporter = null;

function isConfigured() {
  return Boolean(config.smtp.host && config.smtp.user && config.smtp.pass);
}

function getTransporter() {
  if (!isConfigured()) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: { user: config.smtp.user, pass: config.smtp.pass },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });
  }
  return transporter;
}

function fromAddress() {
  const from = config.smtp.from || config.smtp.user;
  return from.includes('<') ? from : `"${settingsModel.get().site_name}" <${from}>`;
}

function render(template, data) {
  return ejs.renderFile(path.join(TEMPLATE_DIR, `${template}.ejs`), {
    ...data, settings: settingsModel.get(), baseUrl: config.siteUrl, fmtDate,
  });
}

function htmlToText(html) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|tr|h\d|li)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

async function send({ to, subject, template, data, replyTo }) {
  const t = getTransporter();
  if (!t) return { ok: false, skipped: true, error: 'SMTP is not configured' };
  try {
    const html = await render(template, data);
    await t.sendMail({ from: fromAddress(), to, subject, html, text: htmlToText(html), replyTo });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

/** Confirmation to the person who filled in the booking form. */
function sendLeadConfirmation(lead) {
  return send({
    to: lead.email,
    subject: `We received your request, ${lead.name.split(' ')[0]}`,
    template: 'lead-confirmation',
    data: { lead },
    replyTo: settingsModel.get().email || config.notifyTo || undefined,
  });
}

/** Notification to the studio team. */
function sendLeadNotification(lead) {
  const to = config.notifyTo || settingsModel.get().email;
  if (!to) return Promise.resolve({ ok: false, skipped: true, error: 'No NOTIFY_EMAIL / ADMIN_EMAIL set' });
  return send({
    to,
    subject: `New enquiry: ${lead.name} (${lead.interest})`,
    template: 'lead-admin',
    data: { lead },
    replyTo: lead.email,
  });
}

module.exports = { isConfigured, sendLeadConfirmation, sendLeadNotification };
