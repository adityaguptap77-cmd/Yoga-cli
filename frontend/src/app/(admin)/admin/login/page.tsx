'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { adminFetch } from '@/lib/admin-api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [warnDefault, setWarnDefault] = useState(false);
  // Inert until hydrated, so a fast submit can never fall back to a native GET that would put the password in the URL.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    document.title = 'Sign in | Admin';
    // An already signed-in visitor goes straight to the dashboard.
    adminFetch<{ usingDefaultPassword: boolean }>('/me').then((r) => {
      if (r.ok) window.location.replace('/admin');
    });
    fetch('/api/health').then((r) => r.json()).then((d) => setWarnDefault(Boolean(d.devDefaultPassword))).catch(() => {});
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true); setError('');
    const r = await adminFetch('/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    if (r.ok) window.location.assign('/admin');
    else { setError(r.data.message || 'We could not sign you in. Please try again.'); setBusy(false); }
  };

  return (
    <div className="login-wrap">
      <main className="login-card">
        <svg width="44" height="44" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="15" fill="#0b2827" /><path d="M16 6c3.3 3.5 4.3 7.4 0 14-4.3-6.6-3.3-10.5 0-14z" fill="#e9a23b" /><path d="M6.5 12.5c4-.2 7.6 2.2 9.5 6.5-4.7 1.2-9.2.2-9.5-6.5z" fill="#7fb7ae" /><path d="M25.5 12.5c-4-.2-7.6 2.2-9.5 6.5 4.7 1.2 9.2.2 9.5-6.5z" fill="#7fb7ae" /></svg>
        <h1>Sign in to admin</h1>
        <p>Leads and blog</p>
        {error ? <div className="flash flash-error" role="alert">{error}</div> : null}
        {warnDefault ? <div className="callout-warn small">Set <code>ADMIN_PASSWORD</code> in <code>backend/.env</code>. The built-in development password is still active.</div> : null}
        <form onSubmit={submit} inert={!ready}>
          <div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus /></div>
          <div className="field"><label htmlFor="password">Password</label><input id="password" name="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
          <button className="btn btn-gold" type="submit" disabled={busy}>{busy ? 'Signing in' : 'Sign in'}</button>
        </form>
      </main>
    </div>
  );
}
