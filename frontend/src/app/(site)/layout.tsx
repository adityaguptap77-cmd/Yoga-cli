import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '@/styles/site.css';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import { getSettings } from '@/lib/api';
import { SITE_URL } from '@/lib/config';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: `${s.site_name}: ${s.tagline}`, template: `%s | ${s.site_name}` },
    description: s.tagline,
    applicationName: s.site_name,
    icons: { icon: '/img/favicon.svg', apple: '/img/apple-touch-icon.png' },
    other: { 'theme-color': '#e4eae2' },
  };
}

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const settings = await getSettings();
  return (
    <html lang="en-IN" className="js">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=Tiro+Devanagari+Hindi&family=Young+Serif&display=swap" />
      </head>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <SiteHeader siteName={settings.site_name} />
        <main id="main">{children}</main>
        <SiteFooter settings={settings} />
      </body>
    </html>
  );
}
