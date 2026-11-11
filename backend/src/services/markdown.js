const { marked } = require('marked');
const sanitizeHtml = require('sanitize-html');

const SANITIZE_OPTIONS = {
  allowedTags: [
    'h2', 'h3', 'h4', 'p', 'ul', 'ol', 'li', 'a', 'strong', 'em', 'b', 'i', 'blockquote',
    'img', 'br', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'code', 'pre', 'figure', 'figcaption',
  ],
  allowedAttributes: {
    a: ['href', 'title', 'rel', 'target'],
    img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
    th: ['align'],
    td: ['align'],
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowedSchemesByTag: { img: ['http', 'https'] },
  allowProtocolRelative: false,
  transformTags: {
    a: (tagName, attribs) => {
      const href = attribs.href || '';
      const external = /^https?:\/\//i.test(href);
      return {
        tagName,
        attribs: { ...attribs, ...(external ? { rel: 'noopener noreferrer', target: '_blank' } : {}) },
      };
    },
    img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, loading: 'lazy' } }),
    h1: 'h2',
  },
};

/** Render author-written Markdown to sanitised HTML. */
function renderMarkdown(md) {
  const raw = marked.parse(String(md || ''), { async: false, gfm: true, breaks: false });
  return sanitizeHtml(raw, SANITIZE_OPTIONS);
}

module.exports = { renderMarkdown };
