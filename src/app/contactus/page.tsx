import type { Metadata } from "next";
import ContactPage from "@/app/contact/page";
import { buildStaticPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildStaticPageMetadata(
  "Contact and Appointment Booking | Dr. Divya Sai Narsingam",
  "Book appointments and contact Dr. Divya Sai Narsingam for reconstructive and cosmetic surgery consultations in Hyderabad.",
  "/contactus",
);

export default function ContactUsPage() {
  return <ContactPage />;
}