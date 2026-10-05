import { NextResponse } from "next/server";

// Calendly bookings are verified by the redirect route. This legacy widget
// callback remains disabled because the inline widget handles confirmation.
export async function POST() {
  return NextResponse.json(
    { ok: false, message: "Use the appointment confirmation redirect." },
    { status: 410 },
  );
}
