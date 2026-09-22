import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { getStoredSiteContent } from "@/lib/site-content-store";
import { getBlogRouteSlug, normalizeBlogSlug } from "@/lib/blog-links";
import type {
  AboutContent,
  AppointmentRequest,
  AppointmentResponse,
  Blog,
  Review,
  Service,
} from "@/types/content";

const APPOINTMENTS_PATH = path.join(
  process.env.SITE_CONTENT_DATA_DIR?.trim() || path.join(process.cwd(), "data"),
  "appointments.runtime.json",
);

export async function getBlogs(): Promise<Blog[]> {
  const { content } = await getStoredSiteContent();
  return content.blog;
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  const blogs = await getBlogs();
  const normalizedSlug = normalizeBlogSlug(slug);
  return blogs.find((blog) => getBlogRouteSlug(blog) === normalizedSlug) ?? null;
}

export async function getServices(): Promise<Service[]> {
  const { content } = await getStoredSiteContent();
  return content.services;
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const services = await getServices();
  return services.find((service) => service.slug === slug) ?? null;
}

export async function getReviews(): Promise<Review[]> {
  const { content } = await getStoredSiteContent();
  return content.testimonials;
}

export async function getAboutContent(): Promise<AboutContent> {
  const { content } = await getStoredSiteContent();
  return content.about;
}

export async function saveAppointment(
  payload: AppointmentRequest,
): Promise<AppointmentResponse> {
  const id = `appt-${randomUUID()}`;
  const directory = path.dirname(APPOINTMENTS_PATH);
  await mkdir(directory, { recursive: true });

  let appointments: Array<AppointmentRequest & { id: string; createdAt: string }> = [];
  try {
    const stored = JSON.parse(await readFile(APPOINTMENTS_PATH, "utf8")) as unknown;
    if (Array.isArray(stored)) appointments = stored as typeof appointments;
  } catch {
  }

  appointments.push({ ...payload, id, createdAt: new Date().toISOString() });
  const temporaryPath = `${APPOINTMENTS_PATH}.${process.pid}.${randomUUID()}.tmp`;
  await writeFile(temporaryPath, JSON.stringify(appointments, null, 2), "utf8");
  await rename(temporaryPath, APPOINTMENTS_PATH);

  return {
    ok: true,
    id,
    message: "Appointment request submitted successfully.",
  };
}
