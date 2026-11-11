const blogModel = require('../../models/blog.model');
const settingsModel = require('../../models/settings.model');
const { saveImage, removeUpload } = require('../../middleware/upload');
const { renderMarkdown } = require('../../services/markdown');
const { slugify, readingMinutes } = require('../../utils/helpers');
const { clean } = require('../../utils/validate');
const { parseFaqs } = require('../blog.controller');

const nowSql = () => new Date().toISOString().replace('T', ' ').slice(0, 19);
const asArray = (v) => (v === undefined || v === null ? [] : Array.isArray(v) ? v : [v]);

/** FAQs arrive either as a JSON array (faqs) or as repeated faq_q / faq_a form fields. */
function readFaqs(body, errors) {
  let pairs = [];
  if (body.faqs) {
    try { pairs = JSON.parse(body.faqs); } catch (_) { errors.push('FAQs could not be read.'); }
  } else {
    const qs = asArray(body.faq_q);
    const as = asArray(body.faq_a);
    pairs = qs.map((q, i) => ({ q, a: as[i] }));
  }
  const faqs = [];
  (Array.isArray(pairs) ? pairs : []).slice(0, 12).forEach((p, i) => {
    const q = clean(p && p.q, 220);
    const a = clean(p && p.a, 1200);
    if (q && a) faqs.push({ q, a });
    else if (q || a) errors.push(`FAQ ${i + 1} needs both a question and an answer.`);
  });
  return faqs;
}

/** Validate the blog form. Returns { data, errors }. */
function readForm(body, ignoreId = 0) {
  const errors = [];
  const title = clean(body.title, 140);
  if (title.length < 3) errors.push('Add a title (at least 3 characters).');

  const content_md = String(body.content_md || '').slice(0, 200000);
  const status = body.status === 'published' ? 'published' : 'draft';
  if (status === 'published' && content_md.trim().length < 20) errors.push('Add some article content before publishing.');

  const faqs = readFaqs(body, errors);
  const site = settingsModel.get().site_name;
  const data = {
    title,
    slug: blogModel.uniqueSlug(slugify(body.slug) || slugify(title), ignoreId),
    excerpt: clean(body.excerpt, 320),
    content_md,
    content_html: renderMarkdown(content_md),
    cover_alt: clean(body.cover_alt, 160),
    meta_title: clean(body.meta_title, 120),
    meta_description: clean(body.meta_description, 320),
    keywords: clean(body.keywords, 240),
    faqs: JSON.stringify(faqs),
    author: clean(body.author, 80) || `${site} Team`,
    category: clean(body.category, 40) || 'General',
    status,
    reading_minutes: readingMinutes(content_md),
  };
  return { data, errors };
}

const withFaqs = (post) => ({ ...post, faqs: parseFaqs(post.faqs) });

exports.list = (req, res) => {
  res.json({ ok: true, blogs: blogModel.listAll() });
};

exports.get = (req, res) => {
  const post = blogModel.findById(parseInt(req.params.id, 10));
  if (!post) return res.status(404).json({ ok: false, message: 'Post not found.' });
  res.json({ ok: true, post: withFaqs(post), related: blogModel.latest(3, post.id) });
};

exports.create = (req, res) => {
  const { data, errors } = readForm(req.body);
  const img = saveImage(req.file);
  if (img.error) errors.push(img.error);
  if (errors.length) {
    if (img.path) removeUpload(img.path);
    return res.status(422).json({ ok: false, message: errors[0], errors });
  }
  const post = blogModel.create({
    ...data,
    cover_image: img.path || '',
    published_at: data.status === 'published' ? nowSql() : null,
  });
  res.status(201).json({
    ok: true, post: withFaqs(post),
    message: data.status === 'published' ? 'Post published. It is now live and in the sitemap.' : 'Draft saved.',
  });
};

exports.update = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const existing = blogModel.findById(id);
  if (!existing) return res.status(404).json({ ok: false, message: 'Post not found.' });

  const { data, errors } = readForm(req.body, id);
  const img = saveImage(req.file);
  if (img.error) errors.push(img.error);
  if (errors.length) {
    if (img.path) removeUpload(img.path);
    return res.status(422).json({ ok: false, message: errors[0], errors });
  }

  let cover = existing.cover_image;
  if (img.path) cover = img.path;
  else if (req.body.remove_cover === '1' || req.body.remove_cover === 'true') cover = '';
  if (cover !== existing.cover_image) removeUpload(existing.cover_image);

  const publishedAt = data.status === 'published' && !existing.published_at ? nowSql() : existing.published_at;
  const post = blogModel.update(id, { ...data, cover_image: cover, published_at: publishedAt });
  res.json({
    ok: true, post: withFaqs(post),
    message: data.status === 'published' ? 'Changes saved. The live post is updated.' : 'Draft saved.',
  });
};

exports.toggle = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const post = blogModel.findById(id);
  if (!post) return res.status(404).json({ ok: false, message: 'Post not found.' });
  if (post.status === 'published') {
    blogModel.setStatus(id, 'draft', post.published_at);
    return res.json({ ok: true, status: 'draft', message: 'Post unpublished. It is no longer public or in the sitemap.' });
  }
  if (post.content_md.trim().length < 20) return res.status(422).json({ ok: false, message: 'Add some article content before publishing.' });
  blogModel.setStatus(id, 'published', post.published_at || nowSql());
  res.json({ ok: true, status: 'published', message: 'Post published. It is now live and in the sitemap.' });
};

exports.remove = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const post = blogModel.findById(id);
  if (post) {
    blogModel.remove(id);
    removeUpload(post.cover_image);
  }
  res.json({ ok: true, message: 'Post deleted.' });
};
