import type { Metadata } from "next";
import AboutPageContent from "@/components/about/AboutPageContent";
import { getEditablePageMetadata } from "@/lib/page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return getEditablePageMetadata("aboutUs");
}

export default function AboutUsPage() {
  return <AboutPageContent />;
}
