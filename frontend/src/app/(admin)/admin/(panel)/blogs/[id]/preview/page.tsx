'use client';

import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import { adminFetch } from '@/lib/admin-api';
import { fmtDate } from '@/lib/format';
import type { AdminPost } from '@/lib/types';

/** Shows a post as readers will see it, including drafts, using the admin session. Styled with the admin theme, not the public site. */
export default function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [post, setPost] = useState<AdminPost | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Preview | Admin';
    adminFetch<{ post: AdminPost }>(`/blogs/${encodeURIComponent(id)}`).then((r) => {
      if (r.ok) setPost((r.data as { post: AdminPost }).post); else setError(r.data.message || 'Could not load the post.');
    });
  }, [id]);

  if (error) return <div className="error-box" role="alert">{error}</div>;
  if (!post) return <p className="muted">Loading</p>;

  return (
    <>
      <div className="callout-warn" role="note"><strong>Preview.</strong> Status: {post.status}. This page is not public unless the post is published. <Link href={`/admin/blogs/${post.id}/edit`}>Back to editor</Link></div>
      <article className="panel" style={{ maxWidth: 780 }}>
        <p className="muted small">{post.category} &middot; By {post.author} &middot; {post.reading_minutes} min read{post.published_at ? ` · ${fmtDate(post.published_at)}` : ''}</p>
        <h1>{post.title}</h1>
        {post.cover_image ? <div className="cover-preview" style={{ margin: '1rem 0' }}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={post.cover_image} alt={post.cover_alt || post.title} /></div> : null}
        {post.excerpt ? <p><em>{post.excerpt}</em></p> : null}
        {/* content_html is produced and sanitised by the backend. */}
        <div className="preview-prose" dangerouslySetInnerHTML={{ __html: post.content_html }} />
        {post.faqs.length ? (
          <>
            <h2>Frequently asked questions</h2>
            {post.faqs.map((q, i) => <details key={i}><summary><strong>{q.q}</strong></summary><p>{q.a}</p></details>)}
          </>
        ) : null}
      </article>
    </>
  );
}
