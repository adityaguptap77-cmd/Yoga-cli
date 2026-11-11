import Link from 'next/link';
import PageHero from '@/components/ui/PageHero';

export const metadata = { title: 'Page not found', robots: { index: false, follow: false } };

export default function NotFound() {
  return (
    <PageHero title="This page has wandered off" lede="The link may be old, or the page may have moved. Here are a few places to start again.">
      <p style={{ marginBottom: '1.2rem' }} />
      <p>
        <Link className="btn btn-primary" href="/">Go to home</Link>{' '}
        <Link className="btn btn-ghost" href="/services">See classes</Link>{' '}
        <Link className="btn btn-ghost" href="/blog">Read the journal</Link>
      </p>
    </PageHero>
  );
}
