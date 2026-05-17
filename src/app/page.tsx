import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import ServicesPreview from "@/components/home/ServicesPreview";
import AboutPreview from "@/components/home/AboutPreview";
import AwardsStrip from "@/components/home/AwardsStrip";
import BeforeAfterGallery from "@/components/home/BeforeAfterGallery";
import CTASection from "@/components/home/CTASection";
import JsonLd from "@/components/seo/JsonLd";
import { getEditablePageMetadata } from "@/lib/page-metadata";
import { buildSiteIdentityJsonLd } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getEditablePageMetadata("home");
}

export default function HomePage() {
  return (
    <>
      <JsonLd data={buildSiteIdentityJsonLd()} />
      <HeroSection />
      <AwardsStrip />
      <AboutPreview />
      <ServicesPreview />
      <BeforeAfterGallery />
      <CTASection />
    </>
  );
}
