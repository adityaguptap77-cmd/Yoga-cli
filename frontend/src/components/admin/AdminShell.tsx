'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useAdmin } from './AdminProvider';

const ITEMS = [
  { key: 'dashboard', href: '/admin', label: 'Dashboard' },
  { key: 'leads', href: '/admin/leads', label: 'Leads' },
  { key: 'blogs', href: '/admin/blogs', label: 'Blog posts' },
  { key: 'reviews', href: '/admin/reviews', label: 'Reviews' },
  { key: 'settings', href: '/admin/settings', label: 'Settings' },
] as const;

export default function AdminShell({ children }: { children: ReactNode }) {
  const path = usePathname() || '/admin';
  const { me, message, dismiss, logout } = useAdmin();
  const counts: Record<string, number> = { leads: me?.counts.leads || 0, reviews: me?.counts.reviews || 0 };
  const active = (href: string) => (href === '/admin' ? path === '/admin' : path === href || path.startsWith(`${href}/`));

  return (
    <div className="shell">
      <aside className="side">
        <Link className="side-brand" href="/admin">
          <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="15" fill="#e4eae2" /><path d="M16 6c3.3 3.5 4.3 7.4 0 14-4.3-6.6-3.3-10.5 0-14z" fill="#b8741a" /><path d="M6.5 12.5c4-.2 7.6 2.2 9.5 6.5-4.7 1.2-9.2.2-9.5-6.5z" fill="#1f6560" /><path d="M25.5 12.5c-4-.2-7.6 2.2-9.5 6.5 4.7 1.2 9.2.2 9.5-6.5z" fill="#1f6560" /></svg>
          <span>Admin</span>
        </Link>
        <nav aria-label="Admin">
          {ITEMS.map((it) => (
            <Link key={it.key} href={it.href} aria-current={active(it.href) ? 'page' : undefined}>
              {it.label}{counts[it.key] ? <span className="count">{counts[it.key]}</span> : null}
            </Link>
          ))}
        </nav>
        <div className="side-foot">
          <a href="/" target="_blank" rel="noopener">View website</a>
          <button type="button" onClick={() => void logout()}>Sign out</button>
        </div>
      </aside>
      <main className="main" id="main">
        {message ? (
          <div className={`flash flash-${message.type}`} role={message.type === 'error' ? 'alert' : 'status'}>
            {message.message}{' '}
            <button type="button" className="btn btn-quiet btn-sm" style={{ marginLeft: '0.6rem' }} onClick={dismiss}>Dismiss</button>
          </div>
        ) : null}
        {me ? children : <p className="muted">Loading</p>}
      </main>
    </div>
  );
}
