import Link from 'next/link';
import BreathOrb from '@/components/home/BreathOrb';
import JourneySection from '@/components/home/JourneySection';
import ReviewsCarousel from '@/components/home/ReviewsCarousel';
import ServiceCard from '@/components/cards/ServiceCard';
import PostCard from '@/components/cards/PostCard';
import FaqList from '@/components/ui/FaqList';
import CtaBand from '@/components/ui/CtaBand';
import Icon from '@/components/ui/Icon';
import JsonLd from '@/components/seo/JsonLd';
import { getHome, getSettings } from '@/lib/api';
import { buildMetadata } from '@/lib/seo';
import { businessLd, faqLd } from '@/lib/jsonld';
import { HOME_FAQS, JOURNEY, PRINCIPLES } from '@/content/home';
import { SERVICES } from '@/content/services';

export async function generateMetadata() {
  const s = await getSettings();
  return buildMetadata({
    title: `${s.site_name}: Small-batch yoga classes in ${s.city} and online`,
    titleIsFull: true,
    description: `Beginner-friendly yoga in ${s.city}, India, in small classes with a teacher who watches your form. Studio and live online. Book a free trial class.`,
    path: '/',
  });
}

export default async function HomePage() {
  const [s, { posts, reviews }] = await Promise.all([getSettings(), getHome()]);

  return (
    <>
      <JsonLd data={[businessLd(s), faqLd(HOME_FAQS)]} />

      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero-grid">
          <div className="hero-copy">
            <h1 id="hero-title" className="hero-lines">
              <span className="line"><span>Breathe first.</span></span>
              <span className="line"><span>Then move.</span></span>
            </h1>
            <p className="hero-sub">Small classes in {s.city} and live online, where the teacher knows your name, your tight spots and what you came for. Beginners are the point, not the exception.</p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href="/contact">Book a free trial class</Link>
              <Link className="btn btn-ghost" href="/services">See our classes</Link>
            </div>
            <ul className="hero-meta">
              {['Beginners welcome', 'Studio and live online', 'No sign-up pressure'].map((t) => (
                <li key={t}><Icon name="check" size={18} />{t}</li>
              ))}
            </ul>
          </div>
          <BreathOrb />
        </div>
      </section>

      <section className="section" aria-labelledby="approach-title">
        <div className="container split">
          <div className="split-sticky">
            <h2 id="approach-title">A calmer way to learn yoga</h2>
            <p className="lede">Most people do not quit yoga because it is hard. They quit because nobody noticed them struggling. We built the studio around fixing that.</p>
            <Link className="text-link" href="/about">Meet the teacher <Icon name="arrow" size={18} /></Link>
          </div>
          <ol className="principles">
            {PRINCIPLES.map((p) => <li className="principle" key={p.title}><h3>{p.title}</h3><p>{p.text}</p></li>)}
          </ol>
        </div>
      </section>

      <section className="section" aria-labelledby="classes-title" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <h2 id="classes-title">Classes for how you actually live</h2>
            <p>Pick by the problem you want help with, not by the Sanskrit name.</p>
          </div>
          <div className="bento">
            {SERVICES.map((svc, i) => <ServiceCard key={svc.slug} s={svc} index={i} />)}
          </div>
          <p style={{ marginTop: '2rem' }}><Link className="btn btn-ghost" href="/services">See all eight classes</Link></p>
        </div>
      </section>

      <JourneySection steps={JOURNEY} />

      <section className="section" aria-labelledby="reviews-title" style={{ paddingTop: 0 }}>
        <div className="container">
          {reviews.length ? (
            <>
              <ReviewsCarousel reviews={reviews} />
              <p><Link className="text-link" href="/reviews">Read all reviews or share yours <Icon name="arrow" size={18} /></Link></p>
            </>
          ) : (
            <>
              <div className="section-head"><h2 id="reviews-title">What students say</h2></div>
              <div className="empty-panel">
                <h3>Be the first to review us</h3>
                <p>Attended a class? Tell others what it was like.</p>
                <Link className="btn btn-ghost" href="/reviews#write">Write a review</Link>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="section section-dark on-dark" aria-labelledby="why-title">
        <div className="container">
          <h2 id="why-title" style={{ maxWidth: '20ch' }}>Why a studio beats a chain or a free video</h2>
          <p className="lede" style={{ maxWidth: '40rem' }}>An honest look at the three ways most people try yoga, and where each one falls short.</p>
          <div className="take-grid">
            <div className="take is-us"><h3>Our studio</h3><p>Small rooms, a teacher who watches your form, and a plan built around your body.</p></div>
            <div className="take"><h3>Large chains</h3><p>Convenient and everywhere, but big rooms make personal correction hard to get.</p></div>
            <div className="take"><h3>Free videos</h3><p>Great for keeping a habit going, with nobody to tell you when you are doing it wrong.</p></div>
          </div>
          <Link className="btn btn-primary" href="/why-yovana">See the full comparison</Link>
        </div>
      </section>

      {posts.length ? (
        <section className="section" aria-labelledby="journal-title">
          <div className="container">
            <div className="section-head">
              <h2 id="journal-title">From the journal</h2>
              <Link className="text-link" href="/blog">All articles <Icon name="arrow" size={18} /></Link>
            </div>
            <div className="post-grid">{posts.map((p, i) => <PostCard key={p.id} post={p} index={i} />)}</div>
          </div>
        </section>
      ) : null}

      <section className="section" aria-labelledby="faq-title" style={{ paddingTop: 0 }}>
        <div className="container container-narrow">
          <h2 id="faq-title" className="center">Questions people ask before their first class</h2>
          <FaqList faqs={HOME_FAQS} />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
