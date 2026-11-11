import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHero from '@/components/ui/PageHero';
import { getSettings } from '@/lib/api';
import { buildMetadata } from '@/lib/seo';
import { PAGES, UPDATED } from '@/content/legal';

type Props = { params: Promise<{ slug: string[] }> };
const find = (slug: string[]) => (slug.length === 1 && Object.prototype.hasOwnProperty.call(PAGES, slug[0]) ? { key: slug[0], page: PAGES[slug[0]] } : null);

export async function generateMetadata({ params }: Props) {
  const hit = find((await params).slug);
  if (!hit) return { title: 'Page not found', robots: { index: false, follow: false } };
  return buildMetadata({ title: hit.page.title, description: hit.page.description, path: `/${hit.key}` });
}

export default async function LegalPage({ params }: Props) {
  const hit = find((await params).slug);
  if (!hit) notFound();
  const s = await getSettings();
  return (
    <>
      <PageHero title={hit.page.title} lede={`Last updated ${UPDATED}`} />
      <section className="section-tight">
        <div className="container container-narrow">
          <article className="prose legal">
            {hit.page.sections.map((sec) => (
              <div key={sec.h}>
                <h2>{sec.h}</h2>
                {(sec.p || []).map((para, i) => <p key={i}>{para}</p>)}
                {sec.ul?.length ? <ul>{sec.ul.map((li) => <li key={li}>{li}</li>)}</ul> : null}
              </div>
            ))}
            <hr />
            <p>Questions about this page? Write to us{s.email ? <> at <a href={`mailto:${s.email}`}>{s.email}</a></> : null} or use the <Link href="/contact">contact form</Link>.</p>
          </article>
        </div>
      </section>
    </>
  );
}
