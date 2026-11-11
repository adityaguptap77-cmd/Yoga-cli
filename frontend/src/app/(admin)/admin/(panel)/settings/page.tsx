'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { adminFetch } from '@/lib/admin-api';
import type { Settings } from '@/lib/types';
import { useAdmin } from '@/components/admin/AdminProvider';

const FIELDS: (keyof Settings)[] = ['site_name', 'tagline', 'city', 'region', 'address', 'phone', 'whatsapp', 'email', 'hours', 'instagram', 'youtube', 'facebook', 'founder_name', 'founder_title', 'founder_quote', 'founder_bio'];

export default function SettingsPage() {
  const { me, flash } = useAdmin();
  const [s, setS] = useState<Settings | null>(null);
  const [photo, setPhoto] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [reset, setReset] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const fileInput = useRef<HTMLInputElement | null>(null);
  const preview = useRef('');

  useEffect(() => {
    document.title = 'Settings | Admin';
    adminFetch<{ settings: Settings }>('/settings').then((r) => {
      if (r.ok) { const st = (r.data as { settings: Settings }).settings; setS(st); setPhoto(st.founder_photo); } else flash(r.data.message || 'Could not load settings.', 'error');
    });
    return () => { if (preview.current) URL.revokeObjectURL(preview.current); };
  }, [flash]);

  const text = (k: keyof Settings) => (e: { target: { value: string } }) => setS((p) => (p ? { ...p, [k]: e.target.value } : p));

  const pick = (f: File | null) => {
    if (!f) return;
    if (f.size > 3 * 1048576) { flash('That image is larger than 3 MB. Please choose a smaller file.', 'error'); if (fileInput.current) fileInput.current.value = ''; return; }
    if (preview.current) URL.revokeObjectURL(preview.current);
    preview.current = URL.createObjectURL(f);
    setFile(f); setReset(false);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!s || busy) return;
    setBusy(true); setErrors([]);
    const fd = new FormData();
    for (const k of FIELDS) fd.append(k, s[k] || '');
    if (file) fd.append('founder_photo_file', file);
    if (reset && !file) fd.append('reset_photo', '1');
    const r = await adminFetch<{ settings: Settings }>('/settings', { method: 'PUT', body: fd });
    setBusy(false);
    if (!r.ok) { setErrors(r.data.errors?.length ? r.data.errors : [r.data.message || 'We could not save the settings.']); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const st = (r.data as { settings: Settings }).settings;
    setS(st); setPhoto(st.founder_photo); setFile(null); setReset(false);
    if (fileInput.current) fileInput.current.value = '';
    flash(r.data.message || 'Settings saved.');
  };

  if (!s) return <p className="muted">Loading</p>;
  const shown = file ? preview.current : photo;

  return (
    <>
      <div className="page-head"><div><h1>Settings</h1><p>Studio details, founder profile and contact information shown across the website.</p></div></div>
      {errors.length ? <div className="error-box" role="alert"><ul>{errors.map((m, i) => <li key={i}>{m}</li>)}</ul></div> : null}

      <form onSubmit={submit}>
        <section className="panel">
          <h2 style={{ marginBottom: '1rem' }}>Studio</h2>
          <div className="grid-2">
            <div className="field"><label htmlFor="s-site">Site name</label><input id="s-site" type="text" maxLength={120} value={s.site_name} onChange={text('site_name')} required /></div>
            <div className="field"><label htmlFor="s-tag">Tagline</label><input id="s-tag" type="text" maxLength={120} value={s.tagline} onChange={text('tagline')} /></div>
            <div className="field"><label htmlFor="s-city">City</label><input id="s-city" type="text" maxLength={120} value={s.city} onChange={text('city')} required /></div>
            <div className="field"><label htmlFor="s-region">State or region</label><input id="s-region" type="text" maxLength={120} value={s.region} onChange={text('region')} /></div>
          </div>
          <div className="field"><label htmlFor="s-addr">Street address</label><input id="s-addr" type="text" maxLength={300} value={s.address} onChange={text('address')} /></div>
          <div className="grid-3">
            <div className="field"><label htmlFor="s-phone">Phone</label><input id="s-phone" type="tel" maxLength={120} value={s.phone} onChange={text('phone')} /></div>
            <div className="field"><label htmlFor="s-wa">WhatsApp number <span className="hint">(digits with country code, e.g. 919876543210)</span></label><input id="s-wa" type="text" maxLength={20} value={s.whatsapp} onChange={text('whatsapp')} /></div>
            <div className="field"><label htmlFor="s-email">Public email</label><input id="s-email" type="email" maxLength={120} value={s.email} onChange={text('email')} /></div>
          </div>
          <div className="field"><label htmlFor="s-hours">Opening hours</label><input id="s-hours" type="text" maxLength={120} value={s.hours} onChange={text('hours')} /></div>
          <div className="grid-3">
            <div className="field"><label htmlFor="s-ig">Instagram link</label><input id="s-ig" type="url" maxLength={200} value={s.instagram} onChange={text('instagram')} placeholder="https://instagram.com/..." /></div>
            <div className="field"><label htmlFor="s-yt">YouTube link</label><input id="s-yt" type="url" maxLength={200} value={s.youtube} onChange={text('youtube')} placeholder="https://youtube.com/..." /></div>
            <div className="field"><label htmlFor="s-fb">Facebook link</label><input id="s-fb" type="url" maxLength={200} value={s.facebook} onChange={text('facebook')} placeholder="https://facebook.com/..." /></div>
          </div>
        </section>

        <section className="panel">
          <h2 style={{ marginBottom: '1rem' }}>Founder (About page)</h2>
          <div className="grid-2">
            <div className="field"><label htmlFor="s-fname">Founder name</label><input id="s-fname" type="text" maxLength={120} value={s.founder_name} onChange={text('founder_name')} /></div>
            <div className="field"><label htmlFor="s-ftitle">Title</label><input id="s-ftitle" type="text" maxLength={120} value={s.founder_title} onChange={text('founder_title')} /></div>
          </div>
          <div className="field"><label htmlFor="s-fquote">Pull quote</label><textarea id="s-fquote" rows={2} maxLength={300} value={s.founder_quote} onChange={text('founder_quote')} /></div>
          <div className="field"><label htmlFor="s-fbio">Biography <span className="hint">(leave a blank line between paragraphs)</span></label><textarea id="s-fbio" rows={9} maxLength={3000} value={s.founder_bio} onChange={text('founder_bio')} /></div>
          <div className="grid-2">
            <div><div className="cover-preview" style={{ maxWidth: 240, aspectRatio: '4/5' }}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={reset ? '/img/founder.svg' : shown} alt="Current founder photo" /></div></div>
            <div>
              <div className="field"><label htmlFor="s-fphoto">Replace photo <span className="hint">(JPG, PNG or WebP, up to 3 MB; portrait 4:5 looks best)</span></label>
                <input ref={fileInput} id="s-fphoto" type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => pick(e.target.files?.[0] || null)} /></div>
              <label className="check"><input type="checkbox" checked={reset} onChange={(e) => { setReset(e.target.checked); if (e.target.checked) { setFile(null); if (fileInput.current) fileInput.current.value = ''; } }} /> Go back to the placeholder illustration</label>
            </div>
          </div>
        </section>

        <section className="panel">
          <h2 style={{ marginBottom: '0.6rem' }}>Email delivery</h2>
          <p className="muted" style={{ margin: 0 }}>SMTP status: <strong>{me?.smtpReady ? 'Configured' : 'Not configured'}</strong>. Lead notifications go to <strong>{me?.notifyTo || 'nobody yet (set NOTIFY_EMAIL)'}</strong>. These values live in <code>backend/.env</code> for security, so change them there and restart the backend.</p>
        </section>

        <div className="sticky-actions"><button className="btn btn-gold" type="submit" disabled={busy}>{busy ? 'Saving' : 'Save settings'}</button></div>
      </form>
    </>
  );
}
