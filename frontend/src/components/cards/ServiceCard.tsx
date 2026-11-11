import Link from 'next/link';
import Icon from '../ui/Icon';
import Reveal from '../ui/Reveal';
import type { Service } from '@/lib/types';

export default function ServiceCard({ s, detailed = false, index = 0 }: { s: Service; detailed?: boolean; index?: number }) {
  return (
    <Reveal as="article" className={`bento-card tint-${s.tint}`} tilt index={index}>
      <div className="bento-icon"><Icon name={s.icon} /></div>
      <h3>{s.title}</h3>
      <p>{s.blurb}</p>
      {detailed ? (
        <>
          <ul className="bento-points">
            {s.points.map((pt) => (
              <li key={pt}><Icon name="check" size={17} /><span>{pt}</span></li>
            ))}
          </ul>
          <p className="bento-for"><strong>Good for:</strong> {s.forWho}</p>
        </>
      ) : null}
      <ul className="bento-meta">
        <li>{s.duration}</li>
        <li>{s.format}</li>
      </ul>
      <Link className="text-link bento-link" href={`/contact?class=${encodeURIComponent(s.title)}`}>
        Try a free class <Icon name="arrow" size={18} />
      </Link>
    </Reveal>
  );
}
