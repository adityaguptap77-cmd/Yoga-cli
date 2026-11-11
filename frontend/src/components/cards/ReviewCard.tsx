import Reveal from '../ui/Reveal';
import Stars from '../ui/Stars';
import type { Review } from '@/lib/types';

function Body({ r }: { r: Review }) {
  return (
    <>
      <Stars rating={r.rating} />
      <blockquote><p>&ldquo;{r.body}&rdquo;</p></blockquote>
      <figcaption className="review-by">
        <span className="avatar" aria-hidden="true">{(r.name || '?').trim().charAt(0).toUpperCase()}</span>
        <span><strong>{r.name}</strong>{r.city ? <span>{r.city}</span> : null}</span>
      </figcaption>
    </>
  );
}

/** `reveal` animates the card in; leave it off inside a horizontally scrolling carousel. */
export default function ReviewCard({ review, reveal = false }: { review: Review; reveal?: boolean }) {
  if (reveal) return <Reveal as="figure" className="review"><Body r={review} /></Reveal>;
  return <figure className="review"><Body r={review} /></figure>;
}
