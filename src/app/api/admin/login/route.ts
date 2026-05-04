import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  getSessionMaxAge,
  getSessionToken,
  isValidCredentials,
} from "@/lib/admin-auth";

type LoginPayload = {
  username?: string;
  password?: string;
};

export async function POST(request: Request) {
  let payload: LoginPayload | null = null;

  try {
    payload = (await request.json()) as LoginPayload;
  } catch {
    payload = null;
  }

  const username = payload?.username ?? "";
  const password = payload?.password ?? "";

  if (!isValidCredentials(username, password)) {
    return NextResponse.json(
      { ok: false, message: "Invalid credentials" },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, getSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: getSessionMaxAge(),
    path: "/",
  });

  return response;
}
