import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE, SITE_URL } from './config';
import { getSettings } from './api';

export interface SeoInput {
  title?: string;
  /** When true the title is used as written, without "| Site name" appended. */
  titleIsFull?: boolean;
  description?: string;
  path: string;
  image?: string;
  type?: 'website' | 'article';
  keywords?: string;
  noindex?: boolean;
  article?: { published?: string; modified?: string; section?: string; author?: string };
}

export const absoluteUrl = (path: string) => (/^https?:\/\//.test(path) ? path : SITE_URL + path);

/** One place that turns page details into title, canonical, Open Graph, Twitter and robots tags. */
export async function buildMetadata(input: SeoInput): Promise<Metadata> {
  const s = await getSettings();
  const title = input.title ? (input.titleIsFull ? input.title : `${input.title} | ${s.site_name}`) : `${s.site_name}: ${s.tagline}`;
  const description = input.description || s.tagline;
  const image = absoluteUrl(input.image || DEFAULT_OG_IMAGE);
  const url = absoluteUrl(input.path);

  return {
    metadataBase: new URL(SITE_URL),
    title: { absolute: title },
    description,
    keywords: input.keywords || undefined,
    alternates: { canonical: url },
    robots: input.noindex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
    openGraph: {
      siteName: s.site_name,
      locale: 'en_IN',
      type: input.type || 'website',
      title,
      description,
      url,
      images: [{ url: image }],
      ...(input.article
        ? { publishedTime: input.article.published, modifiedTime: input.article.modified, section: input.article.section, authors: input.article.author ? [input.article.author] : undefined }
        : {}),
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}
