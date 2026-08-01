import type { Metadata } from "next";
import DoctorsTalkPageContent from "@/components/doctors-talk/DoctorsTalkPageContent";
import { getEditablePageMetadata } from "@/lib/page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return getEditablePageMetadata("drVideo");
}

export default function DrVideoPage() {
  return <DoctorsTalkPageContent />;
}
