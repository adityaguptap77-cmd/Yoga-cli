import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/config';
import { getSitemapPosts } from '@/lib/api';
import { PAGES } from '@/content/legal';

export const dynamic = 'force-dynamic';

/** Rebuilt on every request from the backend, so a newly published post appears at once and an unpublished one disappears. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const fixed: [string, number, MetadataRoute.Sitemap[number]['changeFrequency']][] = [
    ['/', 1, 'weekly'], ['/services', 0.9, 'monthly'], ['/why-yovana', 0.8, 'monthly'], ['/about', 0.8, 'monthly'],
    ['/blog', 0.8, 'daily'], ['/reviews', 0.6, 'weekly'], ['/contact', 0.9, 'monthly'],
  ];
  let posts: Awaited<ReturnType<typeof getSitemapPosts>> = [];
  try { posts = await getSitemapPosts(); } catch { /* backend down: still serve the static pages */ }

  return [
    ...fixed.map(([p, priority, changeFrequency]) => ({ url: SITE_URL + (p === '/' ? '/' : p), lastModified: now, changeFrequency, priority })),
    ...posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: new Date((p.updated_at || p.published_at || '').replace(' ', 'T') + (/Z|[+-]\d\d:?\d\d$/.test(p.updated_at || '') ? '' : 'Z')),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      ...(p.cover_image ? { images: [p.cover_image.startsWith('http') ? p.cover_image : SITE_URL + p.cover_image] } : {}),
    })),
    ...Object.keys(PAGES).map((slug) => ({ url: `${SITE_URL}/${slug}`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.3 })),
  ];
}
