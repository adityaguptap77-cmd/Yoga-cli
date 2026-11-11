'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';

interface Step { title: string; text: string }

/** Four steps joined by a line that draws itself once the section scrolls into view. */
export default function JourneySection({ steps }: { steps: Step[] }) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) { setInView(true); return; }
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { setInView(true); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className={`section journey ${inView ? 'is-in' : ''}`} aria-labelledby="journey-title" ref={ref}>
      <div className="container">
        <div className="section-head">
          <h2 id="journey-title">From first message to first class</h2>
          <p>No forms that disappear into a void. A real person replies, usually within one working day.</p>
        </div>
        <ol className="journey-list">
          {steps.map((j, i) => (
            <li key={j.title} className="journey-step" style={{ ['--i' as string]: i } as CSSProperties}>
              <span className="journey-num" aria-hidden="true">{i + 1}</span>
              <h3>{j.title}</h3>
              <p>{j.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
