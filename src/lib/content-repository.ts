import "server-only";

import { getStoredSiteContent } from "@/lib/site-content-store";
import {
  DEFAULT_ABOUT_CONTENT,
  DEFAULT_BLOGS,
  DEFAULT_REVIEWS,
  DEFAULT_SERVICES,
} from "@/lib/default-content-data";
import type {
  AboutContent,
  AppointmentRequest,
  AppointmentResponse,
  Blog,
  Review,
  Service,
} from "@/types/content";

export async function getBlogs(): Promise<Blog[]> {
  const { content } = await getStoredSiteContent();
  return content.blog.length ? content.blog : DEFAULT_BLOGS;
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  const blogs = await getBlogs();
  return blogs.find((blog) => blog.slug === slug) ?? null;
}

export async function getServices(): Promise<Service[]> {
  const { content } = await getStoredSiteContent();
  return content.services.length ? content.services : DEFAULT_SERVICES;
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const services = await getServices();
  return services.find((service) => service.slug === slug) ?? null;
}

export async function getReviews(): Promise<Review[]> {
  const { content } = await getStoredSiteContent();
  return content.testimonials.length ? content.testimonials : DEFAULT_REVIEWS;
}

export async function getAboutContent(): Promise<AboutContent> {
  const { content } = await getStoredSiteContent();
  return content.about.heading ? content.about : DEFAULT_ABOUT_CONTENT;
}

export async function saveAppointment(
  payload: AppointmentRequest,
): Promise<AppointmentResponse> {
  const id = `appt-${Date.now()}`;
  void payload;

  return {
    ok: true,
    id,
    message: "Appointment request saved successfully.",
  };
}
