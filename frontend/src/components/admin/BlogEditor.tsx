'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { adminFetch } from '@/lib/admin-api';
import { SITE_URL } from '@/lib/config';
import { slugify } from '@/lib/format';
import type { AdminPost, Faq } from '@/lib/types';
import { useAdmin } from './AdminProvider';

interface Form {
  title: string; slug: string; excerpt: string; content_md: string; meta_title: string; meta_description: string;
  keywords: string; category: string; author: string; cover_alt: string; status: 'draft' | 'published'; faqs: Faq[];
}
const EMPTY: Form = {
  title: '', slug: '', excerpt: '', content_md: '', meta_title: '', meta_description: '', keywords: '',
  category: 'Yoga basics', author: 'Yovana Yoga Team', cover_alt: '', status: 'draft', faqs: [],
};
const MAX_FAQS = 12;

function Counter({ value, max }: { value: string; max: number }) {
  return <div className={`counter ${value.length > max ? 'is-over' : ''}`}>{value.length} / {max}</div>;
}

export default function BlogEditor({ id }: { id?: number }) {
  const router = useRouter();
  const { flash } = useAdmin();
  const isNew = id === undefined;
  const [f, setF] = useState<Form>(EMPTY);
  const [loaded, setLoaded] = useState(isNew);
  const [coverUrl, setCoverUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [removeCover, setRemoveCover] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState('');
  const [dirty, setDirty] = useState(false);
  const slugTouched = useRef(false);
  const fileInput = useRef<HTMLInputElement | null>(null);
  const objectUrl = useRef('');

  useEffect(() => {
    document.title = `${isNew ? 'New post' : 'Edit post'} | Admin`;
    if (isNew) return;
    adminFetch<{ post: AdminPost }>(`/blogs/${id}`).then((r) => {
      if (!r.ok) { flash(r.data.message || 'Could not load the post.', 'error'); router.replace('/admin/blogs'); return; }
      const p = (r.data as { post: AdminPost }).post;
      slugTouched.current = true;
      setF({
        title: p.title, slug: p.slug, excerpt: p.excerpt || '', content_md: p.content_md || '', meta_title: p.meta_title || '', meta_description: p.meta_description || '',
        keywords: p.keywords || '', category: p.category, author: p.author, cover_alt: p.cover_alt || '', status: p.status === 'published' ? 'published' : 'draft', faqs: p.faqs || [],
      });
      setCoverUrl(p.cover_image || '');
      setLoaded(true);
    });
  }, [id, isNew, flash, router]);

  useEffect(() => () => { if (objectUrl.current) URL.revokeObjectURL(objectUrl.current); }, []);

  // Warn before leaving with unsaved edits.
  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [dirty]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => { setF((p) => ({ ...p, [k]: v })); setDirty(true); };

  const onTitle = (v: string) => {
    setF((p) => ({ ...p, title: v, slug: slugTouched.current ? p.slug : slugify(v) }));
    setDirty(true);
  };

  const onFile = (file: File | null) => {
    if (!file) return;
    if (file.size > 3 * 1048576) { flash('That image is larger than 3 MB. Please choose a smaller file.', 'error'); if (fileInput.current) fileInput.current.value = ''; return; }
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    objectUrl.current = URL.createObjectURL(file);
    setFile(file); setRemoveCover(false); setDirty(true);
  };

  const submit = async (e: FormEvent, status: 'draft' | 'published') => {
    e.preventDefault();
    if (busy) return;
    setBusy(status); setErrors([]);
    const fd = new FormData();
    const fields: Record<string, string> = {
      title: f.title, slug: f.slug, excerpt: f.excerpt, content_md: f.content_md, meta_title: f.meta_title, meta_description: f.meta_description,
      keywords: f.keywords, category: f.category, author: f.author, cover_alt: f.cover_alt, status,
    };
    for (const [k, v] of Object.entries(fields)) fd.append(k, v);
    for (const q of f.faqs) { fd.append('faq_q', q.q); fd.append('faq_a', q.a); }
    if (file) fd.append('cover', file);
    if (removeCover && !file) fd.append('remove_cover', '1');

    const r = await adminFetch<{ post: AdminPost }>(isNew ? '/blogs' : `/blogs/${id}`, { method: isNew ? 'POST' : 'PUT', body: fd });
    setBusy('');
    if (!r.ok) {
      setErrors(r.data.errors?.length ? r.data.errors : [r.data.message || 'We could not save the post.']);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setDirty(false);
    flash(r.data.message || 'Saved.');
    const post = (r.data as { post: AdminPost }).post;
    if (isNew) router.replace(`/admin/blogs/${post.id}/edit`);
    else {
      setF((p) => ({ ...p, slug: post.slug, status: post.status === 'published' ? 'published' : 'draft' }));
      setCoverUrl(post.cover_image || ''); setFile(null); setRemoveCover(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  };

  const setFaq = (i: number, patch: Partial<Faq>) => { setF((p) => ({ ...p, faqs: p.faqs.map((q, j) => (j === i ? { ...q, ...patch } : q)) })); setDirty(true); };

  if (!loaded) return <p className="muted">Loading</p>;
  const shownCover = file ? objectUrl.current : removeCover ? '' : coverUrl;
  const published = f.status === 'published';
  const serpUrl = `${SITE_URL}/blog/${f.slug || slugify(f.title) || 'post-slug'}`;

  return (
    <>
      <div className="page-head">
        <div>
          <h1>{isNew ? 'New post' : 'Edit post'}</h1>
          <p>{isNew ? 'Draft first, publish when ready.' : published ? 'This post is live.' : 'This post is a draft and is not public.'}</p>
        </div>
        <div className="actions">
          <Link className="btn btn-quiet" href="/admin/blogs">Back to posts</Link>
          {!isNew ? <Link className="btn btn-quiet" href={`/admin/blogs/${id}/preview`} target="_blank" rel="noopener">Preview</Link> : null}
          {!isNew && published ? <a className="btn btn-quiet" href={`/blog/${f.slug}`} target="_blank" rel="noopener">View live</a> : null}
        </div>
      </div>

      {errors.length ? <div className="error-box" role="alert"><ul>{errors.map((m, i) => <li key={i}>{m}</li>)}</ul></div> : null}

      <form onSubmit={(e) => submit(e, published ? 'published' : 'draft')}>
        <div className="editor">
          <div>
            <section className="panel">
              <div className="field"><label htmlFor="b-title">Title</label><input id="b-title" type="text" maxLength={140} value={f.title} onChange={(e) => onTitle(e.target.value)} required /></div>
              <div className="field"><label htmlFor="b-slug">URL slug <span className="hint">(auto-filled from the title; letters, numbers and hyphens)</span></label>
                <input id="b-slug" type="text" maxLength={80} value={f.slug} onChange={(e) => { slugTouched.current = true; set('slug', e.target.value); }} /></div>
              <div className="field"><label htmlFor="b-excerpt">Short summary <span className="hint">(shown on cards and used if there is no meta description)</span></label>
                <textarea id="b-excerpt" maxLength={320} rows={3} value={f.excerpt} onChange={(e) => set('excerpt', e.target.value)} /><Counter value={f.excerpt} max={300} /></div>
            </section>

            <section className="panel">
              <div className="field">
                <label htmlFor="b-content">Article content</label>
                <textarea className="md" id="b-content" spellCheck value={f.content_md} onChange={(e) => set('content_md', e.target.value)} />
                <span className="md-help">Markdown: <code>## Heading</code>, <code>### Subheading</code>, <code>**bold**</code>, <code>*italic*</code>, <code>- list item</code>, <code>1. numbered</code>, <code>[link text](https://example.com)</code>, <code>![alt text](/uploads/image.jpg)</code>. Use <code>##</code> for section headings; the title is already the main heading.</span>
              </div>
            </section>

            <section className="panel">
              <div className="panel-head"><h2>FAQs for this article</h2>
                <button className="btn btn-quiet btn-sm" type="button" disabled={f.faqs.length >= MAX_FAQS} onClick={() => set('faqs', [...f.faqs, { q: '', a: '' }])}>Add a question</button></div>
              <p className="muted small">Shown at the end of the post and added as FAQ structured data, which can earn rich results in Google.</p>
              {f.faqs.map((q, i) => (
                <div className="faq-row" key={i}>
                  <div className="field" style={{ margin: 0 }}><label htmlFor={`fq-${i}`}>Question</label><input id={`fq-${i}`} type="text" maxLength={220} value={q.q} onChange={(e) => setFaq(i, { q: e.target.value })} autoFocus={q.q === '' && q.a === ''} /></div>
                  <div className="field" style={{ margin: 0 }}><label htmlFor={`fa-${i}`}>Answer</label><textarea id={`fa-${i}`} rows={3} maxLength={1200} value={q.a} onChange={(e) => setFaq(i, { a: e.target.value })} /></div>
                  <div className="row-actions"><button className="btn btn-danger btn-sm" type="button" onClick={() => set('faqs', f.faqs.filter((_, j) => j !== i))}>Remove</button></div>
                </div>
              ))}
            </section>
          </div>

          <aside>
            <section className="panel">
              <h2 style={{ marginBottom: '0.8rem' }}>Publish</h2>
              <p className="muted small" style={{ marginTop: 0 }}>Current status: <strong>{published ? 'Published' : 'Draft'}</strong></p>
              <div className="actions">
                <button className="btn btn-quiet" type="button" disabled={Boolean(busy)} onClick={(e) => submit(e, 'draft')}>{busy === 'draft' ? 'Saving' : published ? 'Save as draft (unpublish)' : 'Save draft'}</button>
                <button className="btn btn-gold" type="button" disabled={Boolean(busy)} onClick={(e) => submit(e, 'published')}>{busy === 'published' ? 'Publishing' : published ? 'Update live post' : 'Publish now'}</button>
              </div>
            </section>

            <section className="panel">
              <h2 style={{ marginBottom: '0.8rem' }}>Cover image</h2>
              <div className="cover-preview">{shownCover ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={shownCover} alt={file ? 'Selected cover preview' : 'Current cover'} /> : 'No cover yet'}</div>
              <div className="field"><label htmlFor="b-cover">Upload image <span className="hint">(JPG, PNG or WebP, up to 3 MB; 1200 x 630 works best)</span></label>
                <input ref={fileInput} id="b-cover" type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => onFile(e.target.files?.[0] || null)} /></div>
              <div className="field"><label htmlFor="b-alt">Image description (alt text)</label><input id="b-alt" type="text" maxLength={160} value={f.cover_alt} onChange={(e) => set('cover_alt', e.target.value)} /></div>
              {coverUrl && !file ? <label className="check"><input type="checkbox" checked={removeCover} onChange={(e) => { setRemoveCover(e.target.checked); setDirty(true); }} /> Remove current cover</label> : null}
            </section>

            <section className="panel">
              <h2 style={{ marginBottom: '0.8rem' }}>Search engine details</h2>
              <div className="field"><label htmlFor="b-meta-title">Meta title <span className="hint">(about 50 to 60 characters)</span></label><input id="b-meta-title" type="text" maxLength={120} value={f.meta_title} onChange={(e) => set('meta_title', e.target.value)} /><Counter value={f.meta_title} max={60} /></div>
              <div className="field"><label htmlFor="b-meta-desc">Meta description <span className="hint">(120 to 160 characters)</span></label><textarea id="b-meta-desc" rows={3} maxLength={320} value={f.meta_description} onChange={(e) => set('meta_description', e.target.value)} /><Counter value={f.meta_description} max={160} /></div>
              <div className="field"><label htmlFor="b-keywords">Keywords <span className="hint">(comma separated)</span></label><input id="b-keywords" type="text" maxLength={240} value={f.keywords} onChange={(e) => set('keywords', e.target.value)} /></div>
              <div className="serp" aria-label="Google result preview">
                <div className="u">{serpUrl}</div>
                <div className="t">{f.meta_title || f.title || 'Post title'}</div>
                <div className="d">{f.meta_description || f.excerpt || 'Your meta description appears here. Aim for 120 to 160 characters.'}</div>
              </div>
            </section>

            <section className="panel">
              <h2 style={{ marginBottom: '0.8rem' }}>Details</h2>
              <div className="field"><label htmlFor="b-cat">Category</label><input id="b-cat" type="text" maxLength={40} value={f.category} onChange={(e) => set('category', e.target.value)} /></div>
              <div className="field"><label htmlFor="b-author">Author</label><input id="b-author" type="text" maxLength={80} value={f.author} onChange={(e) => set('author', e.target.value)} /></div>
            </section>
          </aside>
        </div>
      </form>
    </>
  );
}
