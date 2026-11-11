const leadModel = require('../../models/lead.model');
const blogModel = require('../../models/blog.model');
const reviewModel = require('../../models/review.model');

exports.stats = (req, res) => {
  const posts = blogModel.counts();
  res.json({
    ok: true,
    stats: {
      ...leadModel.stats(),
      postsPublished: posts.published,
      postsDraft: posts.draft,
      reviewsPending: reviewModel.pendingCount(),
    },
    recent: leadModel.recent(6),
  });
};
