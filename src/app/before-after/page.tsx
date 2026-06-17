import type { Metadata } from "next";
import BeforeAfterGallery from "@/components/home/BeforeAfterGallery";
import PageWrapper from "@/components/ui/PageWrapper";
import { getEditablePageMetadata } from "@/lib/page-metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return getEditablePageMetadata("beforeAfter");
}

export default function BeforeAfterPage() {
  return (
    <PageWrapper>
      <BeforeAfterGallery />
    </PageWrapper>
  );
}
