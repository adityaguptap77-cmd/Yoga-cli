import Link from 'next/link';
import PageHero from '@/components/ui/PageHero';
import CtaBand from '@/components/ui/CtaBand';
import ServiceCard from '@/components/cards/ServiceCard';
import JsonLd from '@/components/seo/JsonLd';
import { getSettings } from '@/lib/api';
import { buildMetadata } from '@/lib/seo';
import { servicesLd } from '@/lib/jsonld';
import { SERVICES } from '@/content/services';

export async function generateMetadata() {
  const s = await getSettings();
  return buildMetadata({
    title: `Yoga classes in ${s.city}: Hatha, Vinyasa, Prenatal, Online`,
    description: `Eight small-batch yoga classes in ${s.city} and online, from Hatha for beginners to prenatal, back care and private sessions.`,
    path: '/services',
    keywords: 'yoga classes, hatha yoga, beginners yoga, prenatal yoga, online yoga classes India',
  });
}

export default async function ServicesPage() {
  const s = await getSettings();
  return (
    <>
      <JsonLd data={servicesLd(s, SERVICES)} />
      <PageHero title="Classes for every body and every schedule" lede="Eight ways to practise, from your very first Hatha class to private sessions at home. Every one is taught in a small group with props and adjustments as standard." />
      <section className="section-tight">
        <div className="container">
          <div className="bento">{SERVICES.map((svc, i) => <ServiceCard key={svc.slug} s={svc} detailed index={i} />)}</div>
        </div>
      </section>
      <section className="section-tight">
        <div className="container container-narrow">
          <div className="callout">
            <h2>Not sure where to start?</h2>
            <p>Most beginners start with Hatha Foundations. If you have a specific problem, such as a stiff back, poor sleep or a stressful job, tell us on the contact form and a teacher will point you to the right class.</p>
            <p style={{ marginTop: '0.8rem' }}><Link className="btn btn-primary" href="/contact">Help me choose</Link></p>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
