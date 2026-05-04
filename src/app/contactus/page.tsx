import type { Metadata } from "next";
import ContactPage from "@/app/contact/page";
import { getEditablePageMetadata } from "@/lib/page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return getEditablePageMetadata("contactUs");
}

export default function ContactUsPage() {
  return <ContactPage />;
}
