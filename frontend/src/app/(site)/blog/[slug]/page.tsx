import Link from 'next/link';
import { notFound } from 'next/navigation';
import CtaBand from '@/components/ui/CtaBand';
import FaqList from '@/components/ui/FaqList';
import PostCard from '@/components/cards/PostCard';
import JsonLd from '@/components/seo/JsonLd';
import { getBlog, getSettings } from '@/lib/api';
import { buildMetadata } from '@/lib/seo';
import { articleLd, breadcrumbLd, faqLd } from '@/lib/jsonld';
import { fmtDate, isoDate, truncate } from '@/lib/format';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const data = await getBlog(slug);
  if (!data) return { title: 'Article not found', robots: { index: false, follow: false } };
  const { post } = data;
  return buildMetadata({
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.cover_image || undefined,
    type: 'article',
    keywords: post.keywords,
    article: { published: isoDate(post.published_at), modified: isoDate(post.updated_at || post.published_at), section: post.category, author: post.author },
  });
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const [data, s] = await Promise.all([getBlog(slug), getSettings()]);
  if (!data) notFound();
  const { post, faqs, related } = data;

  return (
    <>
      <JsonLd data={[articleLd(s, post), breadcrumbLd(post), ...(faqs.length ? [faqLd(faqs)] : [])]} />

      <header className="article-head">
        <div className="container container-narrow">
          <ol className="breadcrumb" aria-label="Breadcrumb">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/blog">Journal</Link></li>
            <li aria-current="page">{truncate(post.title, 40)}</li>
          </ol>
          <h1>{post.title}</h1>
          <div className="article-meta">
            <span className="cat"><Link href={`/blog?category=${encodeURIComponent(post.category)}`}>{post.category}</Link></span>
            <span>By {post.author}</span>
            {post.published_at ? <time dateTime={isoDate(post.published_at)}>{fmtDate(post.published_at)}</time> : null}
            <span>{post.reading_minutes} min read</span>
          </div>
        </div>
      </header>

      <article className="section-tight">
        <div className="container container-narrow">
          {post.cover_image ? (
            <figure className="article-cover">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.cover_image} alt={post.cover_alt || post.title} width={1200} height={630} />
            </figure>
          ) : null}
          {post.excerpt ? <p className="lede">{post.excerpt}</p> : null}
          {/* content_html is sanitised by the backend (sanitize-html allow-list) before it is stored. */}
          <div className="prose" dangerouslySetInnerHTML={{ __html: post.content_html }} />

          {faqs.length ? (
            <section className="article-faq" aria-labelledby="post-faq-title">
              <h2 id="post-faq-title">Frequently asked questions</h2>
              <FaqList faqs={faqs} />
            </section>
          ) : null}

          <aside className="author-note">
            <p><strong>A note on safety.</strong> This article is general information, not medical advice. If you have an injury, are pregnant or manage a health condition, speak to your doctor before you start. <Link href="/disclaimer">Read our disclaimer</Link>.</p>
          </aside>
        </div>
      </article>

      <CtaBand title="Want a teacher to guide you?" text="Book a free trial class and try these ideas with someone watching your form." />

      {related.length ? (
        <section className="section" aria-labelledby="related-title">
          <div className="container">
            <div className="section-head"><h2 id="related-title">Keep reading</h2></div>
            <div className="post-grid">{related.map((p, i) => <PostCard key={p.id} post={p} index={i} />)}</div>
          </div>
        </section>
      ) : null}
    </>
  );
}
