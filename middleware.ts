import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const CANONICAL_HOST = "drdivyaplasticsurgeon.com";
const WWW_HOST = `www.${CANONICAL_HOST}`;

const LEGACY_REDIRECTS: Record<string, string> = {
  "/blog/plastic-surgery-treatments-hyderabad": "/services",
  "/blog/comprehensive-guide-to-breast-reconstruction-with-drdivya":
    "/blog/breast-reconstruction-surgery",
  "/blog/blog-1783155145253": "/blog/hernia-repair-with-tummy-tuck",
};

export function middleware(request: NextRequest) {
  const hostname = request.nextUrl.hostname.toLowerCase();

  if (hostname === WWW_HOST) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.hostname = CANONICAL_HOST;
    redirectUrl.protocol = "https:";
    return NextResponse.redirect(redirectUrl, 308);
  }

  const pathname = request.nextUrl.pathname.toLowerCase().replace(/\/+$/, "") || "/";
  const legacyTarget = LEGACY_REDIRECTS[pathname];
  if (legacyTarget) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = legacyTarget;
    redirectUrl.search = "";
    redirectUrl.protocol = "https:";
    redirectUrl.hostname = CANONICAL_HOST;
    return NextResponse.redirect(redirectUrl, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
