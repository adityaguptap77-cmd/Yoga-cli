import { SITE_URL } from './config';
import { isoDate } from './format';
import type { Faq, Post, Service, Settings } from './types';

const abs = (p: string) => (!p ? '' : /^https?:\/\//.test(p) ? p : SITE_URL + p);

export function businessLd(s: Settings) {
  const sameAs = [s.instagram, s.youtube, s.facebook].filter(Boolean);
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    '@id': `${SITE_URL}/#business`,
    name: s.site_name,
    description: s.tagline,
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/img/logo-512.png`,
    image: `${SITE_URL}/img/og-default.jpg`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: s.city,
      addressRegion: s.region,
      addressCountry: 'IN',
      ...(s.address ? { streetAddress: s.address } : {}),
    },
    ...(s.phone ? { telephone: s.phone } : {}),
    ...(s.email ? { email: s.email } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function servicesLd(s: Settings, services: Service[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Yoga classes and services',
    itemListElement: services.map((svc, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: { '@type': 'Service', name: svc.title, description: svc.blurb, provider: { '@id': `${SITE_URL}/#business` }, areaServed: s.city },
    })),
  };
}

export function faqLd(faqs: Faq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}

export function articleLd(s: Settings, post: Post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.meta_description || post.excerpt,
    image: [post.cover_image ? abs(post.cover_image) : `${SITE_URL}/img/og-default.jpg`],
    datePublished: isoDate(post.published_at),
    dateModified: isoDate(post.updated_at || post.published_at),
    articleSection: post.category,
    keywords: post.keywords || undefined,
    author: { '@type': 'Organization', name: post.author || s.site_name },
    publisher: { '@type': 'Organization', name: s.site_name, logo: { '@type': 'ImageObject', url: `${SITE_URL}/img/logo-512.png` } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${post.slug}` },
  };
}

export function breadcrumbLd(post: Post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE_URL}/blog/${post.slug}` },
    ],
  };
}
