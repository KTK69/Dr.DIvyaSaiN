export interface SeoFields {
  meta_title: string;
  meta_description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Blog extends SeoFields {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  published_at: string;
  updated_at?: string;
  category?: string;
  meta_keywords: string[];
}

export interface Service extends SeoFields {
  id: string;
  slug: string;
  name: string;
  summary: string;
  content: string;
  image: string;
  category: "reconstructive" | "cosmetic";
  key_points: string[];
  faq: FaqItem[];
  meta_keywords: string[];
}

export interface Review {
  id: string;
  patient_name: string;
  procedure: string;
  quote: string;
  rating: number;
}

export interface AboutContent extends SeoFields {
  heading: string;
  summary: string;
}

export interface AppointmentRequest {
  fullName: string;
  phone: string;
  email: string;
  concern: string;
  preferredTime?: string;
  howDidYouHear?: string;
}

export interface AppointmentResponse {
  ok: boolean;
  message: string;
  id?: string;
}