'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { adminFetch, qs } from '@/lib/admin-api';
import { fmtDate } from '@/lib/format';
import type { AdminReview } from '@/lib/types';
import { useAdmin } from '@/components/admin/AdminProvider';

const TABS = [['', 'All'], ['pending', 'Pending'], ['approved', 'Approved'], ['hidden', 'Hidden']] as const;

export default function ReviewsAdminPage() {
  const filter = useSearchParams().get('status') || '';
  const { flash, confirm, refresh } = useAdmin();
  const [reviews, setReviews] = useState<AdminReview[] | null>(null);
  const [form, setForm] = useState({ name: '', city: '', rating: '5', body: '' });
  const [adding, setAdding] = useState(false);
  const [open, setOpen] = useState(false);

  const load = useCallback(async () => {
    const r = await adminFetch<{ reviews: AdminReview[] }>(`/reviews${qs({ status: filter })}`);
    if (r.ok) setReviews((r.data as { reviews: AdminReview[] }).reviews); else flash(r.data.message || 'Could not load reviews.', 'error');
  }, [filter, flash]);
  useEffect(() => { document.title = 'Reviews | Admin'; void load(); }, [load]);

  const act = async (p: Promise<{ ok: boolean; data: { message?: string } }>, fallback: string) => {
    const r = await p;
    flash(r.data.message || (r.ok ? fallback : 'Something went wrong.'), r.ok ? 'success' : 'error');
    void load(); void refresh();
    return r.ok;
  };

  const add = async (e: FormEvent) => {
    e.preventDefault(); setAdding(true);
    const ok = await act(adminFetch('/reviews', { method: 'POST', body: JSON.stringify({ ...form, rating: Number(form.rating) }) }), 'Review added and published.');
    setAdding(false);
    if (ok) { setForm({ name: '', city: '', rating: '5', body: '' }); setOpen(false); }
  };

  const remove = async (r: AdminReview) => {
    if (!(await confirm({ title: 'Delete this review?', text: `This permanently deletes the review from ${r.name}.`, label: 'Delete review', danger: true }))) return;
    await act(adminFetch(`/reviews/${r.id}`, { method: 'DELETE' }), 'Review deleted.');
  };

  return (
    <>
      <div className="page-head"><div><h1>Reviews</h1><p>Only approved reviews appear on the website. Add genuine reviews you have received elsewhere, or approve ones students submit.</p></div></div>

      <nav className="tabs" aria-label="Filter reviews">
        {TABS.map(([v, l]) => <Link key={l} className="tab" href={`/admin/reviews${qs({ status: v })}`} aria-current={filter === v ? 'page' : undefined}>{l}</Link>)}
      </nav>

      <details className="panel" style={{ marginBottom: '1rem' }} open={open} onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}>
        <summary style={{ cursor: 'pointer', fontWeight: 700 }}>Add a review you received</summary>
        <form onSubmit={add} style={{ marginTop: '1rem' }}>
          <p className="muted small">Only add feedback that a real student gave you, with their permission. Do not invent or edit reviews.</p>
          <div className="grid-3">
            <div className="field"><label htmlFor="n-name">Student name</label><input id="n-name" type="text" maxLength={60} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="field"><label htmlFor="n-city">City</label><input id="n-city" type="text" maxLength={60} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
            <div className="field"><label htmlFor="n-rating">Rating</label><select id="n-rating" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })}>{[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>)}</select></div>
          </div>
          <div className="field"><label htmlFor="n-body">Review text</label><textarea id="n-body" rows={4} maxLength={700} minLength={20} required value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></div>
          <button className="btn btn-gold" type="submit" disabled={adding}>{adding ? 'Adding' : 'Add and publish'}</button>
        </form>
      </details>

      {reviews && reviews.length ? (
        <div className="table-wrap">
          <table className="data stack-sm">
            <thead><tr><th>Review</th><th>Rating</th><th>Status</th><th>Received</th><th><span className="sr-only">Actions</span></th></tr></thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r.id}>
                  <td data-label="Review" style={{ minWidth: 260 }}><span className="cell-title">{r.name}{r.city ? <span className="muted small"> &middot; {r.city}</span> : null}</span>{r.body}<br /><span className="muted small">Source: {r.source}</span></td>
                  <td data-label="Rating" className="nowrap">{r.rating} / 5</td>
                  <td data-label="Status"><span className={`badge badge-${r.status}`}>{r.status[0].toUpperCase() + r.status.slice(1)}</span></td>
                  <td data-label="Received" className="nowrap">{fmtDate(r.created_at)}</td>
                  <td>
                    <div className="actions">
                      {r.status !== 'approved' ? <button className="btn btn-gold btn-sm" type="button" onClick={() => act(adminFetch(`/reviews/${r.id}/status`, { method: 'PATCH', body: JSON.stringify({ status: 'approved' }) }), 'Review approved and published.')}>Approve</button> : null}
                      {r.status !== 'hidden' ? <button className="btn btn-quiet btn-sm" type="button" onClick={() => act(adminFetch(`/reviews/${r.id}/status`, { method: 'PATCH', body: JSON.stringify({ status: 'hidden' }) }), 'Review hidden.')}>Hide</button> : null}
                      <button className="btn btn-danger btn-sm" type="button" onClick={() => remove(r)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : reviews ? (
        <div className="panel"><h2>No reviews {filter ? 'with this status' : 'yet'}</h2><p className="muted">Student submissions from the Reviews page appear here for approval.</p></div>
      ) : <p className="muted">Loading</p>}
    </>
  );
}
