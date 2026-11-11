import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';

export const generateMetadata = () => buildMetadata({ title: 'Thank you', path: '/thank-you', noindex: true });

export default function ThankYouPage() {
  return (
    <section className="page-hero">
      <div className="container">
        <div className="checkmark">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
        </div>
        <h1>Thank you. We have your request.</h1>
        <p className="lede">A confirmation is on its way to your inbox, and a teacher will contact you within one working day to fix your free trial class.</p>
        <p><Link className="btn btn-primary" href="/">Back to home</Link> <Link className="btn btn-ghost" href="/blog">Read the journal</Link></p>
      </div>
    </section>
  );
}
