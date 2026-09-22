import { NextResponse } from "next/server";
import { verifyCalendlyEvent } from "@/lib/calendly-verification";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const eventUri = url.searchParams.get("event");
  const inviteeUri = url.searchParams.get("invitee") ?? undefined;

  if (!eventUri) {
    return NextResponse.redirect(new URL("/contactus", request.url));
  }

  try {
    const confirmation = await verifyCalendlyEvent({ eventUri, inviteeUri });
    if (!confirmation?.token) {
      return NextResponse.redirect(new URL("/contactus", request.url));
    }

    return NextResponse.redirect(
      new URL(`/appointment-thank-you?token=${encodeURIComponent(confirmation.token)}`, request.url),
    );
  } catch (error) {
    console.error("Calendly redirect verification failed", error);
    return NextResponse.redirect(new URL("/contactus", request.url));
  }
}