import Link from 'next/link';
import PageHero from '@/components/ui/PageHero';
import CtaBand from '@/components/ui/CtaBand';
import PostCard from '@/components/cards/PostCard';
import { getBlogs } from '@/lib/api';
import { buildMetadata } from '@/lib/seo';

type Props = { searchParams: Promise<{ page?: string; category?: string }> };

const parse = async (sp: Props['searchParams']) => {
  const q = await sp;
  const page = Math.max(1, parseInt(q.page || '1', 10) || 1);
  const category = typeof q.category === 'string' ? q.category.slice(0, 60) : '';
  return { page, category };
};

export async function generateMetadata({ searchParams }: Props) {
  const { page, category } = await parse(searchParams);
  const title = category ? `${category} articles` : 'Yoga journal: guides on yoga, breathing and wellness';
  return buildMetadata({
    title: page > 1 ? `${title} (page ${page})` : title,
    description: 'Practical guides on yoga, pranayama, back care and everyday wellness for people in India, written by our teachers.',
    // Filtered and paginated views point back to the main journal so they do not compete with it.
    path: '/blog',
    noindex: Boolean(category) || page > 1,
  });
}

export default async function BlogPage({ searchParams }: Props) {
  const { page: want, category: wantCat } = await parse(searchParams);
  const { posts, categories, category, page, pages } = await getBlogs(want, wantCat);
  const base = `/blog?${category ? `category=${encodeURIComponent(category)}&` : ''}`;

  return (
    <>
      <PageHero title={category || 'The journal'} lede="Practical guides on yoga, breathing and everyday wellness, written by our teachers for people with busy lives in India." />
      <section className="section-tight">
        <div className="container">
          {categories.length > 1 || category ? (
            <nav className="chip-row" aria-label="Filter articles by category">
              <Link className={`chip-link ${!category ? 'is-active' : ''}`} href="/blog" aria-current={!category ? 'page' : undefined}>All</Link>
              {categories.map((c) => (
                <Link key={c} className={`chip-link ${c === category ? 'is-active' : ''}`} href={`/blog?category=${encodeURIComponent(c)}`} aria-current={c === category ? 'page' : undefined}>{c}</Link>
              ))}
            </nav>
          ) : null}

          {posts.length ? (
            <>
              <div className="post-grid">{posts.map((p, i) => <PostCard key={p.id} post={p} index={i} />)}</div>
              {pages > 1 ? (
                <nav className="pagination" aria-label="Pagination">
                  {page > 1 ? <Link href={`${base}page=${page - 1}`} rel="prev">Previous</Link> : null}
                  {Array.from({ length: pages }, (_, i) => i + 1).map((i) =>
                    i === page ? <span key={i} className="is-current" aria-current="page">{i}</span> : <Link key={i} href={`${base}page=${i}`}>{i}</Link>,
                  )}
                  {page < pages ? <Link href={`${base}page=${page + 1}`} rel="next">Next</Link> : null}
                </nav>
              ) : null}
            </>
          ) : (
            <div className="empty-panel">
              <h2>No articles here yet</h2>
              <p>{category ? 'There are no published articles in this category.' : 'We are writing our first articles. Check back soon.'}</p>
              {category ? <Link className="btn btn-ghost" href="/blog">See all articles</Link> : null}
            </div>
          )}
        </div>
      </section>
      <CtaBand title="Read it, then try it." text="A teacher can show you in one class what an article takes a page to explain." />
    </>
  );
}
