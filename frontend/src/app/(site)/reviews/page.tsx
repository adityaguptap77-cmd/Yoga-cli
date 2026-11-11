import PageHero from '@/components/ui/PageHero';
import ReviewCard from '@/components/cards/ReviewCard';
import ReviewForm from '@/components/forms/ReviewForm';
import { getReviews } from '@/lib/api';
import { buildMetadata } from '@/lib/seo';

export const generateMetadata = () =>
  buildMetadata({
    title: 'Student reviews',
    description: 'Read honest reviews from students of our small-batch yoga classes, or share your own experience.',
    path: '/reviews',
  });

export default async function ReviewsPage() {
  const reviews = await getReviews();
  return (
    <>
      <PageHero title="What our students say" lede="Honest words from the people who practise with us. Every review is read by a person before it appears here." />
      <section className="section-tight">
        <div className="container">
          {reviews.length ? (
            <div className="reviews-grid">{reviews.map((r) => <ReviewCard key={r.id} review={r} reveal />)}</div>
          ) : (
            <div className="empty-panel">
              <h2>No reviews yet</h2>
              <p>We only show reviews from real students. If you have attended a class, we would love to hear what it was like.</p>
            </div>
          )}
        </div>
      </section>
      <section className="section-tight" id="write" aria-labelledby="write-title">
        <div className="container container-narrow"><ReviewForm /></div>
      </section>
    </>
  );
}
