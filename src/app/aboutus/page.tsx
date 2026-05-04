import type { Metadata } from "next";
import AboutPage from "@/app/about/page";
import { getEditablePageMetadata } from "@/lib/page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return getEditablePageMetadata("aboutUs");
}

export default function AboutUsPage() {
  return <AboutPage />;
}
