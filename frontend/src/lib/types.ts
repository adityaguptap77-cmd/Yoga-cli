export interface Settings {
  site_name: string;
  tagline: string;
  city: string;
  region: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  hours: string;
  instagram: string;
  youtube: string;
  facebook: string;
  founder_name: string;
  founder_title: string;
  founder_quote: string;
  founder_bio: string;
  founder_photo: string;
}

export interface Faq { q: string; a: string }

export interface PostSummary {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  cover_image: string;
  cover_alt: string;
  category: string;
  reading_minutes: number;
  published_at: string | null;
}

export interface Post extends PostSummary {
  content_html: string;
  meta_title: string;
  meta_description: string;
  keywords: string;
  author: string;
  status: string;
  updated_at: string;
}

export interface AdminPost extends Post {
  content_md: string;
  faqs: Faq[];
}

export interface Review {
  id: number;
  name: string;
  city: string;
  rating: number;
  body: string;
  created_at: string;
}

export interface AdminReview extends Review { status: 'pending' | 'approved' | 'hidden'; source: string }

export interface Lead {
  id: number;
  name: string;
  phone: string;
  email: string;
  interest: string;
  level: string;
  mode: string;
  preferred_time: string;
  message: string;
  status: string;
  notes: string;
  source: string;
  email_user_sent: number;
  email_admin_sent: number;
  created_at: string;
}

export interface FormOptions { interests: string[]; levels: string[]; modes: string[]; times: string[] }

export interface Service {
  slug: string;
  title: string;
  icon: string;
  tint: 'sage' | 'sand' | 'rose' | 'river' | 'deep';
  span: string;
  duration: string;
  format: string;
  forWho: string;
  blurb: string;
  points: string[];
}

export interface Comparison {
  columns: string[];
  rows: { label: string; us: string; chain: string; free: string }[];
  honest: string;
}

export interface LegalSection { h: string; p?: string[]; ul?: string[] }
export interface LegalPage { title: string; description: string; sections: LegalSection[] }

export const LEAD_STATUSES = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'trial_booked', label: 'Trial booked' },
  { value: 'joined', label: 'Joined' },
  { value: 'closed', label: 'Closed' },
] as const;
