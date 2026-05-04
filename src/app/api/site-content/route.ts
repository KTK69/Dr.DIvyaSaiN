import { NextResponse } from "next/server";
import { getStoredSiteContent } from "@/lib/site-content-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const payload = await getStoredSiteContent();

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
