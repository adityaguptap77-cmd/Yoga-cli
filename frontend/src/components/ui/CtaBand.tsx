import Link from 'next/link';

interface CtaBandProps { title?: string; text?: string }

export default function CtaBand({
  title = 'Your first class is on us.',
  text = 'Tell us a little about yourself and a teacher will help you pick the right class. It takes about two minutes.',
}: CtaBandProps) {
  return (
    <section className="section-tight" aria-labelledby="cta-title">
      <div className="container">
        <div className="cta-band">
          <div>
            <h2 id="cta-title">{title}</h2>
            <p>{text}</p>
          </div>
          <div className="cta-actions">
            <Link className="btn btn-primary" href="/contact">Book a free trial class</Link>
            <Link className="btn btn-ghost" href="/services">See all classes</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
