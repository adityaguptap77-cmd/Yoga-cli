'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/admin-api';
import { fmtDate } from '@/lib/format';
import { LEAD_STATUSES, type Lead } from '@/lib/types';
import { useAdmin } from '@/components/admin/AdminProvider';

interface Stats { leadsNew: number; leadsWeek: number; leadsTotal: number; postsPublished: number; postsDraft: number; reviewsPending: number }

export default function DashboardPage() {
  const { me, flash } = useAdmin();
  const [data, setData] = useState<{ stats: Stats; recent: Lead[] } | null>(null);

  useEffect(() => {
    document.title = 'Dashboard | Admin';
    adminFetch<{ stats: Stats; recent: Lead[] }>('/stats').then((r) => { if (r.ok) setData(r.data as never); else flash(r.data.message || 'Could not load the dashboard.', 'error'); });
  }, [flash]);

  const label = (v: string) => LEAD_STATUSES.find((s) => s.value === v)?.label || v;

  return (
    <>
      <div className="page-head">
        <div><h1>Dashboard</h1><p>What needs your attention today.</p></div>
        <div className="actions"><Link className="btn btn-gold" href="/admin/blogs/new">Write a blog post</Link><Link className="btn btn-quiet" href="/admin/leads">All leads</Link></div>
      </div>

      {me && !me.smtpReady ? <div className="callout-warn"><strong>Email is not set up.</strong> Leads are still saved, but confirmation emails will not be sent until you add your SMTP details to <code>backend/.env</code>. See the README.</div> : null}

      {data ? (
        <>
          <div className="stats">
            <Link className="stat" href="/admin/leads?status=new"><b>{data.stats.leadsNew}</b><span>New leads to contact</span></Link>
            <Link className="stat" href="/admin/leads"><b>{data.stats.leadsWeek}</b><span>Leads in the last 7 days</span></Link>
            <Link className="stat" href="/admin/leads"><b>{data.stats.leadsTotal}</b><span>Leads in total</span></Link>
            <Link className="stat" href="/admin/blogs"><b>{data.stats.postsPublished}</b><span>Published posts ({data.stats.postsDraft} drafts)</span></Link>
            <Link className="stat" href="/admin/reviews?status=pending"><b>{data.stats.reviewsPending}</b><span>Reviews waiting for approval</span></Link>
          </div>

          <section className="panel">
            <div className="panel-head"><h2>Latest leads</h2><Link href="/admin/leads">See all</Link></div>
            {data.recent.length ? (
              <div className="table-wrap">
                <table className="data stack-sm">
                  <thead><tr><th>Received</th><th>Name</th><th>Contact</th><th>Class</th><th>Status</th></tr></thead>
                  <tbody>
                    {data.recent.map((l) => (
                      <tr key={l.id}>
                        <td data-label="Received" className="nowrap">{fmtDate(l.created_at, true)}</td>
                        <td data-label="Name"><span className="cell-title">{l.name}</span></td>
                        <td data-label="Contact"><a href={`tel:${l.phone}`}>{l.phone}</a><br /><a href={`mailto:${l.email}`}>{l.email}</a></td>
                        <td data-label="Class">{l.interest}<br /><span className="muted small">{l.mode} &middot; {l.preferred_time}</span></td>
                        <td data-label="Status"><span className={`badge badge-${l.status}`}>{label(l.status)}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <p className="muted">No leads yet. When someone completes the contact form, they will appear here and in your inbox.</p>}
          </section>
        </>
      ) : <p className="muted">Loading</p>}
    </>
  );
}
