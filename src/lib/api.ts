import "server-only";

import {
  getBlogBySlug,
  getBlogs,
  getServiceBySlug,
  getServices,
} from "@/lib/content-repository";
import type {
  Blog,
  Service,
} from "@/types/content";

export async function fetchBlogs(): Promise<Blog[]> {
  return getBlogs();
}

export async function fetchBlogBySlug(slug: string): Promise<Blog | null> {
  return getBlogBySlug(slug);
}

export async function fetchServices(): Promise<Service[]> {
  return getServices();
}

export async function fetchServiceBySlug(slug: string): Promise<Service | null> {
  return getServiceBySlug(slug);
}
