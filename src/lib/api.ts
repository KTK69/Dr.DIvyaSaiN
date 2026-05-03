import {
  getBlogBySlug,
  getBlogs,
  getServiceBySlug,
  getServices,
} from "@/lib/content-repository";
import type {
  AppointmentRequest,
  AppointmentResponse,
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

export async function submitAppointment(
  payload: AppointmentRequest,
): Promise<AppointmentResponse> {
  const response = await fetch("/api/appointments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const fallback = {
      ok: false,
      message: "Unable to save appointment request.",
    };
    return fallback;
  }

  return (await response.json()) as AppointmentResponse;
}