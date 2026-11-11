/**
 * Inserts the starter blog posts when the blog is empty.
 * Runs automatically on server start, or manually with `npm run seed`.
 */
const blogModel = require('../models/blog.model');
const { renderMarkdown } = require('./markdown');
const { readingMinutes } = require('../utils/helpers');
const { POSTS } = require('../seeds/blog-posts');

function seedBlogs() {
  if (blogModel.countAll() > 0) return 0;
  const base = Date.now();
  POSTS.forEach((p, i) => {
    const publishedAt = new Date(base - (POSTS.length - i) * 4 * 86400000).toISOString().replace('T', ' ').slice(0, 19);
    blogModel.create({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      content_md: p.content_md,
      content_html: renderMarkdown(p.content_md),
      cover_image: p.cover_image,
      cover_alt: p.cover_alt,
      meta_title: p.meta_title,
      meta_description: p.meta_description,
      keywords: p.keywords,
      faqs: JSON.stringify(p.faqs),
      author: 'Yovana Yoga Team',
      category: p.category,
      status: 'published',
      reading_minutes: readingMinutes(p.content_md),
      published_at: publishedAt,
    });
  });
  return POSTS.length;
}

if (require.main === module) {
  const n = seedBlogs();
  console.log(n ? `Seeded ${n} blog posts.` : 'Blogs already exist, nothing seeded.');
}

module.exports = { seedBlogs };
