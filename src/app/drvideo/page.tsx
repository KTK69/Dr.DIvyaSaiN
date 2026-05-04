import type { Metadata } from "next";
import DoctorsTalkPage from "@/app/doctors-talk/page";
import { getEditablePageMetadata } from "@/lib/page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return getEditablePageMetadata("drVideo");
}

export default function DrVideoPage() {
  return <DoctorsTalkPage />;
}
