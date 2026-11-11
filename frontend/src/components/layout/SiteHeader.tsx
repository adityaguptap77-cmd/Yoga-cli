'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Icon from '../ui/Icon';

const NAV = [
  { href: '/services', label: 'Classes' },
  { href: '/why-yovana', label: 'Why us' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Journal' },
  { href: '/reviews', label: 'Reviews' },
];

export function BrandMark({ size = 30 }: { size?: number }) {
  return (
    <svg className="brand-mark" width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="15" fill="#10302f" />
      <path d="M16 6c3.3 3.5 4.3 7.4 0 14-4.3-6.6-3.3-10.5 0-14z" fill="#e9a23b" />
      <path d="M6.5 12.5c4-.2 7.6 2.2 9.5 6.5-4.7 1.2-9.2.2-9.5-6.5z" fill="#7fb7ae" />
      <path d="M25.5 12.5c-4-.2-7.6 2.2-9.5 6.5 4.7 1.2 9.2.2 9.5-6.5z" fill="#7fb7ae" />
    </svg>
  );
}

export default function SiteHeader({ siteName }: { siteName: string }) {
  const pathname = usePathname() || '/';
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const wrapRef = useRef<HTMLElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); toggleRef.current?.focus(); } };
    const onClick = (e: MouseEvent) => { if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('click', onClick); };
  }, [open]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 921px)');
    const onChange = (m: MediaQueryListEvent) => { if (m.matches) setOpen(false); };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <header className={`nav-wrap ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`} id="site-header" ref={wrapRef}>
      <nav className="nav" aria-label="Main">
        <Link className="brand" href="/" aria-label={`${siteName} home`}>
          <BrandMark />
          <span className="brand-name">{siteName}</span>
        </Link>
        <ul className="nav-links">
          {NAV.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={isActive(l.href) ? 'is-active' : ''} aria-current={isActive(l.href) ? 'page' : undefined}>{l.label}</Link>
            </li>
          ))}
        </ul>
        <Link className="btn btn-primary btn-sm nav-cta" href="/contact">Free trial class</Link>
        <button
          ref={toggleRef}
          className="nav-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="nav-toggle-open"><Icon name="menu" /></span>
          <span className="nav-toggle-close"><Icon name="close" /></span>
        </button>
      </nav>
      <div className="mobile-menu" id="mobile-menu">
        <ul>
          <li><Link href="/" className={pathname === '/' ? 'is-active' : ''}>Home</Link></li>
          {NAV.map((l) => (
            <li key={l.href}><Link href={l.href} className={isActive(l.href) ? 'is-active' : ''}>{l.label}</Link></li>
          ))}
          <li><Link href="/contact" className="btn btn-primary">Book a free trial class</Link></li>
        </ul>
      </div>
    </header>
  );
}
