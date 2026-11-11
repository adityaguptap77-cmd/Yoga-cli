import Link from 'next/link';
import PageHero from '@/components/ui/PageHero';
import Icon from '@/components/ui/Icon';
import BookingStepper from '@/components/forms/BookingStepper';
import { getFormOptions, getSettings } from '@/lib/api';
import { buildMetadata } from '@/lib/seo';

export async function generateMetadata() {
  const s = await getSettings();
  return buildMetadata({
    title: `Book a free trial yoga class in ${s.city}`,
    description: `Request a free trial yoga class at ${s.site_name}. Answer a few quick questions and a teacher will contact you within one working day.`,
    path: '/contact',
  });
}

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ class?: string }> }) {
  const [s, options, sp] = await Promise.all([getSettings(), getFormOptions(), searchParams]);
  const wanted = typeof sp.class === 'string' ? sp.class : '';
  const preselect = options.interests.find((o) => o.toLowerCase() === wanted.toLowerCase()) || '';

  return (
    <>
      <PageHero title="Book your free trial class" lede="Answer a few quick questions, one at a time. We will check them with you at the end, then a teacher will get in touch." />
      <section className="section-tight">
        <div className="container contact-grid">
          <aside aria-label="Studio details">
            <h2>What happens next</h2>
            <ol className="next-steps">
              <li>You get a confirmation email within a minute.</li>
              <li>A teacher calls or messages you, usually within one working day.</li>
              <li>You pick a trial class that suits your body and your week.</li>
            </ol>
            <ul className="info-list">
              {s.phone ? <li><span className="badge"><Icon name="phone" size={20} /></span><div><strong>Call or WhatsApp</strong><a href={`tel:${s.phone.replace(/[^\d+]/g, '')}`}>{s.phone}</a></div></li> : null}
              {s.email ? <li><span className="badge"><Icon name="mail" size={20} /></span><div><strong>Email</strong><a href={`mailto:${s.email}`}>{s.email}</a></div></li> : null}
              <li><span className="badge"><Icon name="pin" size={20} /></span><div><strong>Studio</strong><span>{s.address ? `${s.address}, ` : ''}{s.city}, India</span></div></li>
              <li><span className="badge"><Icon name="clock" size={20} /></span><div><strong>Hours</strong><span>{s.hours}</span></div></li>
            </ul>
            <p className="hint">We use your details only to arrange your class. Read our <Link href="/privacy-policy">privacy policy</Link>.</p>
          </aside>
          <div>
            <BookingStepper options={options} preselect={preselect} siteName={s.site_name} />
          </div>
        </div>
      </section>
    </>
  );
}
