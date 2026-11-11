'use client';

import { useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { adminFetch, setCsrf } from '@/lib/admin-api';

export interface Me {
  email: string;
  csrf: string;
  counts: { leads: number; reviews: number };
  smtpReady: boolean;
  notifyTo: string;
  usingDefaultPassword: boolean;
}
interface Flash { type: 'success' | 'error'; message: string }
interface ConfirmOptions { title: string; text: string; label: string; danger?: boolean }

interface Ctx {
  me: Me | null;
  message: Flash | null;
  dismiss: () => void;
  refresh: () => Promise<void>;
  flash: (message: string, type?: Flash['type']) => void;
  confirm: (o: ConfirmOptions) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AdminContext = createContext<Ctx | null>(null);
export const useAdmin = () => {
  const c = useContext(AdminContext);
  if (!c) throw new Error('useAdmin must be used inside AdminProvider');
  return c;
};

/** Confirms the session, holds the CSRF token and sidebar counts, and offers flash messages and a confirm dialog to every admin page. */
export default function AdminProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [message, setMessage] = useState<Flash | null>(null);
  const [dlg, setDlg] = useState<(ConfirmOptions & { resolve: (v: boolean) => void }) | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const refresh = useCallback(async () => {
    const r = await adminFetch<Me>('/me');
    if (r.ok) { setCsrf(r.data.csrf); setMe(r.data as Me); }
    else if (r.status === 401) router.replace('/admin/login');
  }, [router]);

  useEffect(() => { void refresh(); }, [refresh]);

  const flash = useCallback((text: string, type: Flash['type'] = 'success') => {
    setMessage({ type, message: text });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (!message || message.type === 'error') return;
    const t = window.setTimeout(() => setMessage(null), 6000);
    return () => window.clearTimeout(t);
  }, [message]);

  const confirm = useCallback((o: ConfirmOptions) => new Promise<boolean>((resolve) => setDlg({ ...o, resolve })), []);

  useEffect(() => {
    const d = dialogRef.current;
    if (dlg && d && !d.open) d.showModal();
  }, [dlg]);

  const close = (value: boolean) => {
    dlg?.resolve(value);
    dialogRef.current?.close();
    setDlg(null);
  };

  const logout = useCallback(async () => {
    await adminFetch('/logout', { method: 'POST' });
    setCsrf('');
    window.location.assign('/admin/login');
  }, []);

  return (
    <AdminContext.Provider value={{ me, message, dismiss: () => setMessage(null), refresh, flash, confirm, logout }}>
      {children}
      <dialog ref={dialogRef} className="confirm" aria-labelledby="confirm-title" onCancel={(e) => { e.preventDefault(); close(false); }}>
        {dlg ? (
          <div>
            <h2 id="confirm-title">{dlg.title}</h2>
            <p>{dlg.text}</p>
            <div className="actions">
              <button className="btn btn-quiet" type="button" onClick={() => close(false)}>Cancel</button>
              <button className={`btn ${dlg.danger ? 'btn-danger' : 'btn-gold'}`} type="button" onClick={() => close(true)}>{dlg.label}</button>
            </div>
          </div>
        ) : null}
      </dialog>
    </AdminContext.Provider>
  );
}
