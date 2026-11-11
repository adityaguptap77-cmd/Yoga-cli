'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { adminFetch, qs } from '@/lib/admin-api';
import { fmtDate } from '@/lib/format';
import { LEAD_STATUSES, type Lead } from '@/lib/types';
import { useAdmin } from '@/components/admin/AdminProvider';

interface Result { leads: Lead[]; total: number; page: number; pages: number; counts: Record<string, number>; status: string; q: string }

function LeadRow({ lead, onChanged }: { lead: Lead; onChanged: () => void }) {
  const { flash, confirm, refresh } = useAdmin();
  const [status, setStatus] = useState(lead.status);
  const [notes, setNotes] = useState(lead.notes || '');
  const [busy, setBusy] = useState(false);
  const label = LEAD_STATUSES.find((s) => s.value === lead.status)?.label || lead.status;

  const save = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true);
    const r = await adminFetch(`/leads/${lead.id}`, { method: 'PATCH', body: JSON.stringify({ status, notes }) });
    setBusy(false);
    flash(r.data.message || (r.ok ? 'Lead updated.' : 'Could not update the lead.'), r.ok ? 'success' : 'error');
    if (r.ok) { onChanged(); void refresh(); }
  };
  const remove = async () => {
    if (!(await confirm({ title: 'Delete this lead?', text: `This permanently deletes the lead for ${lead.name}. This cannot be undone.`, label: 'Delete lead', danger: true }))) return;
    const r = await adminFetch(`/leads/${lead.id}`, { method: 'DELETE' });
    flash(r.data.message || (r.ok ? 'Lead deleted.' : 'Could not delete the lead.'), r.ok ? 'success' : 'error');
    if (r.ok) { onChanged(); void refresh(); }
  };

  return (
    <tr>
      <td data-label="Received" className="nowrap">{fmtDate(lead.created_at, true)}</td>
      <td data-label="Lead"><span className="cell-title">{lead.name}</span><a href={`tel:${lead.phone}`}>{lead.phone}</a><br /><a href={`mailto:${lead.email}`}>{lead.email}</a></td>
      <td data-label="Interest">{lead.interest}<br /><span className="muted small">{lead.level} &middot; {lead.mode} &middot; {lead.preferred_time}</span></td>
      <td data-label="Status"><span className={`badge badge-${lead.status}`}>{label}</span></td>
      <td data-label="Emails" className="small">
        <span className={lead.email_user_sent ? 'mail-ok' : 'mail-no'}>Lead: {lead.email_user_sent ? 'sent' : 'not sent'}</span><br />
        <span className={lead.email_admin_sent ? 'mail-ok' : 'mail-no'}>Team: {lead.email_admin_sent ? 'sent' : 'not sent'}</span>
      </td>
      <td>
        <details className="lead">
          <summary>Manage</summary>
          <div className="lead-detail">
            <dl><dt>Message</dt><dd>{lead.message || 'None'}</dd><dt>Source</dt><dd>{lead.source}</dd></dl>
            <form onSubmit={save}>
              <div className="field"><label htmlFor={`st-${lead.id}`}>Status</label>
                <select id={`st-${lead.id}`} value={status} onChange={(e) => setStatus(e.target.value)}>{LEAD_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</select></div>
              <div className="field"><label htmlFor={`nt-${lead.id}`}>Private notes</label><textarea id={`nt-${lead.id}`} maxLength={2000} value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
              <button className="btn btn-sm" type="submit" disabled={busy}>{busy ? 'Saving' : 'Save changes'}</button>
            </form>
            <button className="btn btn-danger btn-sm" type="button" onClick={remove}>Delete lead</button>
          </div>
        </details>
      </td>
    </tr>
  );
}

export default function LeadsPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const status = sp.get('status') || '';
  const q = sp.get('q') || '';
  const page = Math.max(1, parseInt(sp.get('page') || '1', 10) || 1);
  const [data, setData] = useState<Result | null>(null);
  const [search, setSearch] = useState(q);
  const { flash } = useAdmin();

  const load = useCallback(async () => {
    const r = await adminFetch<Result>(`/leads${qs({ status, q, page })}`);
    if (r.ok) setData(r.data as never); else flash(r.data.message || 'Could not load leads.', 'error');
  }, [status, q, page, flash]);

  useEffect(() => { document.title = 'Leads | Admin'; void load(); }, [load]);
  useEffect(() => setSearch(q), [q]);

  const href = (p: Record<string, string | number>) => `/admin/leads${qs({ status, q, ...p })}`;
  const allCount = data ? Object.values(data.counts).reduce((a, b) => a + b, 0) : 0;

  return (
    <>
      <div className="page-head">
        <div><h1>Leads</h1><p>{data ? `${data.total} ${data.total === 1 ? 'lead' : 'leads'}${status || q ? ' match your filter' : ''}. Newest first.` : 'Loading'}</p></div>
        <div className="actions"><a className="btn btn-quiet" href={`/api/admin/leads/export.csv${qs({ status, q })}`}>Download CSV</a></div>
      </div>

      <nav className="tabs" aria-label="Filter by status">
        <Link className="tab" href={`/admin/leads${qs({ q })}`} aria-current={!status ? 'page' : undefined}>All ({allCount})</Link>
        {LEAD_STATUSES.map((s) => (
          <Link key={s.value} className="tab" href={`/admin/leads${qs({ status: s.value, q })}`} aria-current={status === s.value ? 'page' : undefined}>{s.label} ({data?.counts[s.value] || 0})</Link>
        ))}
      </nav>

      <form className="toolbar" role="search" onSubmit={(e) => { e.preventDefault(); router.push(`/admin/leads${qs({ status, q: search.trim() })}`); }}>
        <label className="sr-only" htmlFor="lead-search">Search leads</label>
        <input id="lead-search" type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, phone or email" />
        <button className="btn btn-quiet" type="submit">Search</button>
        {q ? <Link href={`/admin/leads${qs({ status })}`}>Clear search</Link> : null}
      </form>

      {data && data.leads.length ? (
        <>
          <div className="table-wrap">
            <table className="data stack-sm">
              <thead><tr><th>Received</th><th>Lead</th><th>Interest</th><th>Status</th><th>Emails</th><th><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>{data.leads.map((l) => <LeadRow key={`${l.id}-${l.status}-${l.notes}`} lead={l} onChanged={load} />)}</tbody>
            </table>
          </div>
          {data.pages > 1 ? (
            <nav className="pager" aria-label="Pagination">
              {data.page > 1 ? <Link href={href({ page: data.page - 1 })}>Previous</Link> : null}
              <span className="is-current">Page {data.page} of {data.pages}</span>
              {data.page < data.pages ? <Link href={href({ page: data.page + 1 })}>Next</Link> : null}
            </nav>
          ) : null}
        </>
      ) : data ? (
        <div className="panel"><h2>No leads {status || q ? 'match this filter' : 'yet'}</h2><p className="muted">{status || q ? 'Try clearing the filter or search.' : 'Submissions from the contact page will appear here as soon as they arrive.'}</p></div>
      ) : null}
    </>
  );
}
