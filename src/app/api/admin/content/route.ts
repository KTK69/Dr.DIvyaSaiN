import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, isValidSessionToken } from "@/lib/admin-auth";
import {
  getStoredSiteContent,
  isSiteContentPersistenceConfigured,
  saveStoredSiteContent,
} from "@/lib/site-content-store";
import { mergeWithDefaults } from "@/lib/site-content-utils";
import { DEFAULT_SITE_CONTENT, type SiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value ?? null;
  return isValidSessionToken(token);
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const payload = await getStoredSiteContent();
  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  if (!isSiteContentPersistenceConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Persistence is not configured. Add BLOB_READ_WRITE_TOKEN in Vercel to save admin changes.",
      },
      { status: 500 },
    );
  }

  let payload: { content?: SiteContent } | null = null;

  try {
    payload = (await request.json()) as { content?: SiteContent };
  } catch {
    payload = null;
  }

  if (!payload?.content) {
    return NextResponse.json(
      { ok: false, message: "Missing content payload." },
      { status: 400 },
    );
  }

  const mergedContent = mergeWithDefaults(DEFAULT_SITE_CONTENT, payload.content);
  const saved = await saveStoredSiteContent(mergedContent);

  return NextResponse.json({
    ok: true,
    ...saved,
  });
}
