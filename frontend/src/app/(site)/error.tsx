'use client';

import Link from 'next/link';

export default function SiteError({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="page-hero">
      <div className="container">
        <h1>Something went wrong on our side</h1>
        <p className="lede">The page could not load just now. Please try again in a moment. Your details were not lost, because nothing was sent.</p>
        <p>
          <button className="btn btn-primary" type="button" onClick={reset}>Try again</button>{' '}
          <Link className="btn btn-ghost" href="/">Go to home</Link>
        </p>
      </div>
    </section>
  );
}
