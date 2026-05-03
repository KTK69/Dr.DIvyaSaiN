import type { Metadata } from "next";
import DoctorsTalkPage from "@/app/doctors-talk/page";
import { buildStaticPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildStaticPageMetadata(
  "Doctor Videos & Educational Talks | Dr. Divya Sai Narsingam",
  "Explore doctor talk videos and educational patient guidance from Dr. Divya Sai Narsingam.",
  "/drvideo",
);

export default function DrVideoPage() {
  return <DoctorsTalkPage />;
}