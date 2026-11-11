'use client';

import { useRef } from 'react';
import ReviewCard from '../cards/ReviewCard';
import Icon from '../ui/Icon';
import type { Review } from '@/lib/types';

export default function ReviewsCarousel({ reviews }: { reviews: Review[] }) {
  const track = useRef<HTMLDivElement | null>(null);

  const step = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const w = card ? card.getBoundingClientRect().width + 22 : 320;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: dir * w, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <>
      <div className="section-head">
        <h2 id="reviews-title">What students say</h2>
        {reviews.length > 1 ? (
          <div className="reviews-controls">
            <button className="icon-btn prev" type="button" aria-label="Previous reviews" onClick={() => step(-1)}><Icon name="arrow" /></button>
            <button className="icon-btn next" type="button" aria-label="Next reviews" onClick={() => step(1)}><Icon name="arrow" /></button>
          </div>
        ) : null}
      </div>
      <div className="reviews-track" ref={track} tabIndex={0} aria-label="Student reviews, scroll sideways">
        {reviews.map((r) => <ReviewCard key={r.id} review={r} />)}
      </div>
    </>
  );
}
