import type { Metadata } from "next";
import AboutPageContent from "@/components/about/AboutPageContent";
import JsonLd from "@/components/seo/JsonLd";
import { getEditablePageMetadata } from "@/lib/page-metadata";
import { buildPhysicianJsonLd } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getEditablePageMetadata("aboutUs");
}

export default function AboutUsPage() {
  return (
    <>
      <JsonLd data={buildPhysicianJsonLd()} />
      <AboutPageContent />
    </>
  );
}
