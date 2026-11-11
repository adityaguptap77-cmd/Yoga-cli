const blogModel = require('../models/blog.model');

const PER_PAGE = 9;

function parseFaqs(json) {
  try {
    const arr = JSON.parse(json || '[]');
    return Array.isArray(arr) ? arr.filter((f) => f && f.q && f.a) : [];
  } catch (_) {
    return [];
  }
}

exports.parseFaqs = parseFaqs;

exports.list = (req, res) => {
  const category = String(req.query.category || '').slice(0, 60);
  const requested = Math.max(1, parseInt(req.query.page, 10) || 1);
  const first = blogModel.listPublished({ category, limit: PER_PAGE, offset: 0 });
  const pages = Math.max(1, Math.ceil(first.total / PER_PAGE));
  const page = Math.min(requested, pages);
  const { total, posts } = page === 1 ? first : blogModel.listPublished({ category, limit: PER_PAGE, offset: (page - 1) * PER_PAGE });
  res.json({ ok: true, posts, categories: blogModel.categories(), category, page, pages, total });
};

exports.bySlug = (req, res) => {
  const post = blogModel.findPublishedBySlug(req.params.slug);
  if (!post) return res.status(404).json({ ok: false, message: 'Post not found.' });
  const { content_md, ...publicPost } = post;
  res.json({ ok: true, post: publicPost, faqs: parseFaqs(post.faqs), related: blogModel.related(post) });
};
