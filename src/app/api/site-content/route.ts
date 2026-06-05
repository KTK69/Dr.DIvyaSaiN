import { NextResponse } from "next/server";
import { SITE_CONTENT_CACHE_HEADERS } from "@/lib/site-content-headers";
import { getStoredSiteContent } from "@/lib/site-content-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const payload = await getStoredSiteContent();

  return NextResponse.json(payload, {
    headers: SITE_CONTENT_CACHE_HEADERS,
  });
}
