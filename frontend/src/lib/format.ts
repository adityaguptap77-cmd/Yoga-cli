/** Parse a SQLite datetime ('YYYY-MM-DD HH:MM:SS', UTC) or ISO string into a Date. */
export function toDate(value?: string | null): Date | null {
  if (!value) return null;
  const s = String(value);
  const iso = /[zZ]|[+-]\d{2}:?\d{2}$/.test(s) ? s : s.replace(' ', 'T') + 'Z';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function fmtDate(value?: string | null, withTime = false): string {
  const d = toDate(value);
  if (!d) return '';
  const opts: Intl.DateTimeFormatOptions = withTime
    ? { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }
    : { day: 'numeric', month: 'short', year: 'numeric' };
  return new Intl.DateTimeFormat('en-IN', { ...opts, timeZone: 'Asia/Kolkata' }).format(d);
}

export function isoDate(value?: string | null): string {
  const d = toDate(value);
  return d ? d.toISOString() : '';
}

export function truncate(text: string, max: number): string {
  const s = String(text || '').replace(/\s+/g, ' ').trim();
  if (s.length <= max) return s;
  return s.slice(0, max - 1).replace(/\s+\S*$/, '') + '…';
}

export function slugify(text: string): string {
  return String(text || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '');
}
