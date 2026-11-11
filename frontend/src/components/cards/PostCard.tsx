import Link from 'next/link';
import Reveal from '../ui/Reveal';
import { fmtDate, isoDate, truncate } from '@/lib/format';
import type { PostSummary } from '@/lib/types';

export default function PostCard({ post: p, index = 0 }: { post: PostSummary; index?: number }) {
  return (
    <Reveal as="article" className="post-card" index={index}>
      <div className="post-media">
        {p.cover_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.cover_image} alt={p.cover_alt || ''} loading="lazy" width={640} height={360} />
        ) : null}
      </div>
      <div className="post-body">
        <div className="post-meta">
          <span className="cat">{p.category}</span>
          <time dateTime={isoDate(p.published_at)}>{fmtDate(p.published_at)}</time>
          <span>{p.reading_minutes} min read</span>
        </div>
        <h3><Link href={`/blog/${p.slug}`}>{p.title}</Link></h3>
        <p>{truncate(p.excerpt, 150)}</p>
      </div>
    </Reveal>
  );
}
