import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, isValidSessionToken, getAdminSessionCookieOptions, getSessionToken } from "@/lib/admin-auth";

export async function GET() {
  const store = await cookies();
  const token = store.get(ADMIN_SESSION_COOKIE)?.value ?? null;
  const authenticated = isValidSessionToken(token);

  const response = NextResponse.json({ authenticated });
  if (authenticated) {
    // Refresh cookie on session checks so active admin usage keeps the session alive
    response.cookies.set(
      ADMIN_SESSION_COOKIE,
      getSessionToken(),
      getAdminSessionCookieOptions(),
    );
  }

  return response;
}
