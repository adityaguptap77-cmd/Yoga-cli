import Link from 'next/link';
import PageHero from '@/components/ui/PageHero';
import CtaBand from '@/components/ui/CtaBand';
import { getSettings } from '@/lib/api';
import { buildMetadata } from '@/lib/seo';
import { PRINCIPLES } from '@/content/home';

export async function generateMetadata() {
  const s = await getSettings();
  return buildMetadata({
    title: `About ${s.site_name} and ${s.founder_name}`,
    description: `Meet ${s.founder_name}, ${s.founder_title.toLowerCase()} at ${s.site_name} in ${s.city}, and the principles behind our small-batch yoga classes.`,
    path: '/about',
  });
}

export default async function AboutPage() {
  const s = await getSettings();
  return (
    <>
      <PageHero title="A studio built so nobody gets lost at the back" lede="We teach yoga the way we wish it had been taught to us: slowly, specifically and without any performance." />
      <section className="section-tight" aria-labelledby="founder-title">
        <div className="container founder">
          <div className="founder-photo">
            <div className="frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.founder_photo} alt={`${s.founder_name}, ${s.founder_title.toLowerCase()} at ${s.site_name}`} width={440} height={550} />
            </div>
          </div>
          <div className="founder-body">
            <h2 id="founder-title">{s.founder_name}</h2>
            <p className="founder-role">{s.founder_title}</p>
            {s.founder_quote ? <blockquote className="quote">&ldquo;{s.founder_quote}&rdquo;</blockquote> : null}
            {s.founder_bio.split(/\n{2,}/).filter(Boolean).map((para, i) => <p key={i}>{para}</p>)}
            <p style={{ marginTop: '1.4rem' }}><Link className="btn btn-primary" href="/contact">Meet {s.founder_name} in a trial class</Link></p>
          </div>
        </div>
      </section>
      <section className="section" aria-labelledby="values-title">
        <div className="container split">
          <div className="split-sticky">
            <h2 id="values-title">What we hold ourselves to</h2>
            <p className="lede">Four commitments we make to every student, from the first message to the hundredth class.</p>
          </div>
          <ol className="principles">{PRINCIPLES.map((p) => <li className="principle" key={p.title}><h3>{p.title}</h3><p>{p.text}</p></li>)}</ol>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
