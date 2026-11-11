'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { adminFetch } from '@/lib/admin-api';
import { fmtDate } from '@/lib/format';
import { useAdmin } from '@/components/admin/AdminProvider';

interface Row { id: number; slug: string; title: string; category: string; status: 'published' | 'draft'; published_at: string | null; updated_at: string }

export default function BlogsPage() {
  const { flash, confirm } = useAdmin();
  const [blogs, setBlogs] = useState<Row[] | null>(null);

  const load = useCallback(async () => {
    const r = await adminFetch<{ blogs: Row[] }>('/blogs');
    if (r.ok) setBlogs((r.data as { blogs: Row[] }).blogs); else flash(r.data.message || 'Could not load posts.', 'error');
  }, [flash]);
  useEffect(() => { document.title = 'Blog posts | Admin'; void load(); }, [load]);

  const toggle = async (b: Row) => {
    if (b.status === 'published' && !(await confirm({ title: 'Unpublish this post?', text: 'It will disappear from the blog and the sitemap straight away. You can publish it again later.', label: 'Unpublish' }))) return;
    const r = await adminFetch(`/blogs/${b.id}/toggle`, { method: 'POST' });
    flash(r.data.message || (r.ok ? 'Done.' : 'Could not change the post.'), r.ok ? 'success' : 'error');
    void load();
  };
  const remove = async (b: Row) => {
    if (!(await confirm({ title: 'Delete this post?', text: `This permanently deletes “${b.title}” and its cover image. Unpublish it instead if you may want it back.`, label: 'Delete post', danger: true }))) return;
    const r = await adminFetch(`/blogs/${b.id}`, { method: 'DELETE' });
    flash(r.data.message || (r.ok ? 'Post deleted.' : 'Could not delete the post.'), r.ok ? 'success' : 'error');
    void load();
  };

  return (
    <>
      <div className="page-head">
        <div><h1>Blog posts</h1><p>Publish, edit or unpublish articles. Published posts appear on the site and in the sitemap straight away.</p></div>
        <div className="actions"><Link className="btn btn-gold" href="/admin/blogs/new">New post</Link></div>
      </div>

      {blogs && blogs.length ? (
        <div className="table-wrap">
          <table className="data stack-sm">
            <thead><tr><th>Post</th><th>Category</th><th>Status</th><th>Updated</th><th><span className="sr-only">Actions</span></th></tr></thead>
            <tbody>
              {blogs.map((b) => (
                <tr key={b.id}>
                  <td data-label="Post"><Link className="cell-title" href={`/admin/blogs/${b.id}/edit`}>{b.title}</Link><span className="muted small">/blog/{b.slug}</span></td>
                  <td data-label="Category">{b.category}</td>
                  <td data-label="Status"><span className={`badge badge-${b.status}`}>{b.status === 'published' ? 'Published' : 'Draft'}</span>{b.published_at && b.status === 'published' ? <><br /><span className="muted small">{fmtDate(b.published_at)}</span></> : null}</td>
                  <td data-label="Updated" className="nowrap">{fmtDate(b.updated_at, true)}</td>
                  <td>
                    <div className="actions">
                      <Link className="btn btn-quiet btn-sm" href={`/admin/blogs/${b.id}/edit`}>Edit</Link>
                      {b.status === 'published'
                        ? <a className="btn btn-quiet btn-sm" href={`/blog/${b.slug}`} target="_blank" rel="noopener">View</a>
                        : <Link className="btn btn-quiet btn-sm" href={`/admin/blogs/${b.id}/preview`} target="_blank" rel="noopener">Preview</Link>}
                      {b.status === 'published'
                        ? <button className="btn btn-quiet btn-sm" type="button" onClick={() => toggle(b)}>Unpublish</button>
                        : <button className="btn btn-gold btn-sm" type="button" onClick={() => toggle(b)}>Publish</button>}
                      <button className="btn btn-danger btn-sm" type="button" onClick={() => remove(b)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : blogs ? (
        <div className="panel"><h2>No posts yet</h2><p className="muted">Write your first article to start building search traffic.</p><Link className="btn btn-gold" href="/admin/blogs/new">Write a post</Link></div>
      ) : <p className="muted">Loading</p>}
    </>
  );
}
