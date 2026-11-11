/** Browser-side helper for the admin API. All calls go through the same-origin /api proxy, so the session cookie travels with them. */
let csrfToken = '';
export const setCsrf = (t: string) => { csrfToken = t; };

export interface ApiResult<T = Record<string, unknown>> {
  ok: boolean;
  status: number;
  data: T & { ok?: boolean; message?: string; errors?: string[] };
}

export async function adminFetch<T = Record<string, unknown>>(path: string, init: RequestInit = {}): Promise<ApiResult<T>> {
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');
  if (csrfToken) headers.set('X-CSRF-Token', csrfToken);
  if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');

  let res: Response;
  try {
    res = await fetch(`/api/admin${path}`, { ...init, headers, credentials: 'same-origin', cache: 'no-store' });
  } catch {
    return { ok: false, status: 0, data: { ok: false, message: 'Could not reach the server. Check your connection and try again.' } as ApiResult<T>['data'] };
  }
  if (res.status === 401 && !path.startsWith('/login') && typeof window !== 'undefined' && window.location.pathname !== '/admin/login') {
    window.location.assign('/admin/login');
  }
  const data = (await res.json().catch(() => ({ ok: false, message: 'The server sent an unexpected reply.' }))) as ApiResult<T>['data'];
  return { ok: res.ok && data.ok !== false, status: res.status, data };
}

export const qs = (params: Record<string, string | number | undefined>) => {
  const s = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== '') s.set(k, String(v));
  const out = s.toString();
  return out ? `?${out}` : '';
};
