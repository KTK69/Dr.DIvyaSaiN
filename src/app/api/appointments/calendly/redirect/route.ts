import { NextResponse } from "next/server";
import { verifyCalendlyEvent } from "@/lib/calendly-verification";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const eventUri = url.searchParams.get("event");

  if (!eventUri) {
    return NextResponse.redirect(new URL("/contactus", request.url));
  }

  try {
    const confirmation = await verifyCalendlyEvent({ eventUri });
    if (!confirmation) {
      return NextResponse.redirect(new URL("/contactus", request.url));
    }

    return NextResponse.redirect(new URL("/contactus", request.url));
  } catch (error) {
    console.error("Calendly redirect verification failed", error);
    return NextResponse.redirect(new URL("/contactus", request.url));
  }
}