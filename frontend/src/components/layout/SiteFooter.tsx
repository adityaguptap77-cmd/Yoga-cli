import Link from 'next/link';
import Icon from '../ui/Icon';
import { LEGAL_LINKS } from '@/content/legal';
import type { Settings } from '@/lib/types';

export default function SiteFooter({ settings: s }: { settings: Settings }) {
  const year = new Date().getFullYear();
  const social = [
    { href: s.instagram, icon: 'instagram', label: 'Instagram' },
    { href: s.youtube, icon: 'youtube', label: 'YouTube' },
    { href: s.facebook, icon: 'facebook', label: 'Facebook' },
    { href: s.whatsapp ? `https://wa.me/${s.whatsapp}` : '', icon: 'whatsapp', label: 'WhatsApp' },
  ].filter((x) => x.href);

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link className="brand brand-light" href="/" aria-label={`${s.site_name} home`}>
            <svg width="34" height="34" viewBox="0 0 32 32" aria-hidden="true">
              <circle cx="16" cy="16" r="15" fill="#e4eae2" />
              <path d="M16 6c3.3 3.5 4.3 7.4 0 14-4.3-6.6-3.3-10.5 0-14z" fill="#b8741a" />
              <path d="M6.5 12.5c4-.2 7.6 2.2 9.5 6.5-4.7 1.2-9.2.2-9.5-6.5z" fill="#1f6560" />
              <path d="M25.5 12.5c-4-.2-7.6 2.2-9.5 6.5 4.7 1.2 9.2.2 9.5-6.5z" fill="#1f6560" />
            </svg>
            <span className="brand-name">{s.site_name}</span>
          </Link>
          <p>{s.tagline}. Studio and live online classes for every level.</p>
          {social.length ? (
            <ul className="social">
              {social.map((x) => (
                <li key={x.label}><a href={x.href} rel="noopener" target="_blank" aria-label={x.label}><Icon name={x.icon} /></a></li>
              ))}
            </ul>
          ) : null}
        </div>

        <nav className="footer-col" aria-label="Explore">
          <h2>Explore</h2>
          <ul>
            <li><Link href="/services">Classes</Link></li>
            <li><Link href="/why-yovana">Why choose us</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/blog">Journal</Link></li>
            <li><Link href="/reviews">Reviews</Link></li>
            <li><Link href="/contact">Book a trial</Link></li>
          </ul>
        </nav>

        <nav className="footer-col" aria-label="Legal">
          <h2>Legal</h2>
          <ul>
            {LEGAL_LINKS.map((l) => (<li key={l.href}><Link href={l.href}>{l.label}</Link></li>))}
          </ul>
        </nav>

        <div className="footer-col">
          <h2>Visit and talk</h2>
          <ul className="contact-list">
            <li><Icon name="pin" size={18} /><span>{s.address ? `${s.address}, ` : ''}{s.city}, India</span></li>
            {s.phone ? <li><Icon name="phone" size={18} /><a href={`tel:${s.phone.replace(/[^\d+]/g, '')}`}>{s.phone}</a></li> : null}
            {s.email ? <li><Icon name="mail" size={18} /><a href={`mailto:${s.email}`}>{s.email}</a></li> : null}
            <li><Icon name="clock" size={18} /><span>{s.hours}</span></li>
          </ul>
        </div>
      </div>

      <div className="container footer-base">
        <p className="footer-note">
          Yoga is a gentle practice but not a substitute for medical care. Please read our <Link href="/disclaimer">disclaimer</Link> and speak to your doctor before starting if you have a health condition.
        </p>
        <p>&copy; {year} {s.site_name}. All rights reserved.</p>
      </div>
    </footer>
  );
}
