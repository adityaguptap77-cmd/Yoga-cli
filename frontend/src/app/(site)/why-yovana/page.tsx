import PageHero from '@/components/ui/PageHero';
import CtaBand from '@/components/ui/CtaBand';
import { buildMetadata } from '@/lib/seo';
import { COMPARE } from '@/content/compare';

export const generateMetadata = () =>
  buildMetadata({
    title: 'Why a small yoga studio beats chains and free videos',
    description: 'An honest comparison of small-batch studio yoga, large chain studios and free videos or apps: teacher attention, beginners, breathwork, injuries and consistency.',
    path: '/why-yovana',
  });

export default function WhyPage() {
  const c = COMPARE;
  return (
    <>
      <PageHero title="Why a small studio works better" lede="There are three common ways to learn yoga. Here is how each one handles the things that decide whether you keep going." />
      <section className="section-tight">
        <div className="container">
          <div className="compare" role="table" aria-label={`Comparison of ${c.columns.join(', ')}`}>
            <div className="compare-head" role="row">
              <div role="columnheader"><span className="sr-only">Feature</span></div>
              <div className="is-us" role="columnheader">{c.columns[0]}</div>
              <div role="columnheader">{c.columns[1]}</div>
              <div role="columnheader">{c.columns[2]}</div>
            </div>
            {c.rows.map((r) => (
              <div className="compare-row" role="row" key={r.label}>
                <div className="label" role="rowheader">{r.label}</div>
                <div className="is-us" role="cell"><span className="compare-cell-label">{c.columns[0]}</span>{r.us}</div>
                <div role="cell"><span className="compare-cell-label">{c.columns[1]}</span>{r.chain}</div>
                <div role="cell"><span className="compare-cell-label">{c.columns[2]}</span>{r.free}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section-tight">
        <div className="container container-narrow">
          <div className="callout"><h2>When a free video is enough</h2><p>{c.honest}</p></div>
        </div>
      </section>
      <CtaBand title="See the difference in one class." text="Try a free class, then compare it with what you do now." />
    </>
  );
}
