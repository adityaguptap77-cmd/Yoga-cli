import type { ReactNode } from 'react';

export default function PageHero({ title, lede, children }: { title: ReactNode; lede?: ReactNode; children?: ReactNode }) {
  return (
    <section className="page-hero">
      <div className="container">
        {children}
        <h1>{title}</h1>
        {lede ? <p className="lede">{lede}</p> : null}
      </div>
    </section>
  );
}
