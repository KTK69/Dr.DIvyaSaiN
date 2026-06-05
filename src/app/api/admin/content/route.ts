import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, isValidSessionToken } from "@/lib/admin-auth";
import {
  getSiteContentPersistenceDiagnostics,
  getStoredSiteContent,
  isSiteContentPersistenceConfigured,
  saveStoredSiteContent,
} from "@/lib/site-content-store";
import { mergeStoredSiteContent } from "@/lib/site-content-utils";
import { SITE_CONTENT_CACHE_HEADERS } from "@/lib/site-content-headers";
import { DEFAULT_SITE_CONTENT, type SiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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
  return NextResponse.json(
    {
      ok: true,
      ...payload,
      diagnostics: getSiteContentPersistenceDiagnostics(),
    },
    {
      headers: SITE_CONTENT_CACHE_HEADERS,
    },
  );
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
        message: "Persistence is not configured for this deployment.",
        diagnostics: getSiteContentPersistenceDiagnostics(),
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

  const mergedContent = mergeStoredSiteContent(DEFAULT_SITE_CONTENT, payload.content);
  try {
    const saved = await saveStoredSiteContent(mergedContent);

    return NextResponse.json(
      {
        ok: true,
        ...saved,
        diagnostics: getSiteContentPersistenceDiagnostics(),
      },
      {
        headers: SITE_CONTENT_CACHE_HEADERS,
      },
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown persistence error while saving site content.";

    return NextResponse.json(
      {
        ok: false,
        message: `Site content save failed: ${message}`,
        diagnostics: getSiteContentPersistenceDiagnostics(),
      },
      { status: 500 },
    );
  }
}
