/** Public address of this website, with no trailing slash. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '');

/** Where the backend API lives. Server-side only; browsers use the /api proxy instead. */
export const BACKEND_URL = (process.env.BACKEND_URL || 'http://localhost:4000').replace(/\/+$/, '');

export const DEFAULT_OG_IMAGE = '/img/og-default.jpg';
