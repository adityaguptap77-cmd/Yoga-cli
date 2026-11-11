import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '@/styles/admin.css';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s | Admin' },
  robots: { index: false, follow: false },
  icons: { icon: '/img/favicon.svg' },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&display=swap" />
      </head>
      <body>{children}</body>
    </html>
  );
}
