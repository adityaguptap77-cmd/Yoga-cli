/** Server-side data fetching. Runs only in Server Components, route handlers and metadata functions. */
import { cache } from 'react';
import { BACKEND_URL } from './config';
import type { FormOptions, Post, PostSummary, Review, Settings, Faq } from './types';

async function get<T>(path: string): Promise<T | null> {
  const res = await fetch(`${BACKEND_URL}/api${path}`, { cache: 'no-store' });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Backend request failed: ${path} (${res.status})`);
  return (await res.json()) as T;
}

async function need<T>(path: string): Promise<T> {
  const data = await get<T>(path);
  if (!data) throw new Error(`Backend returned nothing for ${path}`);
  return data;
}

/** Cached per request, so the layout and the page can both ask without two network calls. */
export const getSettings = cache(async (): Promise<Settings> => (await need<{ settings: Settings }>('/settings')).settings);

export const getFormOptions = cache(() => need<FormOptions>('/form-options'));

export const getHome = cache(() => need<{ posts: PostSummary[]; reviews: Review[] }>('/home'));

export interface BlogListResult {
  posts: PostSummary[];
  categories: string[];
  category: string;
  page: number;
  pages: number;
  total: number;
}

export const getBlogs = (page: number, category: string) =>
  need<BlogListResult>(`/blogs?page=${page}${category ? `&category=${encodeURIComponent(category)}` : ''}`);

export interface BlogResult { post: Post; faqs: Faq[]; related: PostSummary[] }
export const getBlog = cache((slug: string) => get<BlogResult>(`/blogs/${encodeURIComponent(slug)}`));

export const getReviews = async (): Promise<Review[]> => (await need<{ reviews: Review[] }>('/reviews?limit=100')).reviews;

export const getSitemapPosts = async () =>
  (await need<{ posts: { slug: string; title: string; cover_image: string; updated_at: string; published_at: string }[] }>('/sitemap-data')).posts;
